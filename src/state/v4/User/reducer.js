import { handleActions, createActions } from 'redux-actions';
import constants from './constants';

const initialState = {
	user: null,
	isLoading: false
};

const { login, loginFail, loginSuccess } = createActions({
	[constants.USER_LOGIN]: (username, password) => ({
		username,
		password
	}),
	[constants.USER_LOGIN_FAIL]: undefined,
	[constants.USER_LOGIN_SUCCESS]: (user) => ({
		user
	}),
});

const { register, registerFail, registerSuccess } = createActions({
	[constants.USER_REGISTER]: user => ({ user }),
	[constants.USER_REGISTER_FAIL]: undefined,
	[constants.USER_REGISTER_SUCCESS]: user => ({ user }),
});

export default handleActions({
	[login]: (state, action) => {
		return {
			...state,
			payload: action.payload,
			isLoading: true
		};
	},
	[loginFail]: (state, action) => {
		return {
			...state,
			payload: action.payload,
			isLoading: false
		};
	},
	[loginSuccess]: (state, action) => {
		return {
			...state,
			payload: action.payload,
			isLoading: false
		};
	},
	[register]: (state, action) => {
		return {
			...state,
			payload: action.payload,
			isLoading: true
		};
	},
	[registerFail]: (state, action) => {
		return {
			...state,
			payload: action.payload,
			isLoading: false
		};
	},
	[registerSuccess]: (state, action) => {
		return {
			...state,
			payload: action.payload,
			isLoading: false
		};
	}
}, initialState);