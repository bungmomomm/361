import { request } from '@/utils';
import _ from 'lodash';
import { Promise } from 'es6-promise';
import { to } from 'await-to-js';
import { address } from './reducer';
import __x from '@/state/__x';

const getAddress = (token) => async (dispatch, getState) => {
	const { shared } = getState();
	const url = _.chain(shared).get('serviceUrl.account.url').value() || false;
	if (!url) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const [err, resp] = await to(request({
		token,
		path: `${url}/me/addresses`,
		method: 'GET',
		fullpath: true
	}));

	if (err) {
		return Promise.reject(__x(err));
	}

	dispatch(address({
		address: resp.data.data
	}));

	return Promise.resolve(resp);
};

const getCity = (token, query = {}, type = 'update') => async (dispatch, getState) => {
	const st = getState();
	const url = _.chain(st.shared).get('serviceUrl.account.url').value() || false;
	if (!url) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	if (!query.per_page) {
		query.per_page = 30;
	}

	dispatch(address({
		options: {
			...st.address.options,
			cities: [...st.address.options.cities, { label: '...', value: '' }]
		}
	}));

	const [err, resp] = await to(request({
		token,
		path: `${url}/location/cities`,
		method: 'GET',
		fullpath: true,
		query
	}));

	if (err) {
		return Promise.reject(__x(err));
	}

	const cities = _.chain(resp).get('data.data.cities').value() || [];
	const optCities = cities.filter((v) => {
		return (v.city_id && `${v.province_id}_${v.city_id}`) || false;
	}).map((city) => {
		return {
			label: city.name,
			value: `${city.province_id}_${city.city_id}`
		};
	});

	if (type === 'init') optCities.unshift({ label: '- Pilih Kota -', value: '' });

	const nextUrl = _.chain(resp).get('data.data.links.next').value();
	const nextLink = (nextUrl && new URL(nextUrl).searchParams) || false;

	dispatch(address({
		data: {
			...st.address.data,
			cities: type === 'update' ? [...st.address.data.cities, ...cities] : cities
		},
		options: {
			...st.address.options,
			cities: type === 'update' ? [...st.address.options.cities, ...optCities] : optCities
		},
		paging: {
			...st.address.paging,
			cities: nextLink ? { ...query, page: nextLink.get('page') } : false
		}
	}));

	return Promise.resolve(resp);
};

const getDistrict = (token, query = {}) => async (dispatch, getState) => {
	const st = getState();
	const url = _.chain(st.shared).get('serviceUrl.account.url').value() || false;
	if (!url) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const [err, resp] = await to(request({
		token,
		path: `${url}/location/districts`,
		method: 'GET',
		fullpath: true,
		query
	}));

	if (err) {
		return Promise.reject(__x(err));
	}

	const districts = _.chain(resp).get('data.data.districts').value() || [];

	const optDistricts = districts.filter((v) => {
		return v.id || false;
	}).map((dist) => {
		return {
			label: dist.name,
			value: `${dist.id}_${dist.name}`
		};
	});
	optDistricts.unshift({ label: '- Pilih Kecamatan -', value: '' });

	dispatch(address({
		data: {
			...st.address.data,
			districts
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
	if (!url) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

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
		return Promise.reject(__x(err));
	}

	if (defaultAddress) {
		const [errDef, respDef] = await to(request({
			token,
			path: `${url}/me/addresses/setdefault/${_.chain(resp).get('data.data.address_id').value() || 0}`,
			method: 'POST',
			fullpath: true,
			body: {}
		}));

		if (errDef) {
			return Promise.reject(__x(errDef));
		}
		return Promise.resolve(respDef);
	}

	return Promise.resolve(resp);
};

const editAddress = (token, body = {}) => async (dispatch, getState) => {
	const st = getState();
	const url = _.chain(st.shared).get('serviceUrl.account.url').value() || false;
	if (!url) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const defaultAddress = body.default;
	const addressId = body.address_id;
	delete body.default;
	delete body.address_id;

	const [err, resp] = await to(request({
		token,
		path: `${url}/me/addresses/edit/${addressId}`,
		method: 'POST',
		fullpath: true,
		body
	}));

	if (err) {
		return Promise.reject(__x(err));
	}

	if (defaultAddress) {
		const [errDef, respDef] = await to(request({
			token,
			path: `${url}/me/addresses/setdefault/${addressId}`,
			method: 'POST',
			fullpath: true,
			body: {}
		}));

		if (errDef) {
			return Promise.reject(__x(errDef));
		}
		return Promise.resolve(respDef);
	}

	return Promise.resolve(resp);
};

const deleteAddress = (token, addressId) => async (dispatch, getState) => {
	const st = getState();
	const url = _.chain(st.shared).get('serviceUrl.account.url').value() || false;
	if (!url) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const [err, resp] = await to(request({
		token,
		path: `${url}/me/addresses/delete/${addressId}`,
		method: 'POST',
		fullpath: true,
		body: {}
	}));

	if (err) {
		return Promise.reject(__x(err));
	}

	return Promise.resolve(resp);
};

const setDefaultAddress = (token, addressId) => async (dispatch, getState) => {
	const st = getState();
	const url = _.chain(st.shared).get('serviceUrl.account.url').value() || false;
	const [errDef, respDef] = await to(request({
		token,
		path: `${url}/me/addresses/setdefault/${addressId}`,
		method: 'POST',
		fullpath: true,
		body: {}
	}));

	if (errDef) {
		return Promise.reject(__x(errDef));
	}

	return Promise.resolve(respDef);
};

const mutateState = (data) => async (dispatch) => {
	dispatch(address(data));
	return Promise.resolve();
};

export default {
	getAddress,
	getCity,
	getDistrict,
	addAddress,
	editAddress,
	deleteAddress,
	mutateState,
	setDefaultAddress
};
