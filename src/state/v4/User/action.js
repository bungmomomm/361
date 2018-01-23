import { actions } from './reducer';

const request = () => {

};

// Check if user success login
const isLoginSuccess = (response) => {
	if (typeof response.code && response.code === 200) {
		return true;
	}
	return false;
};

const userLogin = (token, email, password) => async dispatch => {
	dispatch(actions.login(email, password));
	const response = await request();
	if (isLoginSuccess(response)) {
		dispatch(actions.loginSuccess(response));
	} else {
		dispatch(actions.loginFail(email, password));
	}
};

export default {
	userLogin
};