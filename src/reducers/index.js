import { combineReducers } from 'redux';
import { reducer as tracking } from '@/state/Tracking/';
import { reducer as coupon } from '@/state/Coupon/';

export default combineReducers({
	tracking,
	coupon
});