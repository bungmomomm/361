import { request } from '@/utils';
import { brandList, brandLoading, brandProducts, brandLoadingProducts, brandBanner } from './reducer';

const brandListAction = (token, segment = 1) => (dispatch) => {
	dispatch(brandLoading({ loading: true }));
	const url = `${process.env.MICROSERVICES_URL}brand/gets`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true,
		query: {
			segment_id: segment
		}
	}).then(response => {
		const data = response.data.data;
		dispatch(brandList({ data, segment }));
		dispatch(brandLoading({ loading: false }));
	});
};

const brandProductAction = (token, brandId) => (dispatch) => {
	dispatch(brandLoadingProducts({ loading_products: true }));
	const url = `${process.env.MICROSERVICES_URL}products/search`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true,
		query: {
			brand_id: brandId
		}
	}).then(response => {
		const products = response.data.data.products;
		dispatch(brandProducts({ brand_id: brandId, products }));
		dispatch(brandLoadingProducts({ loading_products: false }));
	});
};

const brandBannerAction = (token, brandId) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}categories/banner`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true,
		query: {
			brand_id: brandId
		}
	}).then(response => {
		const banner = response.data.data.banner;
		dispatch(brandBanner({ brand_id: brandId, banner }));
	});
};

export default {
	brandListAction,
	brandProductAction,
	brandBannerAction
};