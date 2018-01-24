import { combineReducers } from 'redux';
import { reducer as tracking } from '@/state/Tracking/';
import { reducer as coupon } from '@/state/Coupon/';
import { reducer as addresses } from '@/state/Adresses/';
import { reducer as api } from '@/state/Api/';
import { reducer as cart } from '@/state/Cart/';
import { reducer as payments } from '@/state/Payment/';
import { reducer as user } from '@/state/User/';
import { reducer as global } from '@/state/Global';
import { reducer as home } from '@/state/v4/Home';
import { reducer as product } from '@/state/v4/Product';
import { reducer as comments } from '@/state/v4/Comment';

export default combineReducers({
	...global,
	tracking,
	coupon,
	addresses,
	api,
	cart,
	payments,
	user,
	global,
	home,
	product,
	comments
});