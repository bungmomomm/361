class TrackingRequest {
	getPayload(payloadBuilder) {
		return (payloadBuilder(this));
	}

	setEmailHash = (hash) => {
		this.emailHash = hash;
		return this;
	}
	setFusionSessionId = (id) => {
		this.fusionSessionId = id;
		return this;
	}
	setUserIdEncrypted = (id) => {
		this.userIdEncrypted = id;
		return this;
	}
	setUserId = (id) => {
		this.userId = id;
		return this;
	}
	setIpAddress = (ip) => {
		this.ipAddress = ip;
		return this;
	}
	setTimestampCurrent = (timestamp) => {
		this.timestampCurrent = timestamp;
		return this;
	}
	setReferal = (referal) => {
		this.referal = referal;
		return this;
	}
	setReferalUrl = (url) => {
		this.referalUrl = url;
		return this;
	}
	setCurrentUrl = (url) => {
		this.currentUrl = url;
		return this;
	}
	setPromotions = (promotions) => {
		this.promotions = promotions;
	}
	setUserAgent = (userAgent) => {
		this.userAgent = userAgent;
		return this;
	}
	setLoginRegisterMethod = (method) => {
		this.loginRegisterMethod = method;
		return this;
	}
	setProducts = (products) => {
		this.products = products;
		return this;
	}
	setStoreName = (store) => {
		this.storeName = store;
		return this;
	}
	setImpressions = (impressions) => {
		this.impressions = impressions;
		return this;
	}
	setCategoryInfo = (info) => {
		this.categoryInfo = info;
		return this;
	}
	setListProductId = (ids) => {
		this.listProductId = ids;
		return this;
	}
	setSourceName = (sourceName) => {
		this.sourceName = sourceName;
		return this;
	}
	setListPrice = (listPrice) => {
		this.listPrice = listPrice;
		return this;
	}
	setListQuantity = (listQuantity) => {
		this.listQuantity = listQuantity;
		return this;
	}
}

export default {
	TrackingRequest,
};