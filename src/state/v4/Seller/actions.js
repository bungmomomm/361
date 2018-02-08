import { request } from '@/utils';
import _ from 'lodash';
import { infos, sellerProducts } from './reducer';
import { actions as scrollerActions } from '@/state/v4/Scroller';
// import { promo } from '@/data/translations';

const configs = {
	defaultPage: 30
};

const initSeller = (token, sellerId, query = {}) => (dispatch, getState) => {
	dispatch(scrollerActions.onScroll({ loading: true }));

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || process.env.MICROSERVICES_URL;
	const url = `${baseUrl}/sellerrating/${sellerId}`;

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
	}).then(resp => {
		const data = _.chain(resp).get('data.data.seller').value() || {};
		dispatch(infos({ data }));
		return resp.data.code && resp.data.code === 200;
	}).catch((err) => {
		console.log(err);
	});
};

const getProducts = ({ token, query = {} }) => (dispatch, getState) => {
	dispatch(scrollerActions.onScroll({ loading: true }));

	const { shared, scroller: { nextData } } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.product.url').value() || process.env.MICROSERVICES_URL;
	const url = `${baseUrl}/products/search`;

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
	}).then(resp => {
		const data = _.chain(resp).get('data.data').value() || {};
		dispatch(sellerProducts({ data }));

		const nextLink = data.links && data.links.next ? new URL(baseUrl + data.links.next).searchParams : false;
		dispatch(scrollerActions.onScroll({
			nextData: {
				...nextData,
				query: {
					...query,
					page: nextLink ? nextLink.get('page') : false
				}
			},
			nextPage: nextLink !== false,
			loading: false,
			loader: getProducts
		}));
	});
};

export default {
	initSeller,
	getProducts
};
