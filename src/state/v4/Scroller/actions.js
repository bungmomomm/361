import { initScroller } from './reducer';
import { PageTracker } from '@/utils/tracking/lucidworks';

const onScroll = (data) => (dispatch) => {
	dispatch(initScroller(data));
	const { loading, nextData } = data;
	if (!loading) {
		const { page, per_page } = nextData.query;
		if (typeof page !== 'undefined' && (page - 1) >= 0) PageTracker.trackPage((page - 1), per_page);
	}
};

export default {
	onScroll
};
