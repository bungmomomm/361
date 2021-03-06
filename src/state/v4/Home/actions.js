import to from 'await-to-js';
import { Promise } from 'es6-promise';
import _ from 'lodash';
import { request } from '@/utils';
import { initResponse, homepageData, segmentActive, recomendation } from './reducer';
import { forEverBanner } from '@/state/v4/Shared/reducer';
import __x from '@/state/__x';

const initAction = () => async (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}init?platform=mobilesite&version=1.22.0`;
	const [err, response] = await to(request({
		path: url,
		method: 'GET',
		fullpath: true
	}));

	if (err) {
		return Promise.reject(__x(err));
	}

	const segment = response.data.data.segment;
	const foreverBanner = response.data.data.forever_banner;
	const serviceUrl = response.data.data.service_url;
	const webViewUrl = response.data.data.webview_url;
	const banner = {
		...foreverBanner,
		show: true
	};
	dispatch(forEverBanner({ foreverBanner: banner, serviceUrl, webViewUrl }));
	dispatch(initResponse({ segmen: segment }));
	return Promise.resolve(response.data.data);

};

const mainAction = (activeSegment, token) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.promo.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/mainpromo?segment_id=${activeSegment.id}`;

	const [err, response] = await to(request({
		token,
		path,
		method: 'GET',
		fullpath: true
	}));

	if (err) {
		return Promise.reject(__x(err));
	}

	const mainData = {
		hashtag: response.data.data.hashtag,
		heroBanner: response.data.data.hero_banner,
		squareBanner: response.data.data.square_banner,
		topLanscape: response.data.data.landscape_new_arrival,
		bottomLanscape: response.data.data.landscape_best_seller,
		mozaic: response.data.data.mozaic,
		featuredBrand: response.data.data.featured_brand
	};
	const allSegmentData = {};
	allSegmentData[activeSegment.key] = mainData;

	dispatch(segmentActive({ activeSegment }));
	dispatch(homepageData({ allSegmentData, activeSegment: activeSegment.key }));

	return Promise.resolve(mainData);
};

const recomendationAction = (activeSegment, token, url = false) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.promo.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/recommended_promo?segment_id=${activeSegment.id}`;

	const [err, response] = await to(request({
		token,
		path,
		method: 'GET',
		fullpath: true
	}));

	if (err) {
		return Promise.reject(__x(err));
	}

	const bestSellerProducts = response.data.data.find(e => e.type === 'bestseller') || {};
	const newArrivalProducts = response.data.data.find(e => e.type === 'newarrival') || {};
	const recommendedProducts = response.data.data.find(e => e.type === 'recommended') || {};
	const recentlyViewedProducts = response.data.data.find(e => e.type === 'recentlyviewed') || {};
	const promoRecommendationData = {
		'new-arrival': newArrivalProducts,
		'best-seller': bestSellerProducts,
		'recommended-products': recommendedProducts,
		'recent-view': recentlyViewedProducts
	};

	dispatch(recomendation({ recomendationData: promoRecommendationData, activeSegment: activeSegment.key }));
	return Promise.resolve(promoRecommendationData);
};

export default {
	initAction,
	mainAction,
	recomendationAction
};
