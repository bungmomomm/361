// import to from 'await-to-js';
// import { Promise } from 'es6-promise';
// import _ from 'lodash';

import { actions } from './reducer';
import actionLists from '@/state/v4';
// import {
// 	request,
// 	getClientSecret
// } from '@/utils';

const addAfterLogin = (state, action, param) => dispatch => {
	dispatch(actions.userAfterLogin(state, action, param));
};

const afterLogin = (token) => async (dispatch, getState) => {
	const { users } = getState();
	const { queue } = users;
	while (queue.length > 0) {
		const p = queue.shift();
		dispatch(actionLists[p.state].actions[p.action].apply(undefined, [token, ...p.param]));
	}
	dispatch(actions.userAfterLoginClear());
};

export default {
	afterLogin,
	addAfterLogin
};