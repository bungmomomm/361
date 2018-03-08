import { request } from '@/utils';
import _ from 'lodash';
import { Promise } from 'es6-promise';
import { to } from 'await-to-js';
import { address } from './reducer';

const defaultConfig = {
	per_page: 10
};

const getAddress = (token, query = {}) => async (dispatch, getState) => {
	const { shared } = getState();
	const url = _.chain(shared).get('serviceUrl.account.url').value() || false;
	if (!url) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	if (!query.per_page) {
		query.per_page = defaultConfig.per_page;
	}

	if (!query.page) {
		query.page = 1;
	}

	const [err, resp] = await to(request({
		token,
		path: `${url}/me/addresses`,
		method: 'GET',
		query,
		fullpath: true
	}));

	if (err) {
		return Promise.reject(err);
	}

	dispatch(address({
		address: resp.data.data
	}));

	return Promise.resolve(resp);
};

const initAddress = (token) => async (dispatch, getState) => {
	const st = getState();
	if (!st.address.data.provinces.length) {
		const url = _.chain(st.shared).get('serviceUrl.account.url').value() || false;
		if (!url) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

		const [err, resp] = await to(request({
			token,
			path: `${url}/location/provinces`,
			method: 'GET',
			fullpath: true
		}));

		if (err) {
			return Promise.reject(err);
		}

		const optProvinces = resp.data.data.provinces.filter((v) => {
			return v.id || false;
		}).map((prov) => {
			return {
				label: prov.name,
				value: prov.id
			};
		});
		optProvinces.unshift({ label: '- Select Province -', value: '' });

		dispatch(address({
			data: {
				...st.address.data,
				provinces: resp.data.data.provinces,
			},
			options: {
				...st.address.options,
				provinces: optProvinces,
			}
		}));
	}

	return Promise.resolve(st.address);
};

const getCity = (token, query = {}) => async (dispatch, getState) => {
	const st = getState();
	const url = _.chain(st.shared).get('serviceUrl.account.url').value() || false;
	if (!url) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const [err, resp] = await to(request({
		token,
		path: `${url}/location/cities`,
		method: 'GET',
		fullpath: true,
		query
	}));

	if (err) {
		return Promise.reject(err);
	}

	const optCities = resp.data.data.cities.filter((v) => {
		return v.filter_value || false;
	}).map((city) => {
		return {
			label: city.name,
			value: city.filter_value
		};
	});
	optCities.unshift({ label: '- Select City -', value: '' });

	dispatch(address({
		data: {
			...st.address.data,
			cities: resp.data.data.cities
		},
		options: {
			...st.address.options,
			cities: optCities
		}
	}));

	return Promise.resolve(resp);
};

const getDistrict = (token, query = {}) => async (dispatch, getState) => {
	const st = getState();
	const url = _.chain(st.shared).get('serviceUrl.account.url').value() || false;
	if (!url) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const [err, resp] = await to(request({
		token,
		path: `${url}/location/districts`,
		method: 'GET',
		fullpath: true,
		query
	}));

	if (err) {
		return Promise.reject(err);
	}

	const optDistricts = resp.data.data.districts.filter((v) => {
		return v.id || false;
	}).map((dist) => {
		return {
			label: dist.name,
			value: dist.id
		};
	});
	optDistricts.unshift({ label: '- Select District -', value: '' });

	dispatch(address({
		data: {
			...st.address.data,
			districts: resp.data.data.districts
		},
		options: {
			...st.address.options,
			districts: optDistricts
		}
	}));

	return Promise.resolve(resp);
};

const addAddress = (token, body = {}) => async (dispatch, getState) => {
	const st = getState();
	const url = _.chain(st.shared).get('serviceUrl.account.url').value() || false;
	if (!url) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const defaultAddress = body.default;
	delete body.default;

	const [err, resp] = await to(request({
		token,
		path: `${url}/me/addresses/add`,
		method: 'POST',
		fullpath: true,
		body
	}));

	if (err) {
		return Promise.reject(err);
	}

	if (defaultAddress) {
		const [errDef, respDef] = await to(request({
			token,
			path: `${url}/me/addresses/setdefault/123`,
			method: 'POST',
			fullpath: true,
			body: {}
		}));

		if (errDef) {
			return Promise.reject(errDef);
		}
		return Promise.resolve(respDef);
	}

	return Promise.resolve(resp);
};

export default {
	getAddress,
	initAddress,
	getCity,
	getDistrict,
	addAddress
};
