import { request } from '@/utils';
import _ from 'lodash';
import { infos, sellerProducts } from './reducer';
import { actions as scrollerActions } from '@/state/v4/Scroller';
import { to } from 'await-to-js';
import { Promise } from 'es6-promise';
// import { promo } from '@/data/translations';
import __x from '@/state/__x';

const configs = {
	defaultPage: 36
};

const initSeller = (token, sellerId) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || false;
	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));
	const url = `${baseUrl}/sellerrating/${sellerId}`;

	const [err, resp] = await to(request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}));

	if (err) {
		return Promise.reject(__x(err));
	}

	const data = _.chain(resp).get('data.data.seller').value() || {};
	dispatch(infos({ data }));

	return Promise.resolve(resp);
};

const getProducts = ({ token, query = {}, type = 'update' }) => async (dispatch, getState) => {
	dispatch(scrollerActions.onScroll({ loading: true }));

	const { shared, scroller: { nextData } } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.product.url').value() || false;
	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));
	const url = `${baseUrl}/products/search`;

	if (!query.page) {
		query.page = 1;
	}
	query.per_page = configs.defaultPage;

	const [err, resp] = await to(request({
		token,
		path: url,
		method: 'GET',
		query,
		fullpath: true
	}));

	if (err) {
		return Promise.reject(__x(err));
	}

	const data = _.chain(resp).get('data.data').value() || {};
	dispatch(sellerProducts({ data, type }));

	const nextLink = data.links && data.links.next ? new URL(baseUrl + data.links.next).searchParams : false;
	dispatch(scrollerActions.onScroll({
		nextData: {
			...nextData,
			type: type === 'init' ? 'update' : type,
			query: {
				...query,
				page: nextLink ? nextLink.get('page') : false
			}
		},
		nextPage: nextLink !== false,
		loading: false,
		loader: getProducts
	}));

	return Promise.resolve({
		data
	});
};

export default {
	initSeller,
	getProducts
};
