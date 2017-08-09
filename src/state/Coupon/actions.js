import * as constants from './constants';
import axios from 'axios';

const couponAdd = (thecoupon) => ({
	type: constants.CP_ADD_COUPON,
	payload: {
		coupon: thecoupon
	}
});

const couponAdded = (cart) => ({
	type: constants.CP_ADDED_COUPON,
	payload: {
		cart
	}
});

const couponInvalid = (cart) => ({
	type: constants.CP_INVALID_COUPON,
	payload: {
		cart
	}
});

const couponDelete = (coupon) => ({
	type: constants.CP_DELETE_COUPON,
	payload: {
		coupon
	}
});

const couponDeleted = (cart) => ({
	type: constants.CP_DELETED_COUPON,
	payload: {
		cart
	}
});

const couponReset = () => ({
	type: constants.CP_RESET_COUPON
});

const addCoupon = coupon => dispatch => {
	console.log(coupon);
	dispatch(couponAdd(coupon));
	console.log('start');
	return axios.post('/add2cart', { coupon }).then((response) => {
		// mimic request api
		const rand = 0; // Math.floor((Math.random() * 2));
		if (rand === 1) {
			setTimeout(() => {
				console.log('end');
				dispatch(couponAdded(response.data));
			}, 2000);
		} else {
			setTimeout(() => {
				console.log('end not valid');
				dispatch(couponInvalid(response.data));
			}, 2000);
		}
	});
};

const removeCoupon = () => dispatch => {
	dispatch(couponDelete());
	return axios.post('/add2cart', { }).then((response) => {
		setTimeout(() => {
			dispatch(couponDeleted(response.data));
		}, 2000);
	});
};

const resetCoupon = () => dispatch => {
	dispatch(couponReset());
};


export default {
	addCoupon,
	removeCoupon,
	resetCoupon
};