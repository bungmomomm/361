import to from 'await-to-js';
import { Promise } from 'es6-promise';
import _ from 'lodash';
import { actions } from './reducer';
import base64 from 'base-64';
import {
	request,
	getDeviceID,
	getClientSecret
} from '@/utils';

import { userSocialLogin, userSocialLoginWithRedirect } from './social-action';

const isSuccess = (response) => {
	if (typeof response.data !== 'undefined' && typeof response.data.code !== 'undefined' && response.data.code === 200) {
		return true;
	}
	return false;
};

const userLogin = (token, email, password) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	dispatch(actions.userLogin(email, password));
	const path = `${baseUrl}/auth/login`;
	
	const [err, response] = await to(request({
		token,
		method: 'POST',
		path,
		fullpath: true,
		body: {
			email,
			pwd: base64.encode(password)
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

const userAnonymous = (token) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

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
		dispatch(actions.userLoginFail(err));
		return Promise.reject(err);
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

const userOtp = (token, phone) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const path = `${baseUrl}/auth/otp/send`;

	try {
		const response = await request({
			token,
			path,
			method: 'POST',
			body: {
				hp_email: phone,
			}
		});
		if (isSuccess(response)) {
			dispatch(actions.userOtpSuccess(response.data.data.msg));
			return Promise.resolve({
				message: response.data.data.msg
			});
		}
		const error = new Error('error from server');
		dispatch(actions.userOtpFail(error));
		return Promise.reject(error);
	} catch (error) {
		dispatch(actions.userOtpFail(error));
		return Promise.reject(error);
	}
};

const userOtpValidate = (token, phone, password, fullname, otp) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const path = `${baseUrl}/auth/otp/validate`;
	dispatch(actions.userOtpValidate());
	try {
		const response = await request({
			token,
			path,
			method: 'POST',
			body: {
				hp_email: phone,
				pwd: base64.encode(password),
				fullname,
				otp
			}
		});

		if (isSuccess(response)) {
			dispatch(actions.userOtpValidateSuccess(response.data.data));
			return Promise.resolve({
				data: response.data.data
			});
		}
		const error = new Error('error while validating OTP');
		dispatch(actions.userOtpValidateFail(error));
		return Promise.reject(error);
	} catch (error) {
		dispatch(actions.userOtpValidateFail(error));
		return Promise.reject(error);
	}
};

//  USER_REGISTER: undefined,

const userRegister = (token, email, phone, password, fullname) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const path = `${baseUrl}/auth/register`;

	dispatch(actions.userRegister());
	try {
		const response = await request({
			token,
			path,
			method: 'POST',
			fullpath: true,
			body: {
				hp_email: phone || email,
				pwd: base64.encode(password),
				fullname
			}
		});
		if (isSuccess(response)) {
			dispatch(actions.userRegisterSuccess());
			if (phone) {
				userOtp(token, phone);
			}
			return Promise.resolve({
				data: response.data.data
			});
		}
		const error = new Error('Error while calling api');
		dispatch(actions.userRegisterFail(error));
		return Promise.reject(error);
	} catch (error) {
		dispatch(actions.userRegisterFail(error));
		return Promise.reject(error);
	}
};

// 	USER_REGISTER_FAIL: (error) => ({ register: { error } }),
// 	USER_REGISTER_SUCCESS: (data) => ({ register: { data } }),
// 	USER_OTP_SUCCESS: (message) => ({ otp: { message } }),
// 	USER_OTP_FAIL: (error) => ({ otp: { error } }),
// 	USER_OTP_VALIDATE: undefined,
// 	USER_OTP_VALIDATE_SUCCESS: (userProfile) => ({ userProfile }),
// 	USER_OTP_VALIDATE_FAIL: (error) => ({ otp: { error } }),
// 	USER_GET_PROFILE: undefined,

const userGetProfile = (token) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const path = `${baseUrl}/me`;

	dispatch(actions.userGetProfile());
	try {
		const response = await request({
			token,
			method: 'GET',
			path,
			fullpath: true,
			body: {
				client_secret: getClientSecret(),
				device_id: getDeviceID()
			}
		});
		if (isSuccess(response)) {
			dispatch(actions.userGetProfileSuccess(response.data.data));
			return Promise.resolve({
				userprofile: response.data.data
			});
		}
		const error = new Error('Error while calling api');
		dispatch(actions.userGetProfileFail(error));
		return Promise.reject(error);
	} catch (error) {
		dispatch(actions.userGetProfileFail(error));
		return Promise.reject(error);
	}
};

const userForgotPassword = (token, username) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const path = `${baseUrl}/auth/forgotpwd`;

	dispatch(actions.userForgotPassword());
	try {
		const response = await request({
			token,
			method: 'POST',
			path,
			fullpath: true,
			body: {
				client_secret: getClientSecret(),
				hp_email: username
			}
		});
		if (isSuccess(response)) {
			dispatch(actions.userForgotPasswordSuccess(response.data.data));
			return Promise.resolve({
				data: response.data.data
			});
		}
		const error = new Error('Error while calling api');
		dispatch(actions.userForgotPasswordFail(error));
		return Promise.reject(error);
	} catch (error) {
		dispatch(actions.userForgotPasswordFail(error));
		return Promise.reject(error);
	}
};

// 	USER_GET_PROFILE_FAIL: (error) => ({ profile: { error } }),
// 	USER_GET_PROFILE_SUCCESS: (userProfile) => ({ userProfile }),

export default {
	userSocialLoginWithRedirect,
	userSocialLogin,
	userLogin,
	userAnonymous,
	userNameChange,
	userGetProfile,
	userRegister,
	userForgotPassword,
	userOtpValidate
};