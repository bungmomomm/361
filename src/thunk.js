import thunk from 'redux-catch-promise';
import { actions } from '@/state/v4/Shared';
import { uniqid } from '@/utils';
import _ from 'lodash';

const sentry = window.Raven;

const snackBar = (store, action, err) => {
	const { response, message } = err;
	store.dispatch(actions.showSnack(
		uniqid('err-'),
		{
			label: _.chain(response).get('data.error_message').value() ? _.chain(response).get('data.error_message').value()
				: _.chain(response).get('statusText').value() ? _.chain(response).get('statusText').value()
				: err.error_message ? err.error_message
				: message || err,
			timeout: 10000,
			button: {
				label: 'COBA LAGI',
				action: 'reload'
			}
		},
		{},
		true
	));
};

export default thunk((promised, action, store) => {
	promised.catch((err) => {

		if (err.redux) {
			const { code } = err;
			if (err.app && err.app === 'account' && code === 401) {
				return;
			}

			snackBar(store, action, err);
		}

		// post to sentry
		if (sentry) {
			sentry.captureException(err);
		}
    
	});
});
