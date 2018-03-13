// this actions for PDP page
import to from 'await-to-js';
import { Promise } from 'es6-promise';
import _ from 'lodash';

import { request } from '@/utils';
import {
	productDetail,
	productSocialSummary,
	productPromotion,
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
	productSocialSummaryAction,
	productPromoAction,
	getProductCardData
};