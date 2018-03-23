import thunk from 'redux-catch-promise';
import { actions } from '@/state/v4/Shared';
import { uniqid } from '@/utils';
import _ from 'lodash';

export default thunk((promised, action, store) => {
	promised.catch((err) => {
		const { response, message } = err;
		const exc = [409, 422];
		const status = _.chain(response).get('status').value();

		if (!response || !exc.includes(status)) {
			store.dispatch(actions.showSnack(uniqid('err-'), {
				label: response ? _.chain(response).get('data.error_message').value()
						: err.error_message ? err.error_message
						: message || err,
				timeout: 10000,
				button: {
					label: 'COBA LAGI',
					action: 'reload'
				}
			}));
		}
	});
});
