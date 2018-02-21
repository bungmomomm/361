import _ from 'lodash';
import { to } from 'await-to-js';

import { request } from '@/utils';
import { initLoading, initPcp, initNextPcp } from './reducer';
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
		return Promise.reject(err);
	}

	const pcpData = {
		links: response.data.data.links,
		info: response.data.data.info,
		facets: response.data.data.facets,
		sorts: response.data.data.sorts,
		products: response.data.data.products
	};

	// if (_.isEmpty(pcpData.products)) {
	// 	dispatch(initPcp({
	// 		isLoading: false,
	// 		pcpStatus: 'failed'
	// 	}));
	// 	return Promise.reject(new Error('Empty data'));
	// }

	if (loadNext) {
		dispatch(initNextPcp({
			pcpStatus: 'success',
			pcpData
		}));
	} else {
		dispatch(initPcp({
			isLoading: false,
			pcpStatus: 'success',
			pcpData
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

	return Promise.resolve(pcpData);
};

const discoveryUpdate = (response) => async dispatch => {
	const pcpData = {
		links: response.links,
		info: response.info,
		facets: response.facets,
		sorts: response.sorts,
		products: response.products
	};
	dispatch(initPcp({
		isLoading: false,
		pcpStatus: 'success',
		pcpData
	}));
};

export default {
	pcpAction,
	discoveryUpdate
};