import { login, loginSuccess, loginFail } from './reducer';

const request = () => {
	
};

const isLoginSuccess = (user) => {
	if (user.status) {
		return true;
	}
	return false;
};

const userLogin = async (username, password) => {
	login(username, password);
	const user = await request();
	if (isLoginSuccess(user)) {
		loginSuccess(user);
	} else {
		loginFail();
	}
};

export default {
	userLogin
};