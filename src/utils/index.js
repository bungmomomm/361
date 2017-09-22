import currency from './currency';
import newId from './newId';
import renderIf from './renderIf';
import modalController from './modalController';
import isMobile from './isMobile';
import { request } from './request';

const getBaseUrl = () => {
	return process.env.BASE_URL;
};

export default {
	newId,
	renderIf,
	currency,
	request,
	getBaseUrl,
	isMobile,
	modalController
};