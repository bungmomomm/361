import generateRequestHeaders from 'kong-hmac';
import ES6Promise from 'es6-promise';
ES6Promise.polyfill();
import axios from 'axios';

const isKongActive = () => {
	return (process.env.KONG_ENABLED === 'true') || false;
};

const buildRequestURL = (props) => {
	const fullpath = props.fullpath;
	let baseUrl;
	if (fullpath) {
		baseUrl = '';
	} else {
		baseUrl = isKongActive() ? process.env.KONG_API_URL : process.env.API_URL;
	}
	return `${baseUrl}${props.path}`;
};

const kongRequestHeader = (props) => {
	if (!isKongActive()) {
		return null;	
	}

	const params = {
		host: process.env.KONG_HOST,
		token: `Bearer ${props.token}`,
		userName: process.env.KONG_USERNAME,
		secret: process.env.KONG_SECRET_KEY,
		url: buildRequestURL(props),
		method: props.method, 
		httpVersion: 'HTTP/1.0'
	}; 
	return generateRequestHeaders(params);
};

const request = (props) => {
	
	const url = buildRequestURL(props);
	
	let headers = {
		Authorization: `Bearer ${props.token}`
	};
	if (isKongActive()) {
		headers = kongRequestHeader(props);
	}
	switch (props.method) {
	case 'GET': {
		return axios.get(url, { headers });
	}
	case 'DELETE': {
		return axios.delete(url, { headers });
	}
	case 'PUT': {
		if (!props.body) {
			throw new Error('post should send the data');
		}
		return axios.put(url, props.body, { headers });
	}
	case 'PATCH': {
		if (!props.body) {
			throw new Error('post should send the data');
		}
		return axios.patch(url, props.body, { headers });
	}
	default: 
		if (!props.body) {
			throw new Error('post should send the data');
		}
		return axios.post(url, props.body, { headers });
	}
};

export default {
	request
};