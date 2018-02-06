import { initScroller } from './reducer';

const onScroll = (data) => (dispatch) => {
	dispatch(initScroller(data));
};

export default {
	onScroll
};
