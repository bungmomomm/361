let vtLoaded = false;
const Veritrans = () => {
	if (!vtLoaded) {
		window.Veritrans.url = process.env.VT_API_URL;
		window.Veritrans.client_key = process.env.VT_CLIENT;
		vtLoaded = true;
	}
	return window.Veritrans;
};

export default {
	Veritrans
};
