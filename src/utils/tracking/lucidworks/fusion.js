
class Fusion {

	constructor(cookies) {
		this.cookies = cookies;
		// this.sessionName = process.env.LUCID_COOKIE_NAME;
		this.sessionName = 'uniqueid';
	}

	hasNewSession() {
		const sessionExisting = this.cookies.get(this.sessionName);
		return (typeof sessionExisting !== 'undefined' && (sessionExisting !== '' || sessionExisting !== null));
	}
}

export default {
	Fusion
};