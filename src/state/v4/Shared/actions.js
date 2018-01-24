
import { request } from '@/utils';
import { totalBag, totalLoveList } from './reducer';

const totalCartAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}cart/total`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const total = response.data.data.total || 0;
		dispatch(totalBag({ totalCart: total }));
	});
};

const totalLovelistAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}total/bycustomer`;

	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const totalLovelist = response.data.data.total || 0;
		dispatch(totalLoveList({ totalLovelist }));
	});

};

export default {
	totalLovelistAction,
	totalCartAction
};