import React, { Component } from 'react';
import _ from 'lodash';
import to from 'await-to-js';
import { actions } from '@/state/v4/Shared';
import { actions as users } from '@/state/v4/User';
import { actions as initAction } from '@/state/v4/Home';
import { setUserCookie } from '@/utils';
import { Promise } from 'es6-promise';

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
			
			this.initProcess().then(shouldInit => {
				if (!shouldInit) {
					this.initApp();
				}
			});
		}

		componentWillUnmount() {
			window.mmLoading.play();
		}

		shouldLoginAnonymous() {
			return (_.isEmpty(this.userCookies) || _.isEmpty(this.userRFCookies));
		}

		exeCall(token = null) {
			const { shared, dispatch } = this.props;
			const tokenBearer = token === null ? this.userCookies : token.token;

			if (shared.totalCart === 0) { dispatch(new actions.totalCartAction(tokenBearer)); }

			if (shared.totalLovelist === 0) { dispatch(new actions.totalLovelistAction(tokenBearer)); }

			dispatch(new users.userGetProfile(tokenBearer));

			if (typeof doAfterAnonymousCall !== 'undefined') {
				doAfterAnonymousCall.apply(this, [this.props]);
			}
		}

		async initApp() {

			if (this.shouldLoginAnonymous()) {
				const response = await to(this.loginAnonymous());
				if (response[1] !== null && response[1].status === 1) {
					return this.exeCall(response[1].token);
				}
				return null;
			}

			return this.exeCall();
		}

		async loginAnonymous() {
			const [err, response] = await to(this.props.dispatch(new users.userAnonymous()));
			if (err) {
				this.withErrorHandling(err);
				return Promise.reject(new Error({
					status: 0,
					msg: 'anonymous process failed'
				}));
			}

			setUserCookie(this.props.cookies, response.token, true);
			return Promise.resolve({
				status: 1, 
				msg: '', 
				token: response.token
			});
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
				
				this.initApp();
				return response;
			}

			return false;
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
