import * as constants from './constants';

const paymentInfoUpdated = (data) => ({
	type: constants.PAY_UPDATED,
	payload: {
		...data
	}
});

export default {
	paymentInfoUpdated
};