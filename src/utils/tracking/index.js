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
	sendLucidWork,
	sendLocation
} from './send';

export default {
	sendGtm,
	sendLocation,
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