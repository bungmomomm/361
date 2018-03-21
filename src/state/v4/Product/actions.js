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
	allProductReviews
} from './reducer';

const productDetailAction = (token, productId) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.product.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	dispatch(productLoading({ loading: true }));

	const [err, response] = await to(request({
		token,
		path: `${baseUrl}/product/${productId}`,
		method: 'GET',
		fullpath: true
	}));

	if (err) {
		return Promise.reject(err);
	}

	const product = response.data.data;
	dispatch(productDetail({ detail: product.detail }));
	dispatch(productLoading({ loading: false }));

	return Promise.resolve(product);
};

const productStoreAction = (token, storeId, page = 1, perPage = 4) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.product.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

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
		return Promise.reject(err);
	}

	const store = response.data.data;
	dispatch(productStore({ store }));
	dispatch(productLoading({ loading: false }));

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

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	dispatch(productLoading({ loading: true }));

	const [err, response] = await to(request({
		token,
		path: `${baseUrl}/review/summary/${productId}`,
		method: 'GET',
		fullpath: true
	}));

	if (err) {
		return Promise.reject(err);
	}

	const socialSummary = response.data.data;

	dispatch(productSocialSummary({ socialSummary }));
	dispatch(productLoading({ loading: false }));

	return Promise.resolve(response);
};

const allProductReviewsAction = (token, productId, page = 1, perPage = 10) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	dispatch(productLoading({ loading: true }));

	const [err, response] = await to(request({
		token,
		path: `${baseUrl}/reviews/byproductid/${productId}`,
		method: 'GET',
		fullpath: true,
		query: {
			product_id: productId,
			page,
			per_page: perPage
		}
	}));

	if (err) {
		return Promise.reject(err);
	}

	const allReviews = response.data.data;
	dispatch(allProductReviews({ allReviews }));
	dispatch(productLoading({ loading: false }));

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

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	dispatch(productLoading({ loading: true }));

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
		return Promise.reject(err);
	}

	const promo = response.data.data;
	dispatch(productPromotion({ promo }));
	dispatch(productLoading({ loading: false }));

	return Promise.resolve(response);
};

/**
 * @param {*} details
 */
const getProductCardData = (details) => {
	if (!_.isEmpty(details)) {
		let productStock = 0;
		let hasVariantSize = false;
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
			hasVariantSize
		};
	}
	return details;
};

export default {
	productDetailAction,
	productSocialSummaryAction,
	productPromoAction,
	productStoreAction,
	getProductCardData,
	allProductReviewsAction
};