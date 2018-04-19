import _ from 'lodash';
import { to } from 'await-to-js';

import { request } from '@/utils';
import { pcpLoading, pcpViewMode, pcpInit, pcpNextInit, pcpUpdateSingleItem } from './reducer';
import { actions as scrollerActions } from '@/state/v4/Scroller';
import __x from '@/state/__x';

const updateSingleItem = (item) => async (dispatch, getState) => {
	dispatch(pcpUpdateSingleItem(item));
};

const pcpAction = ({ token, query = {}, loadNext = false }) => async (dispatch, getState) => {
	if (loadNext) {
		dispatch(scrollerActions.onScroll({ loading: true }));
	} else {
		dispatch(pcpLoading({ isLoading: true }));
	}

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.product.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/products/search`;

	const [err, response] = await to(request({
		token,
		path,
		method: 'GET',
		query,
		fullpath: true
	}));

	if (err) {
		dispatch(pcpInit({
			pcpStatus: 'failed'
		}));
		return Promise.reject(__x(err));
	}

	const pcpData = {
		...response.data.data
	};

	if (loadNext) {
		dispatch(pcpNextInit({
			pcpStatus: 'success',
			pcpData,
			query
		}));
	} else {
		dispatch(pcpInit({
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
	dispatch(pcpLoading({ isLoading: true }));

	let icon = null;
	switch (mode) {
	case 1:
		icon = 'ico_grid.svg';
		break;
	case 3:
		icon = 'ico_list.svg';
		break;
	default:
		icon = 'ico_grid-3x3.svg';
		break;
	}

	dispatch(pcpViewMode({
		viewMode: {
			mode,
			icon
		}
	}));
};

const loadingAction = (value) => (dispatch) => {
	dispatch(pcpLoading({ isLoading: value }));
};

export default {
	pcpAction,
	updateSingleItem,
	viewModeAction,
	loadingAction
};
