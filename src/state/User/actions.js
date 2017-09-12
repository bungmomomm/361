import * as constants from './constants';
import { request } from '@/utils';
import md5 from 'react-native-md5';

const requestProfile = (token) => ({
	type: constants.USER_REQUEST_PROFILE,
	payload: {
		token
	}
});

const receivedProfile = (user) => ({
	type: constants.USER_RECEIVED_PROFILE,
	payload: {
		user
	}
});

const failedResponse = (error) => ({
	type: constants.USER_FAILED_RESPONSE,
	payload: {
		error
	}
});

const userGTM = (id, email) => ({
	type: constants.USER_GTM_PROFILE,
	payload: {
		id: md5.hex_md5(id),
		email: md5.hex_md5(email),
	}
});

const getUser = (token) => dispatch => {
	dispatch(requestProfile());
	return request({
		token,
		path: 'me',
		method: 'GET',
	}).then((response) => {
		dispatch(receivedProfile(response.data.data[0]));
		dispatch(userGTM(response.data.data[0].id, response.data.data[0].attributes.email));
	}).catch((error) => {
		dispatch(failedResponse(error));
	});
};

export default {
	getUser
};