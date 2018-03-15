import React, { Component } from 'react';
import _ from 'lodash';
import to from 'await-to-js';
import { actions } from '@/state/v4/Shared';
import { actions as users } from '@/state/v4/User';
import { actions as initAction } from '@/state/v4/Home';
import { setUserCookie, uniqid, setUniqeCookie } from '@/utils';
import { Promise } from 'es6-promise';
import queryString from 'query-string';
import Snackbar from '@/containers/Mobile/Shared/snackbar';
import { check, watch } from 'is-offline';
import uuidv4 from 'uuid/v4';

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
			this.uniqueId = this.props.cookies.get('uniqueid');
			this.handleScroll = this.handleScroll.bind(this);
			this.docBody = null;
			this.unwatchConnection = null;
		}

		componentWillMount() {
			// window.mmLoading.destroy();

			this.initProcess().then(shouldInit => {
				if (!shouldInit) {
					this.initApp();
				}
			});
		}

		componentDidMount() {
			window.mmLoading.destroy();
			window.addEventListener('scroll', this.handleScroll, true);
			this.docBody = document.body;
			const { dispatch } = this.props;
			const con = (bool) => {
				if (bool) {
					dispatch(actions.showSnack(uniqid('off-'), {
						label: 'You\'re now offline, please check your internet connection.',
						timeout: 5000,
						button: {
							label: 'TUTUP'
						}
					}));
				}
			};

			check().then(con);
			const unwatch = watch(con);
			this.unwatchConnection = unwatch;

			if (typeof this.uniqueId === 'undefined') {
				const uuid = uuidv4();

				setUniqeCookie(this.props.cookies, uuid);
			}
		}

		componentWillUnmount() {
			window.mmLoading.play();
			window.removeEventListener('scroll', this.handleScroll, true);
			window.prevLocation = this.props.location;

			if (this.unwatchConnection) {
				this.unwatchConnection();
			}
		}

		shouldLoginAnonymous() {
			const { cookies } = this.props;
			return (_.isEmpty(cookies.get('user.token')) || _.isEmpty(cookies.get('user.rf.token')));
		}

		async exeCall(token = null) {
			const { shared, dispatch, cookies } = this.props;
			const { login, provider } = this.state;
			let tokenBearer = token === null ? this.userCookies : token.token;
			let rfT = token === null ? this.userRFCookies : token.refresh_token;

			const [er, resp] = await to(dispatch(new users.refreshToken(rfT, tokenBearer)));
			if (er) {
				this.withErrorHandling(er);
			}

			const { data } = resp.data;

			const isAnonymous = data.info.userid <= 1;
			setUserCookie(this.props.cookies, data, isAnonymous);

			tokenBearer = data.token;
			rfT = data.refresh_token;

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

			if (cookies.get('isLogin') === 'true') {
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

			const errMessage = _.chain(response).get('data.error_message').value() || false;

			if (errMessage) {
				dispatch(actions.showSnack(uniqid('err-'), {
					label: errMessage,
					timeout: 5000,
					button: {
						label: 'COBA LAGI',
						action: 'reload'
					}
				}));
			}

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
			const navbar = document.querySelector('.navigation__navigation');

			return (
				<div>
					<Snackbar
						history={this.props.history}
						location={this.props.location}
						customStyles={{ snack: { bottom: navbar !== null ? 51 : 0, zIndex: navbar !== null ? 2 : 999 } }}
					/>
					<WrappedComponent {...this.props} scroll={this.state.scroll} />
				</div>
			);
		}
	}
	return SharedAction;
};

export default sharedAction;
