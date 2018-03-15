import { TrackingRequest } from './request';
import {
	homepageViewBuilder,
	impressionsPushedBuilder,
	loginSuccessBuilder,
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
	sendGtm,
	sendLucidWork
};