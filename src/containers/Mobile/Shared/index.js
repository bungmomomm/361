import React, { Component } from 'react';
import _ from 'lodash';
import to from 'await-to-js';
import { actions } from '@/state/v4/Shared';
import { actions as users } from '@/state/v4/User';
import { actions as initAction } from '@/state/v4/Home';
import { setUserCookie } from '@/utils';
import { Promise } from 'es6-promise';
import queryString from 'query-string';
import ErrorHandler from '@/containers/Mobile/Shared/errorHandler';

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
			this.isLogin = this.props.cookies.get('isLogin') === 'true' && true;
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
			const { shared, dispatch } = this.props;
			const { login, provider } = this.state;
			const tokenBearer = token === null ? this.userCookies : token.token;

			dispatch(new users.refreshToken(this.userRFCookies, tokenBearer));

			if (shared.totalCart === 0) { 
				dispatch(new actions.totalCartAction(tokenBearer))
				.catch(error => {
					this.withErrorHandling(error);
				}); 
			}

			if (shared.totalLovelist === 0) { 
				dispatch(new actions.totalLovelistAction(tokenBearer))
				.catch(error => {
					this.withErrorHandling(error);
				}); 
			}
			if (login && provider) {
				const response = await to(dispatch(new users.userSocialLogin(tokenBearer, provider, login)));
				
				if (response[0]) {
					this.withErrorHandling(response[0]);
				}
			}

			if (this.isLogin) {
				dispatch(new users.userGetProfile(tokenBearer));
			}

			if (typeof doAfterAnonymousCall !== 'undefined') {
				try {
					await doAfterAnonymousCall.apply(this, [this.props]);
					
				} catch (err) {
					return this.withErrorHandling(err);
				}
				
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
				return this.withErrorHandling(err);
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
					return this.withErrorHandling(err);
				}

				this.initApp();
				return response;
			}

			return false;
		}

		withErrorHandling(err) {
			const { dispatch } = this.props;
			const { response } = err;
			dispatch(actions.catchErrors(response));
		}

		handleScroll(e) {
			if (e.target.tagName === 'BODY') {
				const docHeight = this.docBody ? this.docBody.scrollHeight - window.innerHeight : 0;
				this.setState({
					scroll: {
						top: e.target.scrollTop,
						docHeight
					}
				});
			}
		}

		render() {
			const { shared, dispatch } = this.props;

			return (
				<div>
					<ErrorHandler errors={shared.errors} dispatch={dispatch} />
					<WrappedComponent {...this.props} scroll={this.state.scroll} />
				</div>
			);
		}
	}
	return SharedAction;
};

export default sharedAction;
