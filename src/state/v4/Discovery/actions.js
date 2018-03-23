import to from 'await-to-js';
import { Promise } from 'es6-promise';
import _ from 'lodash';
import { request } from '@/utils';
import { promoLoading, promoViewMode, promoInit, promoNextInit } from './reducer';
import { actions as scrollerActions } from '@/state/v4/Scroller';

const promoAction = ({ token, promoType, query = {}, loadNext = false }) => async (dispatch, getState) => {
	if (loadNext) {
		dispatch(scrollerActions.onScroll({ loading: true }));
	} else {
		dispatch(promoLoading({ isLoading: true }));
	}

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.promo.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));
	
	const path = `${baseUrl}/${promoType}`;

	const [err, response] = await to(request({
		token,
		path,
		method: 'GET',
		query,
		fullpath: true
	}));

	if (err) {
		return Promise.reject(err);
	}

	const type = promoType.replace('_', '-');
	const promo = {};
	promo[type] = {
		...response.data.data
	};

	if (loadNext) {
		dispatch(promoNextInit({ promo }));
	} else {
		dispatch(promoInit({ promo }));
	}

	const nextLink = promo[type].links && promo[type].links.next ? new URL(baseUrl + promo[type].links.next).searchParams : false;
	dispatch(scrollerActions.onScroll({
		nextData: {
			token,
			promoType,
			query: {
				...query,
				page: nextLink ? parseInt(nextLink.get('page'), 10) : false
			},
			loadNext: true
		},
		nextPage: nextLink !== false,
		loading: false,
		loader: promoAction
	}));

	return Promise.resolve(promo[type]);
};

const viewModeAction = (mode) => (dispatch) => {
	dispatch(promoLoading({ isLoading: true }));

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

	dispatch(promoViewMode({
		viewMode: {
			mode,
			icon
		}
	}));
};

const loadingAction = (value) => (dispatch) => {
	dispatch(promoLoading({ isLoading: value }));
};

export default {
	promoAction,
	viewModeAction,
	loadingAction
};
