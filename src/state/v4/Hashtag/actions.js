import { request } from '@/utils';
import actions from './reducer';

const itemsActiveHashtag = (tag) => (dispatch) => {
	const data = {
		activeTag: tag ? tag.replace('#', '').toLowerCase() : (tag && !tag.indexOf('#')) ? tag : 'all'
	};
	dispatch(actions.itemsActiveHashtag(data));
};

const switchViewMode = (mode) => (dispatch) => {
	const data = { viewMode: mode };
	dispatch(actions.switchViewMode(data));
};

const itemsFetchData = (fetchData) => (dispatch) => {
	const url = process.env.MICROSERVICES_URL + fetchData.path;

	dispatch(actions.itemsIsLoading({ isLoading: true }));
	request({
		token: fetchData.token,
		path: url,
		method: 'GET',
		fullpath: true
	})
	.then((response) => {
		dispatch(actions.itemsIsLoading({ isLoading: false }));
		return response;
	})
	.then((items) => dispatch(actions.itemsFetchDataSuccess({
		tags: items.data.data.hashtags,
		products: items.data.data.contents
	})))
	.then(() => {
		const body = document.body;
		const html = document.documentElement;
		const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

		dispatch(actions.affectDocheight({
			docHeight: height,
			activeTag: fetchData.activeTag
		}));

		return {
			allowNextPage: fetchData.docHeight < height,
			activeTag: fetchData.activeTag
		};

	})
	.then((reactivate) => {
		if (!reactivate.allowNextPage) {
			setTimeout(() => {
				dispatch(actions.switchAllowNextPage({ allowNextPage: true, activeTag: reactivate.activeTag }));
			}, 20000);
		}
	})
	.catch(() => dispatch(actions.itemsHasError({ hasError: true })));
};

export default {
	itemsFetchData,
	itemsActiveHashtag,
	switchViewMode
};
