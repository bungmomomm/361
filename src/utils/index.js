import currency from './currency';
import newId from './newId';
import hyperlink from './hyperlink';
import renderIf from './renderIf';
import modalController from './modalController';
import isMobile from './isMobile';
import componentState from './componentState';
import splitString from './splitString';
import { request, getCancelToken } from './request';
import { setUserCookie } from './cookie';
import urlBuilder from './urlBuilder';
import loading from './loading';
import { request as emarsysRequest } from './emarsys';
import uniqid from './uniqid';

const isHexColor = (color) => {
	return /(^#[0-9A-F]{3}|^#[0-9A-F]{6})$/i.test(color);
};

const getBaseUrl = () => {
	return process.env.BASE_URL;
};

const getDeviceID = () => {
	return '1234-1234-1234-1234'; // process.env.DEVICE_ID;
};

const getClientID = () => {
	return isMobile() ? 'mweb' : 'web'; // process.env.CLIENT_ID;
};

const getClientSecret = () => {
	return isMobile() ? 'AAA0F5AB43C947898294FE43242A6514' : '7C634FC856592651D80325AE3080D6CF'; // process.env.CLIENT_ID;
	// return 'a157f5740fef18518eb15501365f8f20'; // process.env.CLIENT_SECRET;
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
	hyperlink,
	splitString,
	urlBuilder,
	isHexColor,
	loading,
	emarsysRequest,
	uniqid
};
