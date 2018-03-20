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

import { 
	afterLogin,
	addAfterLogin
 } from './after-login-action';
import { userSocialLogin, userSocialLoginWithRedirect } from './social-action';
import { checkMyOrders, getMyOrderDetail, updateMyOrdersCurrent, getMyOrderMore, cleanMyOrderData, keepReviewInfo, submitReview } from './myOrder-action';
import { getTrackingInfo } from './tracking-action';

const isSuccess = (response) => {
	if (typeof response.data !== 'undefined' && typeof response.data.code !== 'undefined' && response.data.code >= 200 && response.data.code < 300) {
		return true;
	}
	return false;
};

const userLogin = (token, email, password) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

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
		dispatch(actions.userLoginFail(err.data));
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
		dispatch(actions.userLoginFail(err.data));
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

const userOtp = (token, data) => async (dispatch, getState) => {

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const path = `${baseUrl}/auth/otp/send`;

	const dataForOtp = {
		hp_email: data
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

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

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

//  USER_REGISTER: undefined,

const userRegister = (token, bodyData) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const path = `${baseUrl}/auth/register`;


	dispatch(actions.userRegister());

	try {

		const dataForRegister = {
			hp_email: bodyData.hp_email,
			pwd: base64.encode(bodyData.pwd),
			fullname: bodyData.fullname
		};
		const requestData = {
			token,
			path,
			method: 'POST',
			fullpath: true,
			body: dataForRegister
		};

		const response = await request(requestData);

		if (isSuccess(response)) {
			dispatch(actions.userRegisterSuccess(response));
			return Promise.resolve(response);
		}
		const error = new Error('Error while calling api');
		dispatch(actions.userRegisterFail(error));
		return Promise.reject('This error actually success');
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

const userNewPassword = (token, pass1, pass2, passtoken) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

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
		dispatch(actions.userNewPasswordFail(err));
		return Promise.reject(err);
	}

	if (isSuccess(response)) {
		dispatch(actions.userNewPasswordSuccess(response.data.data));
		return Promise.resolve({
			data: response.data.data
		});
	}

	const error = new Error('Error while calling api');
	dispatch(actions.userNewPasswordFail(error));
	return Promise.reject(error);
};

const refreshToken = (tokenRefresh, token) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const path = `${baseUrl}/auth/refreshtoken?refresh_token=${tokenRefresh}`;

	const response = await request({
		method: 'POST',
		token,
		path,
		fullpath: true,
		body: {
			refresh_token: tokenRefresh
		}
	});

	if (isSuccess(response)) {
		return Promise.resolve(response);
	}

	return Promise.reject(response);
};

// 	USER_GET_PROFILE_FAIL: (error) => ({ profile: { error } }),
// 	USER_GET_PROFILE_SUCCESS: (userProfile) => ({ userProfile }),

const userEditProfile = (token, data = []) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

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

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

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

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

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
	userSocialLoginWithRedirect,
	userSocialLogin,
	userLogin,
	userAnonymous,
	userNameChange,
	userGetProfile,
	userEditProfile,
	userValidateOvo,
	userRegister,
	userForgotPassword,
	userNewPassword,
	userOtpValidate,
	userLogout,
	getMyOrderDetail,
	updateMyOrdersCurrent,
	userOtp,
	getTrackingInfo,
	getMyOrderMore,
	cleanMyOrderData,
	checkMyOrders,
	refreshToken,
	keepReviewInfo,
	submitReview,
	afterLogin,
	addAfterLogin
};