import { 
	TRACKING_REQUEST,
	TRACKING_SUCCESS,
	TRACKING_FAILURE 
} from './constants';

const trackingRequest = () => ({
	type: TRACKING_REQUEST,
	meta: {
		analytics: {
			type: 'mm-analytics-event',
			payload: {
				some: 'data',
				more: 'stuff'
			}
		}
	}
});

const trackingSuccess = (data) => ({
	type: TRACKING_SUCCESS,
	payload: {
		data
	}
});

const trackingFailure = (data) => ({
	type: TRACKING_FAILURE,
	payload: {
		data
	}
});

export default {
	trackingRequest,
	trackingSuccess,
	trackingFailure
};