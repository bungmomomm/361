import axios from 'axios';
import iso8601 from 'iso8601';
import crypto from 'crypto';

/**
 * String Digest
 * @param {*} str 
 */
const base64Sha1 = (str) => {
	const hexDigest = crypto.createHash('sha1')
		.update(str)
		.digest('hex');

	return new Buffer(hexDigest).toString('base64');
};

/**
 * Gets X-WSSE Header
 * @param {*} user 
 * @param {*} secret 
 */
const getWsseHeader = (user, secret) => {
	const nonce = crypto.randomBytes(16).toString('hex');
	const timestamp = iso8601.fromDate(new Date());
	const digest = base64Sha1(nonce + timestamp + secret);

	return `UsernameToken Username="${user}", PasswordDigest="${digest}", Nonce="${nonce}", Created="${timestamp}"`;
};

/**
 * Send request to emarsys
 * @param {*} req 
 */
const request = (data) => {
	const eventId = process.env.EMARYSYS_EVENT_ID;
	const url = `${process.env.EMARYSYS_BASE_URL}${eventId}/trigger`;
	const body = {
		key_id: process.env.EMARSYS_KEY_ID,
		external_id: eventId,
		data
	};
	const xwsseHeader = getWsseHeader(process.env.EMARSYS_API_USERNAME, process.env.EMARSYS_API_PASSWORD);
	const configs = {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'X-WSSE': xwsseHeader
		}
	};

	console.log('url: ', url);
	console.log('body: ', JSON.stringify(body));
	console.log('emarysys header: ', xwsseHeader);

	return axios.post(url, JSON.stringify(body), configs);
};

export default {
	request
};