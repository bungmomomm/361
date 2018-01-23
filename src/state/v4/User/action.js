import { actions } from './reducer';
import {
	request,
	getDeviceID,
	getClientID,
	getClientSecret,
	getClientVersion
} from '@/utils';

// Check if user success login
const isLoginSuccess = (response) => {
	if (typeof response.data !== 'undefined' && typeof response.data.code !== 'undefined' && response.data.code === 200) {
		return true;
	}
	return false;
};

const userLogin = (token, email, password) => async dispatch => {
	dispatch(actions.login(email, password));
	const response = await request();
	if (isLoginSuccess(response)) {
		dispatch(actions.userLoginSuccess(response));
	} else {
		dispatch(actions.userLoginFail(email, password));
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
			dispatch(actions.userLoginSuccess(response));
		} else {
			dispatch(actions.userLoginFail());
		}
	} catch (error) {
		dispatch(actions.userLoginFail());
	}
};

export default {
	userLogin,
	userAnonymousLogin
};