import { TrackingRequest } from './request';
import {
	homepageViewBuilder,
	impressionsPushedBuilder,
	loginSuccessBuilder,
	registerSuccessBuilder,
	pdpViewBuilder,
	addToCartBuilder,
	categoryViewBuilder,
	productClickBuilder,
	cartViewBuilder,
} from './gtmPayloadBuilder';
import {
	sendGtm,
	sendLucidWork
} from './send';

export default {
	sendGtm,
	sendLucidWork,
	TrackingRequest,
	homepageViewBuilder,
	impressionsPushedBuilder,
	loginSuccessBuilder,
	registerSuccessBuilder,
	pdpViewBuilder,
	addToCartBuilder,
	categoryViewBuilder,
	productClickBuilder,
	cartViewBuilder,
};