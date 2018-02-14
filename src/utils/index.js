import currency from './currency';
import newId from './newId';
import renderIf from './renderIf';
import modalController from './modalController';
import isMobile from './isMobile';
import componentState from './componentState';
import { request, getCancelToken } from './request';
import { setUserCookie } from './cookie';
import SocialLogin from './social-login';

const getBaseUrl = () => {
	return process.env.BASE_URL;
};

const getDeviceID = () => {
	return '1234-1234-1234-1234'; // process.env.DEVICE_ID;
};

const getClientID = () => {
	return isMobile() ? 'mobileweb' : 'web'; // process.env.CLIENT_ID;
};

const getClientSecret = () => {
	return 'a157f5740fef18518eb15501365f8f20'; // process.env.CLIENT_SECRET;
};

const getClientVersion = () => {
	return '2.22.0'; // process.env.BASE_URL;
};

export default {
	getDeviceID,
	getClientID,
	getClientSecret,
	getClientVersion,	
	setUserCookie,
	newId,
	renderIf,
	currency,
	request,
	getCancelToken,
	getBaseUrl,
	isMobile,
	modalController,
	componentState,
	SocialLogin
};