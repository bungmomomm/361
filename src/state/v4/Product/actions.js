import { request } from '@/utils';
import { 
	productDetail, 
	productRecommendation, 
	productSimilar,
	productSocialSummary,
	productComment 
} from './reducer';

const productDetailAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}product/31`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const product = response.data.data;
		dispatch(productDetail({ detail: product.detail }));
	});
};

const productRecommendationAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}recommendation/pdp`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const recommendation = response.data.data;
		dispatch(productRecommendation({ recommendation }));
	});
};

const productSimilarAction = (token) => (dispatch) => {
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
	});
};

const productSocialSummaryAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}summary`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true,
		data: {
			variant_id: 100
		}
	}).then(response => {
		const data = response.data.data;
		const socialSummary = data.reviews;
		dispatch(productSocialSummary({ socialSummary }));
	});
};


const productCommentAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}comments`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true,
		data: {
			variant_id: 100
		}
	}).then(response => {
		const data = response.data.data;
		const comment = data.comments;
		dispatch(productComment({ comment }));
	});
};

export default {
	productDetailAction,
	productRecommendationAction,
	productSimilarAction,
	productSocialSummaryAction,
	productCommentAction
};