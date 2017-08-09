import * as constants from './constants';
import axios from 'axios';

const couponAdd = (coupon) => ({
	type: constants.CP_ADD_COUPON,
	payload: {
		coupon
	}
});

const couponAdded = (cart) => ({
	type: constants.CP_ADDED_COUPON,
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

const addCoupon = coupon => dispatch => {
	dispatch(couponAdd(coupon));
	console.log('start');
	return axios.post('/add2cart', { coupon }).then((response) => {
		// mimic request api
		setTimeout(() => {
			console.log('end');
			dispatch(couponAdded(response.data));
		}, 10000);
	});
};

const removeCoupon = () => dispatch => {
	dispatch(couponDelete());
	return axios.post('/add2cart', { }).then((response) => {
		dispatch(couponDeleted(response.data));
	});
};


export default {
	addCoupon,
	removeCoupon
};