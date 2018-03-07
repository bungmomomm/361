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
import { reducer as discovery } from '@/state/v4/Discovery';
import { reducer as product } from '@/state/v4/Product';
import { reducer as productCategory } from '@/state/v4/ProductCategory';
import { reducer as comments } from '@/state/v4/Comment';
import { reducer as search } from '@/state/v4/Search';
import { reducer as lovelist } from '@/state/v4/Lovelist';
import { reducer as shared } from '@/state/v4/Shared';
import { reducer as searchResults } from '@/state/v4/SearchResults';
import { reducer as category } from '@/state/v4/Category';
import { reducer as brands } from '@/state/v4/Brand';
import { reducer as scroller } from '@/state/v4/Scroller';
import { reducer as hashtag } from '@/state/v4/Hashtag';
import { reducer as seller } from '@/state/v4/Seller';
import { reducer as shopBag } from '@/state/v4/ShopBag';
import { reducer as hashtagdetails } from '@/state/v4/HashtagsDetails';

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
	discovery,
	product,
	productCategory,
	comments,
	search,
	searchResults,
	lovelist,
	users,
	shared,
	category,
	brands,
	scroller,
	hashtag,
	seller,
	shopBag,
	hashtagdetails
});
