import { request } from '@/utils';
import actions from './reducer';
import { actions as scrollerActions } from '@/state/v4/Scroller';
import _ from 'lodash';

const getQuery = (hashtag) => {
	const tag = hashtag.active.tag;
	const node = hashtag.active.node;
	const filtr = hashtag.tags.filter((obj) => {
		return obj.hashtag === tag;
	});

	if (hashtag.products[node] && (!hashtag.products[node].links || !hashtag.products[node].links.next)) {
		return false;
	}

	const tagId = (typeof filtr !== 'undefined' && Array.isArray(filtr) && filtr[0] && filtr[0].id) ? filtr[0].id : false;
	const nextLink = !hashtag.products[node] || !hashtag.products[node].links || !hashtag.products[node].links.next
					? false : new URL(hashtag.products[node].links.next).searchParams;

	let query = {};
	query = (nextLink) ? { ...query, page: nextLink.get('page') } : query;
	if (tagId) {
		query = { ...query, hashtag_id: tagId };
	} else if (!tagId && query.hashtag_id) {
		delete query.hashtag_id;
	}

	return {
		nextPage: nextLink !== false,
		query
	};
};

const itemsActiveHashtag = (tag) => (dispatch, getState) => {
	const data = {
		active: {
			tag: tag || '#All',
			node: tag ? tag.replace('#', '').toLowerCase() : (tag && !tag.indexOf('#')) ? tag : 'all'
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

const itemsFetchData = ({ token, query = {} }) => (dispatch, getState) => {
	dispatch(scrollerActions.onScroll({ loading: true }));

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || process.env.MICROSERVICES_URL;

	const url = `${baseUrl}/hashtags`;
	request({
		token,
		path: url,
		method: 'GET',
		query,
		fullpath: true
	})
	.then((resp) => {
		dispatch(actions.itemsFetchDataSuccess({
			tags: resp.data.data.hashtags,
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
	})
	.catch((err) => dispatch(actions.itemsHasError({ hasError: err })));
};

const initHashtags = (token, hash) => (dispatch, getState) => {

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || process.env.MICROSERVICES_URL;

	const url = `${baseUrl}/hashtags`;
	request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	})
	.then((resp) => {
		dispatch(actions.itemsActiveHashtag({
			active: {
				tag: hash || '#All',
				node: hash ? hash.replace('#', '').toLowerCase() : (hash && !hash.indexOf('#')) ? hash : 'all'
			}
		}));

		dispatch(actions.itemsFetchDataSuccess({
			tags: resp.data.data.hashtags,
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
	})
	.catch((err) => dispatch(actions.itemsHasError({ hasError: err })));
};

export default {
	itemsFetchData,
	itemsActiveHashtag,
	switchViewMode,
	getQuery,
	initHashtags
};
