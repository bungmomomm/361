import { request } from '@/utils';
import { getCategoryMenu, getCategoryBrand, categoryLoading, brandsLoading } from './reducer';

const getCategoryMenuAction = (token, segment, activeSegment) => (dispatch) => {
	dispatch(categoryLoading({ loading: true }));
	const url = `${process.env.MICROSERVICES_URL}categories/list`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true,
		query: {
			segment_id: segment
		}
	}).then(response => {
		const categories = response.data.data;
		dispatch(getCategoryMenu({ categories, segment, activeSegment }));
		dispatch(categoryLoading({ loading: false }));
	});
};

const getBrandsByCategoryIdAction = (token, categoryId) => (dispatch) => {
	dispatch(brandsLoading({ loadingBrands: true }));
	const url = `${process.env.MICROSERVICES_URL}featured_brand`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true,
		query: {
			category_id: categoryId
		}
	}).then(response => {
		const brands = response.data.data;
		dispatch(getCategoryBrand({ brands }));
		dispatch(brandsLoading({ loadingBrands: false }));
	});
};

export default {
	getCategoryMenuAction,
	getBrandsByCategoryIdAction
};