import { handleActions, createActions } from 'redux-actions';
// import * as constants from './constants';


const initialState = {
	segmen: [
		{
			id: 1,
			Title: 'Wanita'
		}
	],
	activeSegment: 1,
	allSegmentData: {
		woman: {},
		man: {},
		kids: {}
	},
	mainData: {
		hashtag: {},
		featuredBanner: [],
		middleBanner: [],
		bottomBanner1: [],
		bottomBanner2: [],
		featuredBrand: [],
		mozaic: {},
	}
};

const { initResponse, homeData, homepageData, segmentActive } = createActions(
	'INIT_RESPONSE',
	'HOME_DATA',
	'HOMEPAGE_DATA',
	'SEGMENT_ACTIVE'
);

const reducer = handleActions({
	[initResponse](state, { payload: { segmen } }) {
		return {
			...state,
			segmen
		};
	},
	[homeData](state, { payload: { mainData } }) {
		return { 
			...state,
			mainData
		};
	},
	[homepageData](state, { payload: { allSegmentData } }) {
		return {
			...state, 
			allSegmentData: {
				...state.allSegmentData,
				...allSegmentData
			}
		};
	},
	[segmentActive](state, { payload: { activeSegment } }) {
		return {
			...state, 
			activeSegment
		};
	}
}, initialState);

export default {
	reducer, 
	initResponse, 
	homeData, 
	homepageData,
	segmentActive
};