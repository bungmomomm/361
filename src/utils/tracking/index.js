import { TrackingRequest } from './request';
import {
	homepageViewBuilder,
	impressionsPushedBuilder,
	loginSuccessBuilder,
	registerSuccessBuilder,
} from './gtmPayloadBuilder';
import {
	sendGtm,
	sendLucidWork
} from './send';

export default {
	TrackingRequest,
	homepageViewBuilder,
	impressionsPushedBuilder,
	loginSuccessBuilder,
	registerSuccessBuilder,
	sendGtm,
	sendLucidWork
};