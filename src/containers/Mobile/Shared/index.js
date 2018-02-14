import React, { Component } from 'react';
import _ from 'lodash';
import to from 'await-to-js';
import { actions } from '@/state/v4/Shared';
import { actions as users } from '@/state/v4/User';
import { actions as initAction } from '@/state/v4/Home';
import { setUserCookie } from '@/utils';

const sharedAction = (WrappedComponent, doAfterAnonymousCall) => {
	WrappedComponent.contextTypes = {
		router: React.PropTypes.object,
		location: React.PropTypes.object
	};
	class SharedAction extends Component {

		constructor(props) {
			super(props);
			this.props = props;
			this.state = { data: null };

			this.userCookies = this.props.cookies.get('user.token');
			this.userRFCookies = this.props.cookies.get('user.rf.token');
		}

		componentWillMount() {
			window.mmLoading.stop();
			this.initProcess();
		}

		componentWillUnmount() {
			window.mmLoading.play();
		}

		shouldLoginAnonymous() {
			return (_.isEmpty(this.userCookies) || _.isEmpty(this.userRFCookies));
		}

		initApp() {
			const { shared, dispatch } = this.props;

			if (this.shouldLoginAnonymous()) {
				this.loginAnonymous();
			}

			const loveListService = _.chain(shared).get('serviceUrl.lovelist').value() || false;
			const orderService = _.chain(shared).get('serviceUrl.order').value() || false;

			dispatch(new actions.totalCartAction(this.userCookies, orderService));
			dispatch(new actions.totalLovelistAction(this.userCookies, loveListService));

			if (typeof doAfterAnonymousCall !== 'undefined') {
				doAfterAnonymousCall.apply(this, [this.props]);
			}
		}

		async loginAnonymous() {
			const [err, response] = await to(this.props.dispatch(new users.userAnonymous()));
			if (err) {
				this.withErrorHandling(err);
			}

			return setUserCookie(this.props.cookies, response.token);
		}

		async initProcess() {
			// check existing props
			const { shared } = this.props;
			const serviceUrl = _.chain(shared).get('serviceUrl').value() || false;
			if (!serviceUrl) {
				const [err, response] = await to(this.props.dispatch(new initAction.initAction()));
				if (err) {
					this.withErrorHandling(err);
				}
				console.log(response);
				this.initApp();
			}
		}

		withErrorHandling(err) {
			console.log(this.props);
			console.log(err.response.data.code);
			switch (err.response.data.code) {
			case 200:
				console.log('masuk');
				break;
			case 500:
				console.log('error');
				break;
			default:
				console.log('default');

			}
		}

		render() {
			return (
				<WrappedComponent {...this.props} />
			);
		}
	}
	return SharedAction;
};

export default sharedAction;
