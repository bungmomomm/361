import to from 'await-to-js';
import { Promise } from 'es6-promise';
import _ from 'lodash';
import { actions } from './reducer';
import { totalLoveList, totalBag } from '@/state/v4/Shared/reducer';
import base64 from 'base-64';
import {
	request,
	getDeviceID,
	getClientSecret
} from '@/utils';

import afterLoginActions from './after-login-action';
import socialActions from './social-action';
import orderActions from './myOrder-action';
import trackingActions from './tracking-action';
import registerActions from './register-action';
import __x from '@/state/__x';

const userLogin = (token, email, password) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	dispatch(actions.userLogin());
	const path = `${baseUrl}/auth/login`;

	const [err, response] = await to(request({
		token,
		method: 'POST',
		path,
		fullpath: true,
		body: {
			email,
			pwd: base64.encode(password),
			client_secret: getClientSecret(),
			device_id: getDeviceID()
		}
	}));

	if (err) {
		dispatch(actions.userLoginFail(err.response.data));
		return Promise.reject(__x(err.response.data));
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

const clearError = (token) => dispatch => {
	dispatch(actions.userClearError());
};

const userAnonymous = (token) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/auth/anonymouslogin`;

	dispatch(actions.userAnonymous());

	const [err, response] = await to(request({
		token,
		method: 'POST',
		path,
		fullpath: true,
		body: {
			device_id: getDeviceID(),
			client_secret: getClientSecret()
		}
	}));

	if (err) {
		dispatch(actions.userLoginFail(err.response.data));
		return Promise.reject(__x(err.response.data));
	}

	dispatch(actions.userAnonymousSuccess(response.data.data.info));
	return Promise.resolve({
		userprofile: response.data.data.info,
		token: {
			token: response.data.data.token,
			expires_in: response.data.data.expires_in,
			refresh_token: response.data.data.refresh_token
		}
	});
};

const userNameChange = (username) => dispatch => {
	dispatch(actions.userNameChange(username));
};

// 	USER_OTP: undefined,

const userOtp = (token, data, type) => async (dispatch, getState) => {

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/auth/otp/send`;

	const dataForOtp = {
		hp_email: data,
		type
	};

	dispatch(actions.userOtp());

	const requestData = {
		token,
		path,
		method: 'POST',
		fullpath: true,
		body: dataForOtp
	};

	const [err, response] = await to(request(requestData));

	if (err) {
		dispatch(actions.userOtpFail(err.response.data));
		return Promise.reject(err.response.data);
	}
	dispatch(actions.userOtpSuccess(response.data.data));
	return Promise.resolve(response.data.data);

};

const userOtpValidate = (token, bodyData) => async (dispatch, getState) => {

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/auth/otp/validate`;

	dispatch(actions.userOtpValidate());

	if (bodyData.pwd !== undefined && bodyData.pwd.length > 0) {
		bodyData.pwd = base64.encode(bodyData.pwd);
	}

	const requestData = {
		token,
		path,
		method: 'POST',
		fullpath: true,
		body: bodyData
	};

	const [err, response] = await to(request(requestData));

	if (err) {
		dispatch(actions.userOtpValidateFail(err.response.data));
		return Promise.reject(err.response.data);
	}

	dispatch(actions.userOtpValidateSuccess(response.data.data));
	return Promise.resolve(response.data.data);

};

const userGetProfile = (token) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/me`;

	dispatch(actions.userGetProfile());
	
	const [err, response] = await to(request({
		token,
		method: 'GET',
		path,
		fullpath: true,
		body: {
			client_secret: getClientSecret(),
			device_id: getDeviceID()
		}
	}));

	if (err) {
		dispatch(actions.userGetProfileFail(err.response.data));
		return Promise.reject(__x(err.response.data));
	}

	dispatch(actions.userGetProfileSuccess(response.data.data));
	return Promise.resolve({
		userprofile: response.data.data
	});
};

const userForgotPassword = (token, username) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/auth/forgotpwd`;

	dispatch(actions.userForgotPassword());
	const [err, response] = await to(request({
		token,
		method: 'POST',
		path,
		fullpath: true,
		body: {
			client_secret: getClientSecret(),
			hp_email: username
		}
	}));
	
	if (err) {
		dispatch(actions.userForgotPasswordFail(err.response.data));
		return Promise.reject(__x(err.response.data));
	}
	dispatch(actions.userForgotPasswordSuccess(response.data.data));
	return Promise.resolve({
		data: response.data.data
	});
};

const userNewPassword = (token, pass1, pass2, passtoken) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/auth/newpwd`;

	dispatch(actions.userNewPassword());
	const [err, response] = await to(request({
		token,
		method: 'POST',
		path,
		fullpath: true,
		body: {
			client_secret: getClientSecret(),
			pass1: base64.encode(pass1),
			pass2: base64.encode(pass2),
			token: passtoken
		}
	}));

	if (err) {
		dispatch(actions.userNewPasswordFail(err.response.data));
		return Promise.reject(__x(err.response.data));
	}

	dispatch(actions.userNewPasswordSuccess(response.data.data));
	return Promise.resolve({
		data: response.data.data
	});
};

const refreshToken = (tokenRefresh, token) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/auth/refreshtoken?refresh_token=${tokenRefresh}`;

	const [err, response] = await to(request({
		method: 'POST',
		token,
		path,
		fullpath: true,
		body: {
			refresh_token: tokenRefresh
		}
	}));

	if (err) {
		return Promise.reject(__x(err.response.data));
	}
	return Promise.resolve(response);
};

// 	USER_GET_PROFILE_FAIL: (error) => ({ profile: { error } }),
// 	USER_GET_PROFILE_SUCCESS: (userProfile) => ({ userProfile }),

const userEditProfile = (token, data = []) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/me/edit`;

	dispatch(actions.userEditProfile());
	const [err, response] = await to(request({
		token,
		method: 'POST',
		path,
		fullpath: true,
		body: data
	}));

	if (err) {
		dispatch(actions.userEditProfileFail(err.response.data));
		return Promise.reject(err.response.data);
	}

	dispatch(actions.userEditProfileSuccess(response.data.data));
	return Promise.resolve(response.data.data);
};

const userValidateOvo = (token, data = []) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/ovo/validate`;

	dispatch(actions.userValidateOvo());
	const [err, response] = await to(request({
		token,
		method: 'POST',
		path,
		fullpath: true,
		body: data
	}));

	if (err) {
		dispatch(actions.userValidateOvoFail(err.response.data));
		return Promise.reject(err.response.data);
	}

	dispatch(actions.userValidateOvoSuccess(response.data.data));
	return Promise.resolve(response.data.data);
};

const userLogout = (token) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/auth/logout`;

	dispatch(actions.userLogout());
	const [err, response] = await to(request({
		token,
		method: 'POST',
		path,
		fullpath: true,
		body: {
			action: 'logout'
		}
	}));

	if (err) {
		dispatch(actions.userLogoutFail(err.response.data));
		return Promise.reject(err.response.data);
	}

	dispatch(totalBag({ totalCart: 0 }));
	dispatch(totalLoveList({ totalLovelist: 0 }));

	dispatch(actions.userLogoutSuccess(response.data.data));
	return Promise.resolve({
		token: {
			token: response.data.data.token,
			expires_in: response.data.data.expires_in,
			refresh_token: response.data.data.refresh_token
		}
	});
};

export default {
	userLogin,
	userAnonymous,
	userNameChange,
	userGetProfile,
	userEditProfile,
	userValidateOvo,
	userForgotPassword,
	userNewPassword,
	userOtpValidate,
	userLogout,
	userOtp,
	refreshToken,
	clearError,
	...afterLoginActions,
	...orderActions,
	...socialActions,
	...trackingActions,
	...registerActions
};
