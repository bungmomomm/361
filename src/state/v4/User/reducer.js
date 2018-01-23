import { handleActions, createActions } from 'redux-actions';

const actions = createActions({
	LOGIN: (email, password) => ({ email, password }),
	USER_LOGIN_FAIL: () => ({ password: '' }),
	USER_LOGIN_SUCCESS: (user) => ({ email: undefined, password: undefined, user }),
	USER_ANONYMOUS: undefined
});

const initialState = {
	user: false,
	username: false,
	isLoading: false
};

const reducer = handleActions({
	[actions.login](state, action) {
		return {
			...state,
			...action.payload,
			isLoading: true
		};
	},
	[actions.userLoginSuccess](state, action) {
		console.log(action.payload.user.data.data.info);
		return {
			...state,
			user: action.payload.user.data.data.info,
			isLoading: true
		};
	},
	[actions.userLoginFail](state, action) {
		return {
			...state,
			...action.payload,
			isLoading: false
		};
	},
	[actions.userAnonymous](state, action) {
		return {
			...state,
			...action.payload,
			isLoading: true 
		};
	},
}, initialState);
export default {
	actions,
	reducer
};