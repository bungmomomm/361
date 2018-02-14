import { request } from '@/utils';
import { getCategoryMenu, getCategoryBrand, categoryLoading, brandsLoading } from './reducer';
import _ from 'lodash';
import to from 'await-to-js';
import { Promise } from 'es6-promise';

const getCategoryMenuAction = (userToken, activeSegment) => async (dispatch, getState) => {
	dispatch(categoryLoading({ loading: true }));

	const { shared } = getState();
	let baseUrl = _.chain(shared).get('serviceUrl.lovelist.url').value() || false;

	// TODO: need to enable baseUrl checking while api ready
	if (true) baseUrl = process.env.MICROSERVICES_URL;
	// if (!baseUrl) baseUrl = process.env.MICROSERVICES_URL;

	const [err, response] = await to(
		request({
			token: userToken,
			path: `${baseUrl}categories/list`,
			method: 'GET',
			fullpath: true,
			query: {
				segment_id: activeSegment.id
			}
		})
	);

	if (response) {
		const categories = response.data.data;
		dispatch(getCategoryMenu({ categories, activeSegment }));
		dispatch(categoryLoading({ loading: false }));

		return Promise.resolve(response);
	}

	if (err) return Promise.reject(err);

	return false;
};

const getBrandsByCategoryIdAction = (token, categoryId) => async (dispatch, getState) => {
	dispatch(brandsLoading({ loadingBrands: true }));

	const { shared } = getState();
	let baseUrl = _.chain(shared).get('serviceUrl.lovelist.url').value() || false;

	// TODO: need to enable baseUrl checking while api ready
	if (true) baseUrl = process.env.MICROSERVICES_URL;
	// if (!baseUrl) baseUrl = process.env.MICROSERVICES_URL;

	// const url = `${process.env.MICROSERVICES_URL}featured_brand`;
	const [err, response] = await to(
		request({
			token,
			path: `${baseUrl}featured_brand`,
			method: 'GET',
			fullpath: true,
			query: {
				category_id: categoryId
			}
		})
	);
	if (response) {
		const brands = response.data.data;
		dispatch(getCategoryBrand({ brands }));
		dispatch(brandsLoading({ loadingBrands: false }));
	};

	if (err) return Promise.reject(err);

	return false;
};

export default {
	getCategoryMenuAction,
	getBrandsByCategoryIdAction
};