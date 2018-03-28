import to from 'await-to-js';
import { Promise } from 'es6-promise';
import _ from 'lodash';
import {
	request,
} from '@/utils';
import { actions } from './reducer';
import __x from '@/state/__x';

const getTrackingInfo = (token, provider, resi) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.shipping.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));
	const [err, response] = await to(
		request({
			token,
			path: `${baseUrl}/track/${resi}?provider=${provider}`,
			method: 'GET',
			fullpath: true,
		})
	);

	if (err) {
		dispatch(actions.userGetTrackingInfo({ trackingInfo: false }));
		return Promise.reject(__x(err));
	};

	let trackingData = response.data.data;
	if (response.data.code !== 200) {
		trackingData = false;
	}
	dispatch(actions.userGetTrackingInfo({ trackingInfo: trackingData }));

	return Promise.resolve(response);
};


export {
	getTrackingInfo
};
