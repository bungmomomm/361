import { handleActions, createActions } from 'redux-actions';
// import * as constants from './constants';


const initialState = {
	segmen: [
		{
			id: 1,
			Title: 'Wanita'
		}
	],
	activeSegment: 'wanita',
	allSegmentData: {
		wanita: {},
		pria: {},
		anak: {}
	}
};

const { initResponse, homepageData, segmentActive, recomendation } = createActions(
	'INIT_RESPONSE',
	'HOMEPAGE_DATA',
	'SEGMENT_ACTIVE',
	'RECOMENDATION'
);

const reducer = handleActions({
	[initResponse](state, { payload: { segmen } }) {
		return {
			...state,
			segmen
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
	},
	[recomendation](state, { payload: { recomendationData, activeSegment } }) {
		return {
			...state, 
			allSegmentData: { 
				...state.allSegmentData,
				[activeSegment]: {
					...state.allSegmentData[activeSegment],
					recomendationData
				}
			}
		};
	}
}, initialState);

export default {
	reducer, 
	initResponse, 
	homepageData,
	segmentActive,
	recomendation
};
