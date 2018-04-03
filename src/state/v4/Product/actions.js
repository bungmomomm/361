// this actions for PDP page
import to from 'await-to-js';
import { Promise } from 'es6-promise';
import _ from 'lodash';

import { request } from '@/utils';
import {
	productDetail,
	productSocialSummary,
	productPromotion,
	productLoading,
	productStore,
	allProductReviews,
	initialState
} from './reducer';
import __x from '@/state/__x';
import { actions as scrollerActions } from '@/state/v4/Scroller';

const productDetailAction = (token, productId) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.product.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	dispatch(productLoading({ loading: true }));

	const [err, response] = await to(request({
		token,
		path: `${baseUrl}/product/${productId}`,
		method: 'GET',
		fullpath: true
	}));

	if (err) {
		dispatch(productLoading({ loading: false }));
		return Promise.reject(__x(err));
	}

	const product = response.data.data;
	dispatch(productDetail({ detail: product.detail }));

	return Promise.resolve(product);
};

const productStoreAction = (token, storeId, page = 1, perPage = 4) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.product.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	dispatch(productLoading({ loading: true }));

	const [err, response] = await to(request({
		token,
		path: `${baseUrl}/products/search`,
		method: 'GET',
		fullpath: true,
		query: {
			store_id: storeId,
			page,
			per_page: perPage
		}
	}));

	if (err) {
		dispatch(productLoading({ loading: false }));
		return Promise.reject(__x(err));
	}

	const store = response.data.data;
	dispatch(productStore({ store }));

	return Promise.resolve(response);
};

/**
 * Gets product reviews summary
 * @param {*} token
 * @param {*} productId
 */
const productSocialSummaryAction = (token, productId) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	dispatch(productLoading({ loading: true }));

	const [err, response] = await to(request({
		token,
		path: `${baseUrl}/review/summary/${productId}`,
		method: 'GET',
		fullpath: true
	}));

	if (err) {
		dispatch(productLoading({ loading: false }));
		return Promise.reject(__x(err));
	}

	const socialSummary = response.data.data;
	dispatch(productSocialSummary({ socialSummary }));

	return Promise.resolve(response);
};

const allProductReviewsAction = ({ token, productId, query = { page: 1, per_page: 5 }, type = 'init' }) => async (dispatch, getState) => {
// const allProductReviewsAction = (token, productId, page = 1, perPage = 10) => async (dispatch, getState) => {
	
	dispatch(scrollerActions.onScroll({ loading: true }));
	dispatch(productLoading({ loading: true }));

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const [err, response] = await to(request({
		token,
		path: `${baseUrl}/reviews/byproductid/${productId}`,
		method: 'GET',
		fullpath: true,
		query: {
			...query
		}
	}));

	if (err) {
		dispatch(productLoading({ loading: false }));
		dispatch(scrollerActions.onScroll({ loading: false }));
		return Promise.reject(__x(err));
	}

	const allReviews = response.data.data;

	dispatch(productLoading({ loading: false }));
	dispatch(scrollerActions.onScroll({ loading: false }));
	dispatch(allProductReviews({ allReviews, type }));

	if (_.has(allReviews, 'info') && _.has(allReviews, 'info.total_review') && allReviews.info.total_review > 0) {
		type = 'update';
		const nextLink = allReviews.links && allReviews.links.next ? new URL(baseUrl + allReviews.links.next).searchParams : false;
		dispatch(scrollerActions.onScroll({
			nextData: {
				token,
				productId,
				query: {
					...query,
					page: nextLink ? parseInt(nextLink.get('page'), 10) : false
				},
				type,
				loadNext: true,
			},
			nextPage: nextLink !== false,
			loading: false,
			loader: allProductReviewsAction
		}));
	}

	return Promise.resolve(response);
};

/**
 * Gets promo meta_data, similar items, recommended items and best seller items
 * @param {*} token
 * @param {*} productId
 */
const productPromoAction = (token, productId) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.promo.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	dispatch(productLoading({ loading: true }));
	let { promo } = initialState;
	promo.loading = true;
	dispatch(productPromotion({ promo }));

	const [err, response] = await to(request({
		token,
		path: `${baseUrl}/product_promo`,
		method: 'GET',
		fullpath: true,
		query: {
			product_id: productId
		}
	}));

	if (err) {
		dispatch(productLoading({ loading: false }));
		return Promise.reject(__x(err));
	}

	// mapping meta data
	promo = response.data.data;
	promo.loading = false;
	const metaData = {
		ovo_info: '',
		ovo_reward: 0
	};

	if (_.isEmpty(promo.meta_data) || _.isNull(promo.meta_data)) {
		promo.meta_data = metaData;
	}

	dispatch(productPromotion({ promo }));

	return Promise.resolve(response);
};

/**
 * @param {*} details
 */
const getProductCardData = (details) => {
	if (!_.isEmpty(details)) {
		let productStock = 0;
		let hasVariantSize = false;
		let hasSizeGuide = false;
		let specs = [];
		const productVariants = [];
		const variantsData = {};
		const images = details.images.map((img, idx) => {
			return { mobile: img.original };
		});

		try {
			if (!_.isEmpty(details.variants) && _.isArray(details.variants)) {
				if (details.variants.length === 1) {
					const variant = details.variants[0];
					productStock = variant.stock;

					// Product has variant size but only one variant
					if (variant.options.length === 1) {
						hasVariantSize = true;
						const variantSize = variant.options[0];
						const val = variantSize.value.toLowerCase();
						productVariants.push({
							label: val,
							value: val,
							disabled: (typeof variant.stock !== 'undefined' && variant.stock === 0),
							data: variant
						});
						variantsData[val] = variant;
					} else {
						productVariants.push(variant);
					}
				} else {
					// product has more than one variant size
					details.variants.forEach((variant, idx) => {
						productStock += variant.stock;
						const optionsSet = ((typeof variant.options !== 'undefined') && _.isArray(variant.options) && variant.options.length === 1);
						hasVariantSize = optionsSet;

						// pushing variant
						if (optionsSet) {
							// As discussed with YK and Meiliana that each variant has one option (size) only
							// Except 'size' options it will be put on 'spec' => see API product detail response.
							const variantSize = variant.options[0];
							const val = variantSize.value.toLowerCase();
							productVariants.push({
								label: val,
								value: val,
								disabled: (typeof variant.stock !== 'undefined' && variant.stock === 0),
								data: variant
							});
							variantsData[val] = variant;
						}
					});
				}

				// maps seize guide value from product spec...
				specs = details.spec.filter((item) => {
					const specKey = item.key.toLowerCase().trim();
					if (specKey.indexOf('size') === -1 && specKey.indexOf('guide') === -1) {
						return true;
					}

					if (!_.isEmpty(item) && _.has(item, 'value')) {
						hasSizeGuide = true;
						window.sizeGuide = item.value;
					}
					return false;
				});
			}
		} catch (error) {
			throw error;
		}

		return {
			brand: details.brand,
			images,
			pricing: details.price_range,
			product_title: details.title,
			totalLovelist: 0,
			variants: productVariants,
			variantsData,
			productStock,
			hasVariantSize,
			specs,
			hasSizeGuide
		};
	}
	return details;
};

const productLoadingAction = (value) => (dispatch) => {
	dispatch(productLoading({ loading: value }));
};

const encodeSpecialChar = (html) => {
	const txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};

export default {
	productDetailAction,
	productSocialSummaryAction,
	productPromoAction,
	productStoreAction,
	getProductCardData,
	allProductReviewsAction,
	productLoadingAction,
	encodeSpecialChar
};
