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
import {
	commentTotal
} from '@/state/v4/Comment/reducer';

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

const productRecommendationAction = (token) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.product.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	dispatch(productLoading({ loading: true }));
	
	const [err, response] = await to(request({
		token,
		path: `${baseUrl}/recommendation/pdp`,
		method: 'GET',
		fullpath: true
	}));
	if (err) {
		return Promise.reject(err);
	}
	const recommendation = response.data.data;
	dispatch(productRecommendation({ recommendation }));
	dispatch(productLoading({ loading: false }));

	return Promise.resolve(response);

};

const productSimilarAction = (token) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.product.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	dispatch(productLoading({ loading: true }));
	
	const [err, response] = await to(request({
		token,
		path: `${baseUrl}/similaritems`,
		method: 'GET',
		fullpath: true,
		data: {
			variant_id: 100
		}
	}));

	if (err) {
		return Promise.reject(err);	
	}
	
	const similar = response.data.data.products;
	dispatch(productSimilar({ similar }));
	dispatch(productLoading({ loading: false }));

	return Promise.resolve(response);
};

const productSocialSummaryAction = (token, productId) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.product.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	dispatch(productLoading({ loading: true }));
	
	const [err, response] = await to(request({
		token,
		path: `${baseUrl}/review/summary/${productId}`,
		method: 'GET',
		fullpath: true,
		data: {
			variant_id: 100
		}
	}));

	if (err) {
		return Promise.reject(err);
	}
	
	const data = response.data.data;
	const reviews = data.reviews;
	const comments = data.comments;
	dispatch(productSocialSummary({ reviews }));
	dispatch(commentTotal({ ...comments }));
	dispatch(productLoading({ loading: false }));

	return Promise.resolve(response);
};

/**
 * @param {*} details 
 */
const getProductCardData = (details) => {
	if (details) {
		const currentVariant = details.variants.find(product => product.id === 5225328);
		// const currentVariant = details.variants.find(product => product.id === details.id);
		const images = details.images.map((img, idx) => {
			return { mobile: img.original };
		});

		return {
			brand: details.brand.brand_name,
			images,
			pricing: currentVariant.pricing,
			product_title: details.title,
			lovelistTotal: 1230
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