import { combineReducers } from 'redux';
import { reducer as tracking } from '@/state/Tracking/';
import { reducer as coupon } from '@/state/Coupon/';
import { reducer as addresses } from '@/state/Adresses/';
import { reducer as cart } from '@/state/Cart/';

export default combineReducers({
	tracking,
	coupon,
	addresses,
	cart
});