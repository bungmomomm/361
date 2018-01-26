import { request } from '@/utils';
import { newArrival, bestSeller } from './reducer';

const configs = {
	defaultPage: 30
};

const bestSellerAction = (token, props = false, query = {}) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}bestseller`;
	
	if (!query.page) {
		query.page = 1;
	}
	query.per_page = configs.defaultPage;
	return request({
		token,
		path: url,
		method: 'GET',
		query,
		fullpath: true
	}).then(response => {
		const data = {
			bestSellerData: response.data.data
		};
		dispatch(bestSeller(data));
	});
};

const newArrivalAction = (token, props = false, query = {}) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}newarrival`;
	if (!query.page) {
		query.page = 1;
	}
	query.per_page = configs.defaultPage;
	return request({
		token,
		path: url,
		method: 'GET',
		query,
		fullpath: true
	}).then(response => {
		const data = {
			newArrivalData: response.data.data
		};
		dispatch(newArrival(data));
	});
};

export default {
	newArrivalAction,
	bestSellerAction,
};