import to from 'await-to-js';
import { Promise } from 'es6-promise';
import _ from 'lodash';
import { request } from '@/utils';
import { promos } from './reducer';
import { actions as scrollerActions } from '@/state/v4/Scroller';

const configs = {
	defaultPage: 30
};

const promoAction = ({ token, promoType, query = {} }) => async (dispatch, getState) => {
	dispatch(scrollerActions.onScroll({ loading: true }));
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.promo.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));
	
	let type = promoType.replace('-', '_');

	const url = `${baseUrl}/${type}`;
	
	if (!query.page) {
		query.page = 1;
	}
	query.per_page = configs.defaultPage;
	
	const [err, response] = await to(request({ token, path: url, method: 'GET', query, fullpath: true }));

	if (err) {
		return Promise.reject(err);
	}
	type = type.split('?')[0].replace('_', '-');
	
	const promo = {};
	promo[type] = response.data.data;
	
	dispatch(promos({ promo }));

	const nextLink = promo[type].links && promo[type].links.next ? new URL(baseUrl + promo[type].links.next).searchParams : false;
	dispatch(scrollerActions.onScroll({
		nextData: { token, type, query: { ...query, page: nextLink ? nextLink.get('page') : false } },
		nextPage: nextLink !== false,
		loading: false,
		loader: promoAction
	}));

	return Promise.resolve(response);

};

export default {
	promoAction
};
