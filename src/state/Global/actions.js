import * as constants from './constants';

const toggleDialog = (state) => ({
	type: constants.GLOBAL_DIALOG_TOGGLE,
	payload: {
		opened: state
	}
});

const dialogOpen = (state) => dispatch => {
	dispatch(toggleDialog(state));
};

export default {
	dialogOpen
};