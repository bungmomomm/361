import _ from 'lodash';
import { to } from 'await-to-js';

import { request } from '@/utils';
import { initLoading, initViewMode, initPcp, initNextPcp } from './reducer';
import { actions as scrollerActions } from '@/state/v4/Scroller';

const pcpAction = ({ token, query = {}, loadNext = false }) => async (dispatch, getState) => {
	dispatch(initLoading({ isLoading: true }));
	if (loadNext) {
		dispatch(scrollerActions.onScroll({ loading: true }));
	}

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.product.url').value() || process.env.MICROSERVICES_URL;

	const path = `${baseUrl}/products/search`;

	const [err, response] = await to(request({
		token,
		path,
		method: 'GET',
		query,
		fullpath: true
	}));

	if (err) {
		dispatch(initPcp({
			isLoading: false,
			pcpStatus: 'failed'
		}));
		return Promise.reject(err);
	}

	const pcpData = {
		...response.data.data
	};

	if (loadNext) {
		dispatch(initNextPcp({
			pcpStatus: 'success',
			pcpData,
			query
		}));
	} else {
		dispatch(initPcp({
			isLoading: false,
			pcpStatus: 'success',
			pcpData,
			query
		}));
	}

	const nextLink = pcpData.links && pcpData.links.next ? new URL(baseUrl + pcpData.links.next).searchParams : false;
	dispatch(scrollerActions.onScroll({
		nextData: { 
			token,
			query: {
				...query,
				page: nextLink ? parseInt(nextLink.get('page'), 10) : false
			},
			loadNext: true
		},
		nextPage: nextLink !== false,
		loading: false,
		loader: pcpAction
	}));

	return Promise.resolve({
		pcpStatus: 'success',
		pcpData,
		query
	});
};

const viewModeAction = (mode) => (dispatch) => {
	dispatch(initLoading({ isLoading: true }));

	let icon = null;
	switch (mode) {
	case 1:
		icon = 'ico_grid.svg';
		break;
	case 2:
		icon = 'ico_three-line.svg';
		break;
	case 3:
		icon = 'ico_list.svg';
		break;
	default:
		icon = null;
	}

	dispatch(initViewMode({
		isLoading: false,
		viewMode: {
			mode,
			icon
		}
	}));
};

export default {
	pcpAction,
	viewModeAction
};