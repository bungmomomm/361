import { request } from '@/utils';
import { productDetail } from './reducer';

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

export default {
	productDetailAction,
};