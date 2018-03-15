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
	loginRegisterMethod = (method) => {
		this.loginRegisterMethod = method;
		return this;
	}

}

export default {
	TrackingRequest,
};