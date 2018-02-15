import { request } from '@/utils';
import { getCategoryMenu, getCategoryBrand, categoryLoading, brandsLoading } from './reducer';
import _ from 'lodash';
import to from 'await-to-js';
import { Promise } from 'es6-promise';

const getCategoryMenuAction = (userToken, activeSegment) => async (dispatch, getState) => {
	dispatch(categoryLoading({ loading: true }));

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.promo.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

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

	if (err) return Promise.reject(err);

	const categories = response.data.data;
	dispatch(getCategoryMenu({ categories, activeSegment }));
	dispatch(categoryLoading({ loading: false }));

	return Promise.resolve(response);
};

const getBrandsByCategoryIdAction = (token, categoryId) => async (dispatch, getState) => {
	dispatch(brandsLoading({ loadingBrands: true }));

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.promo.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

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

	if (err) return Promise.reject(err);

	const brands = response.data.data;
	dispatch(getCategoryBrand({ brands }));
	dispatch(brandsLoading({ loadingBrands: false }));

	return Promise.resolve(response);
};

export default {
	getCategoryMenuAction,
	getBrandsByCategoryIdAction
};