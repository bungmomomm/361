import React, { Component } from 'react';
import _ from 'lodash';
import to from 'await-to-js';
import { actions } from '@/state/v4/Shared';
import { actions as users } from '@/state/v4/User';
import { actions as initAction } from '@/state/v4/Home';
import { setUserCookie } from '@/utils';
import { Promise } from 'es6-promise';
import queryString from 'query-string';

const sharedAction = (WrappedComponent, doAfterAnonymousCall) => {
	WrappedComponent.contextTypes = {
		router: React.PropTypes.object,
		location: React.PropTypes.object
	};
	class SharedAction extends Component {

		constructor(props) {
			super(props);
			this.props = props;
			const query = queryString.parse(props.location.search);
			this.state = {
				data: null,
				login: query.code || false,
				scroll: {
					top: 0,
					docHeight: 0
				},
				provider: (query.code || query.state) ? (query.code ? 'facebook' : 'google') : false
			};

			this.userCookies = this.props.cookies.get('user.token');
			this.userRFCookies = this.props.cookies.get('user.rf.token');
			this.handleScroll = this.handleScroll.bind(this);
			this.docBody = null;
		}

		componentWillMount() {
			window.mmLoading.stop();

			this.initProcess().then(shouldInit => {
				if (!shouldInit) {
					this.initApp();
				}
			});
		}

		componentDidMount() {
			window.addEventListener('scroll', this.handleScroll, true);
			this.docBody = document.body;
		}

		componentWillUnmount() {
			window.mmLoading.play();
			window.removeEventListener('scroll', this.handleScroll, true);
		}

		shouldLoginAnonymous() {
			const { cookies } = this.props;
			return (_.isEmpty(cookies.get('user.token')) || _.isEmpty(cookies.get('user.rf.token')));
		}

		async exeCall(token = null) {
			const { shared, dispatch, cookies } = this.props;
			const { login, provider } = this.state;
			const tokenBearer = token === null ? this.userCookies : token.token;

			if (shared.totalCart === 0) { dispatch(new actions.totalCartAction(tokenBearer)); }

			if (shared.totalLovelist === 0) { dispatch(new actions.totalLovelistAction(tokenBearer)); }
			if (login && provider) {
				const response = await to(dispatch(new users.userSocialLogin(cookies.get('user.token'), provider, login)));
				console.log('login', response);
				if (response[0]) {
					return response[0];
				}
			}

			dispatch(new users.userGetProfile(tokenBearer));

			if (typeof doAfterAnonymousCall !== 'undefined') {
				doAfterAnonymousCall.apply(this, [this.props]);
			}
			return null;
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

		handleScroll(e) {
			const docHeight = this.docBody ? this.docBody.scrollHeight - window.innerHeight : 0;
			this.setState({
				scroll: {
					top: e.target.scrollTop,
					docHeight
				}
			});
		}

		render() {
			return (
				<WrappedComponent {...this.props} scroll={this.state.scroll} />
			);
		}
	}
	return SharedAction;
};

export default sharedAction;
