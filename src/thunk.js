import thunk from 'redux-catch-promise';
import { actions } from '@/state/v4/Shared';
import { uniqid } from '@/utils';
import _ from 'lodash';

export default thunk((promised, action, store) => {
	promised.catch((err) => {
		const { response } = err;

		store.dispatch(actions.showSnack(uniqid('err-'), {
			label: !response ? (err.message || err) : _.chain(response).get('data.error_message').value() || '',
			timeout: 10000,
			button: {
				label: 'COBA LAGI',
				action: 'reload'
			}
		}));
	});
});
