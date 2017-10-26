import * as constants from './constants';

const initialState = {
	showDialog: false,
	blockContents: null,
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
	case constants.GLOBAL_BLOCK_CONTENT: {
		return {
			...initialState,
			...state,
			blockContent: action.payload.blockContent
		};
	}
	default: 
		return {
			...initialState,
			...state
		};
	}
};