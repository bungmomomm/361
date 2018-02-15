import { request } from '@/utils';
import { brandListUpdate, brandLoading, brandProducts, brandLoadingProducts, brandBanner } from './reducer';
import _ from 'lodash';
import to from 'await-to-js';
import { Promise } from 'es6-promise';

const brandListAction = (token, segment = 1) => async (dispatch, getState) => {
	dispatch(brandLoading({ loading: true }));

	const { shared } = getState();
	let baseUrl = _.chain(shared).get('serviceUrl.lovelist.url').value() || false;

	// TODO: need to enable baseUrl checking while api ready
	if (true) baseUrl = process.env.MICROSERVICES_URL;
	// if (!baseUrl) baseUrl = process.env.MICROSERVICES_URL;

	// const url = `${process.env.MICROSERVICES_URL}brand/gets`;
	const [err, response] = await to(
		request({
			token,
			path: `${baseUrl}brands`,
			// path: `${baseUrl}brand/gets`,
			method: 'GET',
			fullpath: true,
			query: {
				segment_id: segment
			}
		})
	);

	if (response) {
		const brandList = response.data.data.items;
		dispatch(brandListUpdate({ brand_list: brandList, segment }));
		dispatch(brandLoading({ loading: false }));

		return Promise.resolve(response);
	};

	if (err) {
		dispatch(brandLoading({ loading: false }));
		return Promise.reject(err);
	};

	return false;
};

const brandProductAction = (token, brandId) => async (dispatch, getState) => {
	dispatch(brandLoadingProducts({ loading_products: true }));

	const { shared } = getState();
	let baseUrl = _.chain(shared).get('serviceUrl.lovelist.url').value() || false;

	// TODO: need to enable baseUrl checking while api ready
	if (true) baseUrl = process.env.MICROSERVICES_URL;
	// if (!baseUrl) baseUrl = process.env.MICROSERVICES_URL;

	// const url = `${process.env.MICROSERVICES_URL}products/search`;
	const [err, response] = await to(
		request({
			token,
			path: `${baseUrl}products/search`,
			method: 'GET',
			fullpath: true,
			query: {
				brand_id: brandId
			}
		})
	);

	if (response) {
		const products = response.data.data.products;
		const brandInfo = response.data.data.info;
		dispatch(brandProducts({ brand_id: brandId, products, brand_info: brandInfo }));
		dispatch(brandLoadingProducts({ loading_products: false }));
		return Promise.resolve(response);
	}

	if (err) {
		dispatch(brandLoadingProducts({ loading_products: false }));
		return Promise.reject(err);
	};

	return false;
};

const brandBannerAction = (token, brandId) => async (dispatch, getState) => {

	const { shared } = getState();
	let baseUrl = _.chain(shared).get('serviceUrl.lovelist.url').value() || false;

	// TODO: need to enable baseUrl checking while api ready
	if (true) baseUrl = process.env.MICROSERVICES_URL;
	// if (!baseUrl) baseUrl = process.env.MICROSERVICES_URL;

	// const url = `${process.env.MICROSERVICES_URL}categories/banner`;
	const [err, response] = await to(
		request({
			token,
			path: `${baseUrl}categories/banner`,
			method: 'GET',
			fullpath: true,
			query: {
				brand_id: brandId
			}
		})
	);

	if (response) {
		const banner = response.data.data.banner;
		dispatch(brandBanner({ brand_id: brandId, banner }));
		return Promise.resolve(response);
	};

	if (err) return Promise.reject(err);

	return false;

};

export default {
	brandListAction,
	brandProductAction,
	brandBannerAction
};