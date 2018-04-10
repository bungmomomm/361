import _ from 'lodash';
import { Utils } from '@/utils/tracking/lucidworks';
import {
	TrackingRequest,
	pdpViewBuilder,
	addToCartBuilder,
	sendGtm,
} from '@/utils/tracking';

const trackAddToCart = (data, props, variant, hasVariantSize = true) => {
	const { users, shared } = props;
	const { userProfile } = users;
	const products = {
		name: data.detail.title,
		id: data.detail.id,
		price: data.detail.price_range.effective_price,
		brand: data.detail.brand.name,
		category: data.detail.product_category_names.join('/'),
		variant: (hasVariantSize) ? variant.options[0].value : '',
		variant_id: variant.id,
		quantity: 1
	};
	const layerData = {
		emailHash: _.defaultTo(userProfile.enc_email, ''),
		userIdEncrypted: userProfile.enc_userid,
		userId: userProfile.id,
		ipAddress: shared.ipAddress || userProfile.ip_address,
		currentUrl: props.location.pathname,
		products: [products],
		fusionSessionId: Utils.getSessionID(),
	};
	const request = new TrackingRequest(layerData);
	const requestPayload = request.getPayload(addToCartBuilder);
	if (requestPayload) sendGtm(requestPayload);
};

const trackPdpView = (data, props) => {
	const { users, shared } = props;
	const { userProfile } = users;
	const products = {
		name: data.detail.title,
		id: data.detail.id,
		price: data.detail.price_range.effective_price,
		brand: data.detail.brand.name,
		category: data.detail.product_category_names.join('/'),
	};
	const layerData = {
		emailHash: _.defaultTo(userProfile.enc_email, ''),
		userIdEncrypted: userProfile.enc_userid,
		userId: userProfile.id,
		ipAddress: shared.ipAddress || userProfile.ip_address,
		currentUrl: props.location.pathname,
		products: [products],
		fusionSessionId: Utils.getSessionID(),
		storeName: data.detail.seller.seller
	};
	const request = new TrackingRequest(layerData);
	const requestPayload = request.getPayload(pdpViewBuilder);
	if (requestPayload) sendGtm(requestPayload);
};

export default {
	trackAddToCart,
	trackPdpView
};