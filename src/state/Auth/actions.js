import { request, getBaseUrl } from '@/utils';
// import humps from 'lodash-humps';
import { 
	AUTH_REFRESH_TOKEN
} from './constants';


const requestToken = (token) => ({
	type: AUTH_REFRESH_TOKEN,
	status: 1, 
	payload: {
		token
	}
});


const getRefreshToken = (token) => dispatch => new Promise((resolve, reject) => {
	if (typeof token.userToken === 'undefined') {
		// redirect back to main or home page if an user-customer has not logged in yet
		top.location.href = getBaseUrl();
	}
	const $dis = dispatch;
	const req = {
		token: token.userToken, 
		path: `auth/refreshtoken?refresh_token=${token.userRFToken}`,
		method: 'POST',
		body: {
			refresh_token: token.userRFToken
		}
	};
	request(req)
	.then((response) => {
		
		token = {
			userToken: response.data.data.token,
			userRFToken: response.data.data.refresh_token,
			expToken: new Date(Number(response.data.data.info.expired_time)).getTime()
		};
		$dis(requestToken(token));
		
		resolve(token);
	})
	.catch((error) => {
		// redirect back to main or home page if an user-customer has not logged in yet
		top.location.href = getBaseUrl();
	});
	
    
});

export default {
	getRefreshToken
};