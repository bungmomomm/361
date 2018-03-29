import thunk from 'redux-catch-promise';
import { actions } from '@/state/v4/Shared';
import { uniqid } from '@/utils';
import _ from 'lodash';

export default thunk((promised, action, store) => {
	promised.catch((err) => {
		if (err.redux) {
			const { response, message, code } = err;
			const exc = process.env.SNACKBAR_EXC_ERRCODE || [];
			const status = _.chain(response).get('status').value();

			if (!response || (!exc.includes(status) && !exc.includes(code))) {
				store.dispatch(actions.showSnack(uniqid('err-'),
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
			}
		}
	});
});
