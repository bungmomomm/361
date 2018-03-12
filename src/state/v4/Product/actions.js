// this actions for PDP page
import to from 'await-to-js';
import { Promise } from 'es6-promise';
import _ from 'lodash';

import { request } from '@/utils';
import {
	productDetail,
	productRecommendation,
	productSimilar,
	productSocialSummary,
	productLoading
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
	
	return Promise.resolve(response);
};

// limited to be two products only => to do carousel on CatalogGrid view
const productRecommendationAction = (token, productId, page = 1, perPage = 2) => async (dispatch, getState) => {
	const { shared, home } = getState();
	const activeSegment = home.segmen.find(e => e.key === home.activeSegment);
	const baseUrl = _.chain(shared).get('serviceUrl.promo.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	dispatch(productLoading({ loading: true }));
	
	const [err, response] = await to(request({
		token,
		path: `${baseUrl}/recommended_products`,
		method: 'GET',
		fullpath: true,
		query: {
			segment_id: activeSegment.id,
			product_id: productId,
			page,
			per_page: perPage
		}
	}));
	if (err) {
		dispatch(productLoading({ loading: false }));
		return Promise.reject(err);
	}
	const recommendation = response.data.data;
	dispatch(productRecommendation({ recommendation }));
	dispatch(productLoading({ loading: false }));

	return Promise.resolve(response);

};

/**
 * Gets product similar items
 * @param {*} token 
 * @param {*} productId 
 */
const productSimilarAction = (token, productId, page = 1, perPage = 2) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.promo.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	dispatch(productLoading({ loading: true }));
	
	const [err, response] = await to(request({
		token,
		path: `${baseUrl}/similar_items`,
		method: 'GET',
		fullpath: true,
		query: {
			product_id: productId,
			page,
			per_page: perPage
		}
	}));

	if (err) {
		dispatch(productLoading({ loading: false }));
		return Promise.reject(err);	
	}
	
	const similar = response.data.data.products;
	dispatch(productSimilar({ similar }));
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

/**
 * @param {*} details 
 */
const getProductCardData = (details) => {
	if (!_.isEmpty(details)) {
		let productStock = 0;
		const productVariants = [];
		const variantsData = {};
		const images = details.images.map((img, idx) => {
			return { mobile: img.original };
		});

		try {
			if (!_.isEmpty(details.variants) && _.isArray(details.variants)) {
				details.variants.forEach((variant, idx) => {
					productStock += variant.stock;
					const optionsSet = ((typeof variant.options !== 'undefined') && _.isArray(variant.options) && variant.options.length > 0);
					if (optionsSet) {
						const variantSize = variant.options.filter(item => (item.key === 'size'));
						if (!_.isEmpty(variantSize) && variantSize.length > 0) {
							const val = variantSize[0].value.toLowerCase();
							productVariants.push({
								label: val,
								value: val,
								disabled: (typeof variant.stock !== 'undefined' && variant.stock === 0),
								data: variant
							});
							variantsData[val] = variant;
						}
					}
				});
			}
		} catch (error) {
			console.log('error: ', error);
		}

		return {
			brand: details.brand,
			images,
			pricing: details.price_range,
			product_title: details.title,
			totalLovelist: 0,
			totalComments: 0,
			variants: productVariants,
			variantsData,
			productStock
		};
	}
	return details;
};

export default {
	productDetailAction,
	productRecommendationAction,
	productSimilarAction,
	productSocialSummaryAction,
	getProductCardData
};