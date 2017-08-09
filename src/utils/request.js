import generateRequestHeaders from 'kong-hmac';
import axios from 'axios';

const isKongActive = () => {
	return (process.env.KONG_ENABLED === 'true') || false;
};

const buildRequestURL = (props) => {
	const baseUrl = isKongActive() ? process.env.KONG_API_URL : process.env.API_URL;
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
		method: 'GET', 
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
		axios.get(url, {}, headers)
				.then((response) => {
					return response;
				})
				.catch((error) => {
					return error;
				});
		break;
	}
	default: 
		
		axios.post(url, {}, { headers: {
			Authorization: `Bearer ${props.token}`
		} })
				.then((response) => {
					return response;
				})
				.catch((error) => {
					return error;
				});
	}
};

export default {
	request
};