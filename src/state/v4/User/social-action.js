import to from 'await-to-js';
import { Promise } from 'es6-promise';
import _ from 'lodash';
import { actions } from './reducer';
import {
	request,
	getClientSecret
} from '@/utils';
import __x from '@/state/__x';

const userSocialLogin = (token, provider, accessToken) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

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
		dispatch(actions.userLoginFail(err.response.data));
		return Promise.reject(__x(err.response.data));
	}

	const data = _.chain(response);

	dispatch(actions.userLoginSuccess(response.data.data.info));
	return Promise.resolve({
		userprofile: data.get('data.data.info').value(),
		token: {
			token: data.get('data.data.token').value(),
			expires_in: data.get('data.data.expires_in').value(),
			refresh_token: data.get('data.data.refresh_token').value()
		}
	});
};

const userSocialLoginWithRedirect = (token, provider, redirectUrl) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));
	dispatch(actions.userSocialLogin());
	let path = `${baseUrl}/auth/fblogin?redirect_uri=${redirectUrl}`;
	if (provider === 'google') {
		path = `${baseUrl}/auth/googlelogin?redirect_uri=${redirectUrl}`;
	}

	const body = {
		client_secret: getClientSecret(),
		redirect_uri: redirectUrl
	};

	const [err, response] = await to(request({
		token,
		method: 'POST',
		path,
		fullpath: true,
		body
	}));

	if (err) {
		dispatch(actions.userLoginFail(err.response.data));
		return Promise.reject(__x(err.response.data));
	}

	const data = _.chain(response);

	return Promise.resolve({
		redirect_url: data.get('data.data.msg').value()
	});
};

export {
	userSocialLogin,
	userSocialLoginWithRedirect
};
