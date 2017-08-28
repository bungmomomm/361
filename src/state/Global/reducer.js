import * as constants from './constants';

const initialState = {
	showDialog: false
};

export default (state = initialState, action) => {

	if (typeof action === 'undefined') {
		return state;
	}
	
	switch (action.type) {

	case constants.GLOBAL_DIALOG_TOGGLE: {
		return {
			...initialState,
			...state,
			showDialog: action.payload.opened
		};
	}
	default: 
		return {
			...initialState,
			...state
		};
	}
};