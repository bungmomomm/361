import { request } from '@/utils';
import { brandListUpdate, brandLoading, brandProducts, brandLoadingProducts, brandBanner, brandProductsComments } from './reducer';
import _ from 'lodash';
import to from 'await-to-js';
import { Promise } from 'es6-promise';

const brandListAction = (token, segment = 1) => async (dispatch, getState) => {
	dispatch(brandLoading({ loading: true }));

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.product.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));
	const [err, response] = await to(
		request({
			token,
			path: `${baseUrl}/brands`,
			method: 'GET',
			fullpath: true,
			query: {
				segment_id: segment
			}
		})
	);

	if (err) {
		dispatch(brandLoading({ loading: false }));
		return Promise.reject(err);
	};

	const brandList = response.data.data.items;
	dispatch(brandListUpdate({ brand_list: brandList, segment }));
	dispatch(brandLoading({ loading: false }));

	return Promise.resolve(response);
};

const brandProductAction = (token, brandId) => async (dispatch, getState) => {
	dispatch(brandLoadingProducts({ loading_products: true }));

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.product.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const [err, response] = await to(
		request({
			token,
			path: `${baseUrl}/products/search`,
			method: 'GET',
			fullpath: true,
			query: {
				brand_id: brandId
			}
		})
	);

	if (err) {
		dispatch(brandLoadingProducts({ loading_products: false }));
		return Promise.reject(err);
	};

	const products = response.data.data.products;
	const brandInfo = response.data.data.info;
	dispatch(brandProducts({ brand_id: brandId, products, brand_info: brandInfo }));
	dispatch(brandLoadingProducts({ loading_products: false }));
	return Promise.resolve(response);
};

const brandBannerAction = (token, brandId) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.promo.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const [err, response] = await to(
		request({
			token,
			path: `${baseUrl}/brand/banner`,
			method: 'GET',
			fullpath: true,
			query: {
				brand_id: brandId
			}
		})
	);

	if (err) return Promise.reject(err);

	const banner = response.data.data.banner;
	dispatch(brandBanner({ brand_id: brandId, banner }));
	return Promise.resolve(response);
};

const brandProductsCommentsAction = (token, productIds) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || false;

	if (!baseUrl) Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));
	const [err, response] = await to(
		request({
			token,
			path: `${baseUrl}/commentcount/bulkie/byproduct`,
			method: 'POST',
			fullpath: true,
			body: {
				product_id: productIds
			}
		})
	);
	if (err) return Promise.reject(err);

	const productsComments = response.data.data;

	dispatch(brandProductsComments({ products_comments: productsComments }));
	return Promise.resolve(response);
};

export default {
	brandListAction,
	brandProductAction,
	brandBannerAction,
	brandProductsCommentsAction
};