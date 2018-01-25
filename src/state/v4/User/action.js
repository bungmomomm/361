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

const userLogin = (token, email, password) => async dispatch => {
	dispatch(actions.login(email, password));
	try {
		const response = await request({
			method: 'POST',
			path: 'auth/login',
			fullpath: false,
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
		return Promise.reject(new Error('Error while calling api'));
	}
};

const userAnonymousLogin = () => async dispatch => {
	dispatch(actions.userAnonymous());
	try {
		const response = await request({
			method: 'POST',
			path: 'auth/anonymouslogin',
			fullpath: false,
			body: {
				client_id: getClientID(),
				client_secret: getClientSecret(),
				client_version: getClientVersion(),
				device_id: getDeviceID()
			}
		});
		if (isLoginSuccess(response)) {
			dispatch(actions.userLoginAnonymousSuccess(response.data));
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
		return Promise.reject(new Error('Error while calling api'));
	}
};

const userNameChange = (username) => dispatch => {
	dispatch(actions.userNameChange(username));
};

export default {
	userLogin,
	userAnonymousLogin,
	userNameChange
};