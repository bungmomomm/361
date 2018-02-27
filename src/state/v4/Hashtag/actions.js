import { request } from '@/utils';
import actions from './reducer';
import { actions as scrollerActions } from '@/state/v4/Scroller';
import _ from 'lodash';
import { to } from 'await-to-js';

const configs = {
	defaultPage: 20
};

const getQuery = (hashtag) => {
	const tag = hashtag.active.tag;
	const node = hashtag.active.node;
	const limit = configs.defaultPage;

	const filtr = hashtag.tags.filter((obj) => {
		return obj.hashtag === tag;
	});

	if (hashtag.products[node] && (!hashtag.products[node].links || !hashtag.products[node].links.next)) {
		return false;
	}

	const tagId = (typeof filtr !== 'undefined' && Array.isArray(filtr) && filtr[0] && filtr[0].campaign_id) ? filtr[0].campaign_id : false;
	const nextLink = !hashtag.products[node] || !hashtag.products[node].links || !hashtag.products[node].links.next
					? false : new URL(`http://mm.m${hashtag.products[node].links.next}`).searchParams;

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
			tag: tag || 'All',
			node: tag ? tag.replace('#', '').toLowerCase() : (tag && !tag.indexOf('#') !== -1) ? tag : 'all'
		}
	};
	dispatch(actions.itemsActiveHashtag(data));
	const { hashtag, scroller } = getState();
	const q = getQuery(hashtag);

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
	const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || process.env.MICROSERVICES_URL;

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
		products: resp.data.data.contents,
		links: resp.data.data.links
	}));

	const { hashtag } = getState();
	const q = getQuery(hashtag);

	dispatch(scrollerActions.onScroll({
		nextData: { token, query: q ? q.query : {} },
		nextPage: q ? q.nextPage : false,
		loading: false
	}));

	return Promise.resolve(resp);
};

const initHashtags = (token, hash) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrlPromo = _.chain(shared).get('serviceUrl.promo.url').value() || process.env.MICROSERVICES_URL;

	const urlInit = `${baseUrlPromo}/mainpromo?segment_id=1`;

	const [errPromo, initResp] = await to(request({
		token,
		path: urlInit,
		method: 'GET',
		fullpath: true
	}));

	if (errPromo) {
		dispatch(actions.itemsHasError({ hasError: errPromo }));
		return Promise.reject(errPromo);
	} else if (!_.chain(initResp).get('data.data.hashtag.campaign_id').value()) {
		return Promise.reject('Whoops we don\'t have feeds yet, come again later!');
	}

	const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || process.env.MICROSERVICES_URL;

	const url = `${baseUrl}/campaign`;
	const query = {
		page: 1,
		per_page: configs.defaultPage,
		campaign_id: _.chain(initResp).get('data.data.hashtag.campaign_id').value()
	};

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

	dispatch(actions.itemsActiveHashtag({
		active: {
			tag: hash || 'All',
			node: hash ? hash.replace('#', '').toLowerCase() : (hash && !hash.indexOf('#')) ? hash : 'all'
		}
	}));

	dispatch(actions.initFetchDataSuccess({
		header: resp.data.data.header_intro,
		tags: Array.from(resp.data.data.hashtags.reduce((m, t) => m.set(t.campaign_id, t), new Map()).values()),
		products: resp.data.data.contents,
		links: resp.data.data.links
	}));

	const { hashtag } = getState();
	const q = getQuery(hashtag);

	dispatch(scrollerActions.onScroll({
		nextData: { token, query: q ? q.query : {} },
		nextPage: q ? q.nextPage : false,
		loading: false,
		loader: itemsFetchData
	}));

	return Promise.resolve(resp);
};

export default {
	itemsFetchData,
	itemsActiveHashtag,
	switchViewMode,
	getQuery,
	initHashtags
};
