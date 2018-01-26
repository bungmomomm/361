import { actions } from './reducer';
import base64 from 'base-64';
import {
	request,
	getDeviceID,
	getClientID,
	getClientSecret,
	getClientVersion
} from '@/utils';

// Check if user success login
const isLoginSuccess = (response) => {
	console.log(response);
	if (typeof response.data !== 'undefined' && typeof response.data.code !== 'undefined' && response.data.code === 200) {
		return true;
	}
	return false;
};

const isRegisterSuccess = (response) => {
	console.log(response);
	if (typeof response.data !== 'undefined' && typeof response.data.code !== 'undefined' && response.data.code === 200) {
		return true;
	}
	return false;
};

const isSuccess = (response) => {
	if (typeof response.data !== 'undefined' && typeof response.data.code !== 'undefined' && response.data.code === 200) {
		return true;
	}
	return false;
};

const userLogin = (token, email, password) => async dispatch => {
	dispatch(actions.userLogin(email, password));
	try {
		const response = await request({
			token,
			method: 'POST',
			path: `${process.env.MICROSERVICES_URL}auth/login`,
			fullpath: true,
			body: {
				client_id: getClientID(),
				client_secret: getClientSecret(),
				client_version: getClientVersion(),
				email,
				pwd: base64.encode(password)
			}
		});
		if (isLoginSuccess(response)) {
			dispatch(actions.userLoginSuccess(response.data));
			return Promise.resolve({
				userprofile: response.data.data.info,
				token: {
					token: response.data.data.token,
					expires_in: response.data.data.expires_in,
					refresh_token: response.data.data.refresh_token
				}
			});
		}
		dispatch(actions.userLoginFail(email, password));
		return Promise.reject(new Error('Invalid user/password'));
	} catch (error) {
		dispatch(actions.userLoginFail(email, password));
		return Promise.reject(error);
	}
};

const userAnonymous = (token) => async dispatch => {
	dispatch(actions.userAnonymous());
	try {
		const response = await request({
			token,
			method: 'POST',
			path: `${process.env.MICROSERVICES_URL}auth/anonymouslogin`,
			fullpath: true,
			body: {
				client_id: getClientID(),
				client_secret: getClientSecret(),
				client_version: getClientVersion(),
				device_id: getDeviceID()
			}
		});
		if (isLoginSuccess(response)) {
			dispatch(actions.userAnonymousSuccess(response.data));
			return Promise.resolve({
				userprofile: response.data.data.info,
				token: {
					token: response.data.data.token,
					expires_in: response.data.data.expires_in,
					refresh_token: response.data.data.refresh_token
				}
			});
		}
		dispatch(actions.userLoginFail());
		return Promise.reject(new Error('Error while calling api'));
	} catch (error) {
		dispatch(actions.userLoginFail());
		return Promise.reject(error);
	}
};

const userNameChange = (username) => dispatch => {
	dispatch(actions.userNameChange(username));
};

// 	USER_OTP: undefined,

const userOtp = (token, phone) => async dispatch => {
	try {
		const response = await request({
			token,
			path: `${process.env.MICROSERVICES_URL}auth/otp/send`,
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
		return Promise.reject('error from server');
	} catch (error) {
		return Promise.reject(error);
	}
};

const userOtpValidate = (token, phone, password, fullname, otp) => async dispatch => {
	dispatch(actions.userOtpValidate());
	try {
		const response = await request({
			token,
			path: `${process.env.MICROSERVICES_URL}auth/otp/validate`,
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
		return Promise.reject(new Error('error while validating OTP'));
	} catch (error) {
		return Promise.reject(error);
	}
};

//  USER_REGISTER: undefined,

const userRegister = (token, email, phone, password, fullname) => async dispatch => {
	dispatch(actions.userRegister());
	try {
		const response = await request({
			token,
			path: `${process.env.MICROSERVICES_URL}auth/register`,
			method: 'POST',
			fullpath: true,
			body: {
				hp_email: phone || email,
				pwd: base64.encode(password),
				fullname
			}
		});
		if (isRegisterSuccess(response)) {
			dispatch(actions.userRegisterSuccess());
			if (phone) {
				userOtp(token, phone);
			}
			return Promise.resolve({
				data: response.data.data
			});
		}
		dispatch(actions.userRegisterFail(new Error()));
		return Promise.reject(new Error('Error while calling api'));
	} catch (error) {
		return Promise.reject(new Error('Error while calling api'));
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
// 	USER_GET_PROFILE_FAIL: (error) => ({ profile: { error } }),
// 	USER_GET_PROFILE_SUCCESS: (userProfile) => ({ userProfile }),

export default {
	userLogin,
	userAnonymous,
	userNameChange,
	userRegister,
	userOtpValidate
};