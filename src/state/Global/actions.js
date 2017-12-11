import { request } from '@/utils';
import * as constants from './constants';

const toggleDialog = (state) => ({
	type: constants.GLOBAL_DIALOG_TOGGLE,
	payload: {
		opened: state
	}
});

const receivedBlockContent = (data) => ({
	type: constants.GLOBAL_BLOCK_CONTENT,
	payload: {
		blockContent: data
	}
});

const dialogOpen = (state) => dispatch => {
	dispatch(toggleDialog(state));
};

const getBlockContents = (token, ids) => dispatch => new Promise((resolve, reject) => {
	request({
		token,
		path: 'block-content',
		method: 'POST',
		body: {
			data: {
				attributes: {
					block_id: ids
				}
			}
		}
	}).then((response) => {
		if (response.data.data) {
			dispatch(receivedBlockContent(response.data.included));
		} else {
			dispatch(receivedBlockContent([]));	
		}
	}).catch((error) => {
		dispatch(receivedBlockContent([]));
		reject(error);
	});
});

export default {
	dialogOpen,
	getBlockContents
};