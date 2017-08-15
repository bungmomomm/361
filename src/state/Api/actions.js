import { CALL_API } from 'redux-api-middleware';

import { 
	GET_API,
	GET_API_SUCCESS,
	GET_API_FAILURE,
	POST_API,
	POST_API_SUCCESS,
	POST_API_FAILURE,
	DELETE_API,
	DELETE_API_SUCCESS,
	DELETE_API_FAILURE
} from './constants';


const API_URL = 'http://10.200.44.177:5725';

const apiGet = (endpoint) => ({
	[CALL_API]: {
		types: [
			GET_API, 
			GET_API_SUCCESS, 
			GET_API_FAILURE
		],
		endpoint: `${endpoint}`,
		method: 'GET',
	}
});

const apiPost = (data) => ({
	[CALL_API]: {
		types: [
			POST_API, 
			POST_API_SUCCESS, 
			POST_API_FAILURE
		],
		endpoint: `${API_URL}/${data.endpoint}`,
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data.body)
	}
});

const apiDelete = (endpoint) => ({
	[CALL_API]: {
		types: [
			DELETE_API, 
			DELETE_API_SUCCESS, 
			DELETE_API_FAILURE
		],
		endpoint: `${API_URL}/${endpoint}`,
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' }
	}
});


export default {
	apiGet,
	apiPost,
	apiDelete
};