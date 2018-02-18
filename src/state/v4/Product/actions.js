// this actions for PDP page

import { request } from '@/utils';
import {
	productDetail,
	productRecommendation,
	productSimilar,
	productSocialSummary,
	productLoading
} from './reducer';

const productDetailAction = (token, productId) => (dispatch) => {
	dispatch(productLoading({ loading: true }));
	const url = `${process.env.MICROSERVICES_URL}product/${productId}`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const product = response.data.data;
		dispatch(productDetail({ detail: product.detail }));
		dispatch(productLoading({ loading: false }));
	}).catch((error) => {
		console.log(error);
	});
};

const productRecommendationAction = (token) => (dispatch) => {
	dispatch(productLoading({ loading: true }));
	const url = `${process.env.MICROSERVICES_URL}recommendation/pdp`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const recommendation = response.data.data;
		dispatch(productRecommendation({ recommendation }));
		dispatch(productLoading({ loading: false }));
	});
};

const productSimilarAction = (token) => (dispatch) => {
	dispatch(productLoading({ loading: true }));
	const url = `${process.env.MICROSERVICES_URL}similaritems`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true,
		data: {
			variant_id: 100
		}
	}).then(response => {
		const similar = response.data.data.products;
		dispatch(productSimilar({ similar }));
		dispatch(productLoading({ loading: false }));
	});
};

const productSocialSummaryAction = (token, productId) => (dispatch) => {
	dispatch(productLoading({ loading: true }));
	const url = `${process.env.MICROSERVICES_URL}review/summary/${productId}`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true,
		data: {
			variant_id: 100
		}
	}).then(response => {
		const socialSummary = response.data.data;
		dispatch(productSocialSummary({ socialSummary }));
		dispatch(productLoading({ loading: false }));
	});
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
			totalLovelist: details.totalLovelist,
			totalComments: details.totalComments
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