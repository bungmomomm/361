import React, { Component } from 'react';
import _ from 'lodash';
import to from 'await-to-js';
import { actions } from '@/state/v4/Shared';
import { actions as users } from '@/state/v4/User';
import { actions as initAction } from '@/state/v4/Home';
import { setUserCookie, setUniqeCookie } from '@/utils';
import { Promise } from 'es6-promise';
import queryString from 'query-string';
import Snackbar from '@/containers/Mobile/Shared/snackbar';
import { check as checkConnection, watch as watchConnection } from 'is-offline';

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
					docHeight: 0,
					isNavSticky: false,
					isNavExists: false
				},
				provider: (query.code || query.state) ? (query.code ? 'facebook' : 'google') : false,
				watchConnection: false
			};

			this.userCookies = this.props.cookies.get('user.token');
			this.userRFCookies = this.props.cookies.get('user.rf.token');
			this.uniqueId = this.props.cookies.get('uniqueid');
			this.handleScroll = this.handleScroll.bind(this);
			this.docBody = null;
			this.currentScrollPos = 0;
		}

		componentWillMount() {
			// window.mmLoading.destroy();
			const { dispatch, shared } = this.props;
			dispatch(actions.clearSnackQueue());

			const offline = async (bool) => {
				if (bool) {
					await dispatch(actions.dismissSnack('offline'));
					dispatch(actions.showSnack('offline', {
						label: 'Oops, koneksi Internet kamu sepertinya terputus.',
						timeout: 7000,
						button: {
							label: 'COBA LAGI',
							action: 'reload'
						}
					}));
				}
			};

			if (!shared.watchConnection) {
				dispatch(actions.watchConnection());
				checkConnection().then(offline);
				watchConnection(offline);
			}

			this.initProcess().then(shouldInit => {
				if (!shouldInit) {
					this.initApp();
				}
			});

			const location = this.props.location;
			if (!window.previousLocation) window.previousLocation = location.pathname + location.search;
		}

		componentDidMount() {
			// window.mmLoading.destroy();
			window.addEventListener('scroll', this.handleScroll, true);
			this.docBody = document.body;

			if (typeof this.uniqueId === 'undefined') {
				setUniqeCookie(this.props.cookies);
			}
		}

		componentWillUnmount() {
			window.mmLoading.play();
			window.removeEventListener('scroll', this.handleScroll, true);
			window.prevLocation = this.props.location;
			window.previousLocation = location.pathname + location.search;
		}

		shouldLoginAnonymous() {
			const { cookies } = this.props;
			return (_.isEmpty(cookies.get('user.token')) || _.isEmpty(cookies.get('user.rf.token')));
		}

		async exeCall(token = null) {
			const { shared, dispatch } = this.props;
			const { login, provider } = this.state;
			let tokenBearer = token === null ? this.userCookies : token.token;
			const rfT = token === null ? this.userRFCookies : token.refresh_token;
			const resp = await to(dispatch(new users.refreshToken(rfT, tokenBearer)));

			const data = resp[1].data.data;

			const isAnonymous = data.info.userid <= 1;
			setUserCookie(this.props.cookies, data, isAnonymous);

			tokenBearer = data.token;

			if (shared.totalCart === 0) {
				dispatch(new actions.totalCartAction(tokenBearer));
			}

			if (shared.totalLovelist === 0) {
				dispatch(new actions.totalLovelistAction(tokenBearer));
			}
			if (login && provider) {
				await to(dispatch(new users.userSocialLogin(tokenBearer, provider, login)));
			}

			if (typeof doAfterAnonymousCall !== 'undefined') {
				await doAfterAnonymousCall.apply(this, [this.props]);
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
			const response = await to(this.props.dispatch(new users.userAnonymous()));

			setUserCookie(this.props.cookies, response[1].token, true);
			return Promise.resolve({
				status: 1,
				msg: '',
				token: response[1].token
			});
		}

		async initProcess() {
			// check existing props
			const { shared } = this.props;
			const serviceUrl = _.chain(shared).get('serviceUrl').value() || false;
			if (!serviceUrl) {
				const response = await to(this.props.dispatch(new initAction.initAction()));

				this.initApp();
				return response[1];
			}

			return false;
		}

		handleScroll(e) {
			if (e.target.tagName === 'BODY') {
				const docHeight = this.docBody ? this.docBody.scrollHeight - window.innerHeight : 0;
				this.setState({
					scroll: {
						top: e.target.scrollTop,
						docHeight,
						isNavSticky: ((oldPos = this.currentScrollPos) => {
							if (!scroll) {
								return false;
							}
							this.currentScrollPos = this.state.scroll.top;
							return this.state.scroll.top > oldPos && this.state.scroll.top < this.state.scroll.docHeight;
						})()
					}
				});
			}
		}

		render() {
			const { scroll } = this.state;
			const snackStyle = _.chain(this.props.shared.snackbar).get('[0].style').value() || { css: {}, sticky: true };
			const snackCss = _.chain(snackStyle).get('css.snack').value() || {};
			const snackSticky = !snackStyle.sticky ? {} : {
				bottom: !scroll.isNavSticky && document.querySelector('.navigation__navigation') ? 50 : 0,
				zIndex: !scroll.isNavSticky && document.querySelector('.navigation__navigation') ? 2 : 999
			};
			const customStylesCss = { ...snackStyle.css, snack: { ...snackCss, ...snackSticky } };


			return (
				<div>
					<Snackbar history={this.props.history} location={this.props.location} customStyles={customStylesCss} />
					<WrappedComponent {...this.props} scroll={this.state.scroll} />
				</div>
			);
		}
	}
	return SharedAction;
};

export default sharedAction;
