import currency from './currency';
import newId from './newId';
import hyperlink from './hyperlink';
import renderIf from './renderIf';
import modalController from './modalController';
import isMobile from './isMobile';
import componentState from './componentState';
import splitString from './splitString';
import trimString from './trimString';
import { request, getCancelToken } from './request';
import { setUserCookie, setUniqeCookie, removeUserCookie, setUserInfoCookie, setReferrenceCookie } from './cookie';
import urlBuilder from './urlBuilder';
import enableZoomPinch from './zoomPinch';
import loading from './loading';
import { request as emarsysRequest } from './emarsys';
import uniqid from './uniqid';
import stringHelper from './stringHelper';
import initUTMProcess from './affiliate';
import checkImage from './checkImage';

const isHexColor = (color) => {
	return /(^#[0-9A-F]{3}|^#[0-9A-F]{6})$/i.test(color);
};

const isFullUrl = (str) => {
	return /^http/i.test(str);
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

const getSessionID = (cname) => {
	const name = `${cname}=`;
	const decodedCookie = decodeURIComponent(document.cookie);
	const ca = decodedCookie.split(';');
	const cookieWithValue = ca.find((e) => e.includes(name));
	return cookieWithValue !== undefined ? cookieWithValue.replace(name, '') : Date.now();
};

const decodeHtmlSpecialChar = (html) => {
	const txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};

const hastagLinkCreator = (text) => {
	const tobeRendered = decodeHtmlSpecialChar(text);
	const urlRegex = /(#[^\s]+)/g;
	return tobeRendered.replace(urlRegex, (url) => {
		const hashText = url.replace(/<(.|\n)*?>/g, '');
		const hashlink = urlBuilder.setName(hashText).buildSearchByKeyword();
		return `<a href="${hashlink + hashText.replace('#', '%23')}">${hashText}</a>`;
	});
};

const aspectRatioHeight = (width) => (width / 4) + width;

export default {
	getDeviceID,
	getClientID,
	getSessionID,
	getClientSecret,
	getClientVersion,
	setUserCookie,
	setUserInfoCookie,
	removeUserCookie,
	setUniqeCookie,
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
	trimString,
	urlBuilder,
	isHexColor,
	loading,
	emarsysRequest,
	uniqid,
	stringHelper,
	enableZoomPinch,
	setReferrenceCookie,
	isFullUrl,
	initUTMProcess,
	checkImage,
	decodeHtmlSpecialChar,
	hastagLinkCreator,
	aspectRatioHeight
};
