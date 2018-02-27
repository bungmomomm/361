import to from 'await-to-js';
import { Promise } from 'es6-promise';
import _ from 'lodash';
import { actions } from './reducer';
import {
	request,
	getClientSecret
} from '@/utils';

const userSocialLogin = (token, provider, accessToken) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	dispatch(actions.userSocialLogin());
	let path = `${baseUrl}/auth/fblogin`;
	if (provider === 'google') {
		path = `${baseUrl}/auth/googlelogin`;
	}
	const [err, response] = await to(request({
		token,
		method: 'POST',
		path,
		fullpath: true,
		body: {
			client_secret: getClientSecret(),
			access_token: accessToken
		}
	}));

	if (err) {
		dispatch(actions.userLoginFail(err));
		return Promise.reject(err);
	}

	dispatch(actions.userLoginSuccess(response.data.data.info));
	return Promise.resolve({
		userprofile: response.data.data.info,
		token: {
			token: response.data.data.token,
			expires_in: response.data.data.expires_in,
			refresh_token: response.data.data.refresh_token
		}
	});
};

export {
	userSocialLogin
};