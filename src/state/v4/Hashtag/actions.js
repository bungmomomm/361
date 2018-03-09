import { request } from '@/utils';
import actions from './reducer';
import { actions as scrollerActions } from '@/state/v4/Scroller';
import _ from 'lodash';
import { to } from 'await-to-js';
import { Promise } from 'es6-promise';

const configs = {
	defaultPage: 20
};

const getQuery = () => (dispatch, getState) => {
	const { hashtag } = getState();
	const tag = hashtag.active.tag;
	const node = hashtag.active.node;
	const limit = configs.defaultPage;

	const filtr = hashtag.tags.filter((obj) => {
		return (obj.hashtag === tag || obj.hashtag === tag.replace('#', ''));
	});

	const tagId = (typeof filtr !== 'undefined' && Array.isArray(filtr) && filtr[0] && filtr[0].campaign_id) ? filtr[0].campaign_id : false;
	const nextUrl = !hashtag.products[node] ? `${process.env.MOBILE_URL}?page=1`
					: (hashtag.products[node].links && !hashtag.products[node].links.next) ? false
					: (hashtag.products[node].links.next.indexOf('http') === -1) ? `${process.env.MOBILE_URL}${hashtag.products[node].links.next}`
					: hashtag.products[node].links.next;

	const nextLink = (nextUrl && new URL(nextUrl).searchParams) || false;

	let query = { per_page: limit };
	query = (nextLink) ? { ...query, page: nextLink.get('page') } : query;
	if (tagId) {
		query = { ...query, campaign_id: tagId };
	} else if (!tagId && query.campaign_id) {
		delete query.campaign_id;
	}

	return {
		nextPage: nextLink !== false,
		query
	};
};

const itemsActiveHashtag = (tag) => (dispatch, getState) => {
	const data = {
		active: {
			tag,
			node: tag.replace('#', '').toLowerCase()
		}
	};
	dispatch(actions.itemsActiveHashtag(data));
	const { scroller } = getState();
	const q = dispatch(getQuery());

	dispatch(scrollerActions.onScroll({
		nextData: { ...scroller.nextData, query: q ? q.query : {} },
		nextPage: q ? q.nextPage : false,
		loading: false
	}));
};

const switchViewMode = (mode) => (dispatch) => {
	const data = { viewMode: mode };
	dispatch(actions.switchViewMode(data));
};

const itemsFetchData = ({ token, query = {} }) => async (dispatch, getState) => {
	dispatch(scrollerActions.onScroll({ loading: true }));

	const { shared } = getState();

	const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || false;
	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const url = `${baseUrl}/campaign`;

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
		dispatch(actions.itemsHasError({ hasError: err }));
		return Promise.reject(err);
	}

	dispatch(actions.itemsFetchDataSuccess({
		products: resp.data.data.contents || [],
		links: resp.data.data.links
	}));

	const q = dispatch(getQuery());

	dispatch(scrollerActions.onScroll({
		nextData: { token, query: q ? q.query : {} },
		nextPage: q ? q.nextPage : false,
		loading: false
	}));

	return Promise.resolve(resp);
};

const initHashtags = (token, hash) => async (dispatch, getState) => {
	const { shared } = getState();

	const baseUrlPromo = _.chain(shared).get('serviceUrl.promo.url').value() || false;
	if (!baseUrlPromo) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const urlInit = `${baseUrlPromo}/mainpromo?segment_id=1`;
	const [errPromo, respPromo] = await to(request({
		token,
		path: urlInit,
		method: 'GET',
		fullpath: true
	}));

	if (errPromo) {
		dispatch(actions.itemsHasError({ hasError: errPromo }));
		return Promise.reject(errPromo);
	} else if (_.chain(respPromo).get('data.data.hashtag.campaign_id').value() === undefined) {
		return Promise.reject('Whoops sorry, no feeds to show you for now.');
	}

	const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || false;
	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const url = `${baseUrl}/campaign`;
	let query = {
		page: 1,
		per_page: configs.defaultPage,
		campaign_id: respPromo.data.data.hashtag.campaign_id
	};
	const [errInit, respInit] = await to(request({
		token,
		path: url,
		method: 'GET',
		query,
		fullpath: true
	}));
	if (errInit) {
		dispatch(actions.itemsHasError({ hasError: errInit }));
		return Promise.reject(errInit);
	}
	dispatch(actions.itemsActiveHashtag({
		active: {
			tag: hash || respPromo.data.data.hashtag.hashtag,
			node: hash ? hash.replace('#', '').toLowerCase() : respPromo.data.data.hashtag.hashtag.replace('#', '').toLowerCase()
		}
	}));
	dispatch(actions.initFetchDataSuccess({
		header: respInit.data.data.header_intro,
		tags: Array.from(respInit.data.data.hashtags.reduce((m, t) => m.set(t.campaign_id, t), new Map()).values()),
	}));

	const q = dispatch(getQuery());
	query = q.query;

	return dispatch(itemsFetchData({ token, query }));
};

export default {
	itemsFetchData,
	itemsActiveHashtag,
	switchViewMode,
	getQuery,
	initHashtags
};
