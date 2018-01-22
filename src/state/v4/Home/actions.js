// import * as constants from './constants';
import { request } from '@/utils';


const initAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}init?platform=mobilesite&version=1.22.0`;
	
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		console.log(response);
	});
	// console.log(x);
};

export default {
	initAction
};