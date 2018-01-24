import { combineReducers } from 'redux';
import { reducer as tracking } from '@/state/Tracking/';
import { reducer as coupon } from '@/state/Coupon/';
import { reducer as addresses } from '@/state/Adresses/';
import { reducer as api } from '@/state/Api/';
import { reducer as cart } from '@/state/Cart/';
import { reducer as payments } from '@/state/Payment/';
import { reducer as user } from '@/state/User/';
import { reducer as global } from '@/state/Global';
import { reducer as users } from '@/state/v4/User';
import { reducer as home } from '@/state/v4/Home';
import { reducer as lovelist } from '@/state/v4/Lovelist';
import { reducer as shared } from '@/state/v4/Shared';


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
	lovelist,
	users,
	shared
});