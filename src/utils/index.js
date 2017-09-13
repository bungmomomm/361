import currency from './currency';
import newId from './newId';
import renderIf from './renderIf';
import { request } from './request';

const getBaseUrl = () => {
	return process.env.BASE_URL;
};

export default {
	newId,
	renderIf,
	currency,
	request,
	getBaseUrl
};