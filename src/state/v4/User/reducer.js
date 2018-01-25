import { handleActions, createActions } from 'redux-actions';

const actions = createActions({
	LOGIN: (email, password) => ({ email, password }),
	USER_LOGIN_FAIL: () => ({ password: '' }),
	USER_LOGIN_SUCCESS: (userprofile) => ({ email: undefined, password: undefined, userprofile }),
	USER_ANONYMOUS: undefined,
	USER_LOGIN_ANONYMOUS_SUCCESS: (userprofile) => ({ userprofile }),
	USER_NAME_CHANGE: (username) => ({ username })
});

const initialState = {
	userprofile: false,
	username: false,
	isLoading: false,
	isAnonymous: false
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
		return {
			...state,
			userprofile: action.payload.userprofile.data.info,
			isLoading: false,
			isAnonymous: false
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
	[actions.userLoginAnonymousSuccess](state, action) {
		return {
			...state,
			userprofile: action.payload.userprofile.data.info,
			isLoading: false,
			isAnonymous: true
		};
	},
	[actions.userNameChange](state, action) {
		return {
			...state,
			...action.payload
		};
	},
}, initialState);
export default {
	actions,
	reducer
};