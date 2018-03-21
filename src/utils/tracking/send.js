const sendGtm = (data) => {
	window.dataLayer.push(data);
};

const sendLucidWork = (data) => {
	// ...
};

export default {
	sendGtm,
	sendLucidWork
};