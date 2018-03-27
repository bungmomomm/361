import to from 'await-to-js';
import { 
	Promise
} from 'es6-promise';
import _ from 'lodash';
import { actions } from './reducer';
import base64 from 'base-64';
import {
	request,
} from '@/utils';

const userRegister = (token, bodyData) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const path = `${baseUrl}/auth/register`;

	dispatch(actions.userRegister());

	const requestBody = {
		token,
		path,
		method: 'POST',
		fullpath: true,
		body: {
			hp_email: bodyData.hp_email,
			pwd: base64.encode(bodyData.pwd),
			fullname: bodyData.fullname
		}
	};

	const [err, response] = await to(request(requestBody));
	if (err) {
		dispatch(actions.userRegisterFail(err.response.data));
		return Promise.reject(err.response.data);
	}
	dispatch(actions.userRegisterSuccess(response.data));
	return Promise.resolve(response.data);
};

export default {
	userRegister
};