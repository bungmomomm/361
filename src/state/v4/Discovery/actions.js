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
	
	const url = `${baseUrl}/${promoType}`;

	if (!query.page) {
		query.page = 1;
	}
	query.per_page = configs.defaultPage;

	const [err, response] = await to(request({ token, path: url, method: 'GET', query, fullpath: true }));

	if (err) {
		return Promise.reject(err);
	}
	
	const promo = {};
	promo[promoType] = response.data.data;
	dispatch(promos({ promo }));

	const nextLink = promo[promoType].links && promo[promoType].links.next ? new URL(baseUrl + promo[promoType].links.next).searchParams : false;
	dispatch(scrollerActions.onScroll({
		nextData: { token, promoType, query: { ...query, page: nextLink ? nextLink.get('page') : false } },
		nextPage: nextLink !== false,
		loading: false,
		loader: promoAction
	}));

	return Promise.resolve(response);

};

export default {
	promoAction
};
