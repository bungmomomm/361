import { request } from '@/utils';

const itemsHasError = (bool) => {
	return {
		type: 'ITEMS_HAS_ERROR',
		hasError: bool
	};
};

const itemsIsLoading = (bool) => {
	return {
		type: 'ITEMS_IS_LOADING',
		isLoading: bool
	};
};

const itemsActiveHashtag = (tag) => {
	return {
		type: 'ITEMS_ACTIVE_HASHTAG',
		activeTag: tag ? tag.replace('#', '').toLowerCase() : (tag && !tag.indexOf('#')) ? tag : 'all'
	};
};

const switchViewMode = (mode) => {
	return {
		type: 'SWITCH_VIEW_MODE',
		viewMode: mode
	};
};

const affectDocHeight = (data) => {
	return {
		type: 'AFFECT_DOCHEIGHT',
		docHeight: data.height,
		activeTag: data.activeTag
	};
};

const switchAllowNextPage = (data) => {
	return {
		type: 'SWITCH_ALLOW_NEXT_PAGE',
		activeTag: data.activeTag,
		allowNextPage: data.allowNextPage
	};
};

const itemsFetchDataSuccess = (data) => {
	return {
		type: 'ITEMS_FETCH_DATA_SUCCESS',
		tags: data.hashtags,
		products: data.contents
	};
};

const itemsFetchData = (fetchData) => (dispatch) => {
	const url = process.env.MICROSERVICES_URL + fetchData.path;

	dispatch(itemsIsLoading(true));
	request({
		token: fetchData.token,
		path: url,
		method: 'GET',
		fullpath: true
	})
		.then((response) => {
			dispatch(itemsIsLoading(false));
			return response;
		})
		.then((items) => dispatch(itemsFetchDataSuccess(items.data.data)))
		.then(() => {
			const body = document.body;
			const html = document.documentElement;
			const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

			dispatch(affectDocHeight({
				height: docHeight,
				activeTag: fetchData.activeTag
			}));

			return {
				allowNextPage: fetchData.docHeight < docHeight,
				activeTag: fetchData.activeTag
			};

		})
		.then((reactivate) => {
			if (!reactivate.allowNextPage) {
				setTimeout(() => {
					dispatch(switchAllowNextPage({ allowNextPage: true, activeTag: reactivate.activeTag }));
				}, 20000);
			}
		})
		.catch(() => dispatch(itemsHasError(true)));
};

export default {
	itemsFetchData,
	itemsActiveHashtag,
	switchViewMode
};
