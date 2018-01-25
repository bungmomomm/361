import { handleActions, createActions } from 'redux-actions';

const actions = createActions({
	USER_LOGIN: undefined,
	USER_LOGIN_FAIL: (error) => ({ login: { error } }),
	USER_LOGIN_SUCCESS: (userProfile) => ({ email: undefined, password: undefined, userProfile }),
	USER_ANONYMOUS: undefined,
	USER_LOGIN_ANONYMOUS_SUCCESS: (userProfile) => ({ userProfile }),
	USER_NAME_CHANGE: (email) => ({ email }),
	USER_REGISTER: undefined,
	USER_REGISTER_FAIL: (error) => ({ register: { error } }),
	USER_REGISTER_SUCCESS: (userProfile) => ({ userProfile }),
	USER_OTP: undefined,
	USER_OTP_SUCCESS: (message) => ({ otp: { message } }),
	USER_OTP_FAIL: (error) => ({ otp: { error } }),
	USER_OTP_VALIDATE: undefined,
	USER_OTP_VALIDATE_SUCCESS: (userProfile) => ({ userProfile }),
	USER_OTP_VALIDATE_FAIL: (error) => ({ otp: { error } }),
	USER_GET_PROFILE: undefined,
	USER_GET_PROFILE_FAIL: (error) => ({ profile: { error } }),
	USER_GET_PROFILE_SUCCESS: (userProfile) => ({ userProfile }),
	USER_FORGET_PASSWORD: undefined,
	USER_FORGET_PASSWORD_FAIL: (error) => ({ forgot: { error } }),
	USER_FORGET_PASSOWRD_SUCCESS: (message) => ({ forget: { message } }),
	USER_NEW_PASSWORD: undefined,
	USER_NEW_PASSWORD_FAIL: (error) => ({ newpassword: { error } }),
	USER_NEW_PASSWORD_SUCCESS: (message) => ({ newpassword: { message } })
});

const initialState = {
	userprofile: false,
	username: false,
	isLoading: false,
	isAnonymous: false
};

const reducer = handleActions({
	[actions.userLogin]: (state, action) => ({ ...state, ...action.payload, isLoading: true }),
	[actions.userLoginSuccess](state, action) {
		return {
			...state,
			userprofile: action.payload.userProfile.data.info,
			isLoading: false,
			isAnonymous: false
		};
	},
	[actions.userLoginFail]: (state, action) => ({ ...state, ...action.payload, isLoading: false }),
	[actions.userAnonymous]: (state, action) => ({ ...state, ...action.payload, isLoading: true }),
	[actions.userLoginAnonymousSuccess](state, action) {
		return {
			...state,
			userprofile: action.payload.userProfile.data.info,
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
	[actions.userRegister]: (state, action) => ({ ...state, ...action.payload, isLoading: true }),
	[actions.userRegisterFail]: (state, action) => ({ ...state, ...action.payload, isLoading: false }),
	[actions.userRegisterSuccess]: (state, action) => ({ ...state, ...action.payload, isLoading: false }),
	[actions.userOtp]: (state, action) => ({ ...state, ...action.payload, isLoading: true }),
	[actions.userOtpSuccess]: (state, action) => ({ ...state, ...action.payload, isLoading: false }),
	[actions.userOtpFail]: (state, action) => ({ ...state, ...action.payload, isLoading: false }),
	[actions.userOtpValidate]: (state, action) => ({ ...state, ...action.payload, isLoading: true }),
	[actions.userOtpValidateSuccess]: (state, action) => ({ ...state, ...action.payload, isLoading: false }),
	[actions.userOtpValidateFail]: (state, action) => ({ ...state, ...action.payload, isLoading: false }),
	[actions.userGetProfile]: (state, action) => ({ ...state, ...action.payload, isLoading: true }),
	[actions.userGetProfileFail]: (state, action) => ({ ...state, ...action.payload, isLoading: false }),
	[actions.userGetProfileSuccess]: (state, action) => ({ ...state, ...action.payload, isLoading: false })
}, initialState);
export default {
	actions,
	reducer
};