import { request } from '@/utils';
import { brandListUpdate, brandLoading, brandProducts, brandLoadingProducts, brandBanner, brandProductsComments, brandProductsLovelist, brandLoadingProductsComments } from './reducer';
import _ from 'lodash';
import to from 'await-to-js';
import { Promise } from 'es6-promise';
import { actions as scrollerActions } from '@/state/v4/Scroller';

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

const brandProductAction = (token, url = false, query) => async (dispatch, getState) => {
	dispatch(brandLoadingProducts({ loading_products: true }));
	dispatch(scrollerActions.onScroll({ loading: true }));

	let path = `${process.env.MICROSERVICES_URL}products/search`;
	if (url) {
		path = `${url.url}/products/search`;
	}

	const [err, response] = await to(request({
		token,
		path,
		method: 'GET',
		query,
		fullpath: true
	}));

	if (err) {
		dispatch(brandLoadingProducts({ loading_products: false }));
		dispatch(brandProducts({ searchStatus: 'failed' }));

		return Promise.reject(err);
	}

	const searchData = {
		...response.data.data
	};

	dispatch(brandLoadingProducts({ loading_products: false }));
	dispatch(brandProducts({
		searchStatus: 'success',
		searchData,
		query
	}));

	const nextLink = searchData.links && searchData.links.next ? new URL(searchData.links.next).searchParams : false;
	dispatch(scrollerActions.onScroll({
		nextData: {
			token,
			query: {
				...query,
				page: nextLink ? parseInt(nextLink.get('page'), 10) : false,
			}
		},
		nextPage: nextLink !== false,
		loading: false,
		loader: brandProductAction
	}));

	return Promise.resolve({
		searchStatus: 'success',
		searchData,
		query
	});

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
	dispatch(brandLoadingProductsComments({ loading_prodcuts_comments: true }));
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
	if (err) {
		dispatch(brandLoadingProductsComments({ loading_prodcuts_comments: false }));
		return Promise.reject(err);
	}

	const productsComments = response.data.data;

	dispatch(brandProductsComments({ productsComments }));
	dispatch(brandLoadingProductsComments({ loading_prodcuts_comments: false }));
	return Promise.resolve(response);
};

const brandProductsLovelistAction = (token, productIds) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.lovelist.url').value() || false;

	if (!baseUrl) Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));
	const [err, response] = await to(
		request({
			token,
			path: `${baseUrl}/bulkie/byproduct`,
			method: 'POST',
			fullpath: true,
			body: {
				product_id: productIds
			}
		})
	);
	if (err) return Promise.reject(err);

	const productsLovelist = response.data.data;
	console.log('brandProductsLovelistAction productsLovelist ', productsLovelist);

	dispatch(brandProductsLovelist({ products_lovelist: productsLovelist }));
	return Promise.resolve(response);
};

export default {
	brandListAction,
	brandProductAction,
	brandBannerAction,
	brandProductsCommentsAction,
	brandProductsLovelistAction
};