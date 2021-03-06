import React, { Component } from 'react';
import _ from 'lodash';
import to from 'await-to-js';
import { actions } from '@/state/v4/Shared';
import { actions as account } from '@/state/v4/User';
import { actions as initAction } from '@/state/v4/Home';
import { actions as shopBagAction } from '@/state/v4/ShopBag';
import { setUserCookie, setUniqeCookie, setReferrenceCookie, initUTMProcess, removeUserCookie } from '@/utils';
import { Promise } from 'es6-promise';
import queryString from 'query-string';
import Snackbar from '@/containers/Mobile/Shared/snackbar';
import { Svg } from '@/components/mobile';
import styles from './shared.scss';
import { check as checkConnection, watch as watchConnection } from 'is-offline';
import {
	userToken,
	userRfToken,
	shouldRefreshToken,
	uniqueid
} from '@/data/cookiesLabel';
import handler from '@/containers/Mobile/Shared/handler';

const isStorageSupport = typeof window.Storage !== 'undefined';

const sharedAction = (WrappedComponent, doAfterAnonymousCall, back2top = true) => {
	WrappedComponent.contextTypes = {
		router: React.PropTypes.object,
		location: React.PropTypes.object
	};

	@handler
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
					isNavSticky: false
				},
				provider: (query.code || query.state) ? (query.code ? 'facebook' : 'google') : false,
				watchConnection: false,
			};

			this.uniqueId = this.props.cookies.get(uniqueid);
			this.handleScroll = _.throttle(this.handleScroll).bind(this);
			this.docBody = null;
			this.currentScrollPos = 0;
			this.persistSnackStyle = false;
			if (!window.surfs) window.surfs = [];
		}

		componentWillMount() {
			// window.mmLoading.destroy();
			const { dispatch, shared, cookies } = this.props;

			dispatch(actions.clearSnackQueue());

			const offline = async (bool) => {
				if (bool) {
					await dispatch(actions.dismissSnack('offline'));
					dispatch(actions.showSnack(
						'offline',
						{
							label: 'Oops, koneksi Internet kamu sepertinya terputus.',
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
			};

			if (!shared.watchConnection) {
				dispatch(actions.watchConnection());
				checkConnection().then(offline);
				watchConnection(offline);
			}

			// const existingPref = cookies.get(pageReferrer);
			const referrer = window.previousLocation === '/category' ? 'categories' : (window.previousLocation === '/' ? 'home' : '');

			if (referrer !== '') {
				setReferrenceCookie(cookies, referrer);
			}

			this.initProcess().then(shouldInit => {
				if (!shouldInit) {
					this.initApp();
				}
			});
		}

		componentDidMount() {
			// window.mmLoading.destroy();
			window.addEventListener('scroll', this.handleScroll, true);
			this.docBody = document.body;

			if (typeof this.uniqueId === 'undefined') {
				setUniqeCookie(this.props.cookies);
			}

			initUTMProcess();
		}

		componentWillReceiveProps(nextProps) {
			const snackStyle = _.chain(nextProps.shared.snackbar).get('[0].style').value();
			if (snackStyle) {
				this.persistSnackStyle = snackStyle;
			}
		}

		componentWillUnmount() {
			// window.mmLoading.play();
			window.surfs = [this.props.location, ...window.surfs];
			window.previousLocation = this.props.location.pathname + this.props.location.search;
			window.removeEventListener('scroll', this.handleScroll, true);
		}

		async getTokenData(token = null) {
			const { cookies } = this.props;

			if (cookies.get(shouldRefreshToken) === 'true') {
				return this.refreshToken(token);
			}
			if (isStorageSupport) {
				const cacheToken = JSON.parse(window.sessionStorage.cacheToken || null) || false;

				if (cacheToken) {
					return cacheToken;
				}
			}

			return this.refreshToken(token);
		}

		async refreshToken(token) {
			const { cookies, dispatch } = this.props;
			const tokenBearer = token === null ? cookies.get(userToken) : token.token;
			const rfT = token === null ? cookies.get(userRfToken) : token.refresh_token;

			const resp = await to(dispatch(new account.refreshToken(rfT, tokenBearer)));

			if (resp[0]) {
				if (resp[0].code === 405) {
					removeUserCookie(cookies);
					dispatch(actions.showSnack('Trouble', {
						label: 'Akun Anda ter-logout. Silakan login ulang untuk melanjutkan pembayaran',
						timeout: 3000,
						button: {
							label: 'COBA LAGI',
							action: 'reload'
						}
					}));
					setTimeout(() => {
						window.location.reload();
					}, 3000);
				}
			}
			const { data } = resp[1].data;

			if (isStorageSupport) {
				window.sessionStorage.removeItem('cacheToken');
				window.sessionStorage.cacheToken = JSON.stringify(data);
			}
			return data;
		}

		shouldLoginAnonymous() {
			const { cookies } = this.props;
			return (_.isEmpty(cookies.get(userToken)) || _.isEmpty(cookies.get(userRfToken)));
		}

		async exeCall(token = null) {
			const { cookies, dispatch, users } = this.props;
			const { login, provider } = this.state;

			const data = await this.getTokenData(token);

			let tokenBearer = token === null ? cookies.get(userToken) : token.token;

			const isAnonymous = data.info.userid <= 1;
			setUserCookie(this.props.cookies, data, isAnonymous);

			tokenBearer = data.token;

			dispatch(new actions.totalCartAction(tokenBearer));
			dispatch(shopBagAction.getAction(tokenBearer));
			dispatch(new actions.totalLovelistAction(tokenBearer));

			if (login && provider) {
				await to(dispatch(new account.userSocialLogin(tokenBearer, provider, login)));
			}

			if ((users && !users.userProfile) || cookies.get(shouldRefreshToken) === 'true') {
				dispatch(new account.userGetProfile(tokenBearer));
			}

			if (typeof doAfterAnonymousCall !== 'undefined' || cookies.get(shouldRefreshToken) === 'true') {
				await to(doAfterAnonymousCall.apply(this, [this.props]));
			}
			cookies.remove(shouldRefreshToken, {
				domain: process.env.SESSION_DOMAIN,
				path: '/'
			});
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
			const response = await to(this.props.dispatch(new account.userAnonymous()));

			if (response[0]) {
				return null;
			}

			setUserCookie(this.props.cookies, response[1].token, true);
			return Promise.resolve({
				status: 1,
				msg: '',
				token: response[1].token
			});
		}

		initCache(initData) {
			const { dispatch } = this.props;
			dispatch(actions.cacheInitData(initData));
		}

		async initProcess() {
			// check existing props
			const { shared } = this.props;
			if (isStorageSupport) {
				const initData = JSON.parse(window.sessionStorage.initCache || null) || false;

				if (initData) {
					this.initCache(initData);
					return false;
				}
			}
			const serviceUrl = _.chain(shared).get('serviceUrl').value() || false;
			if (!serviceUrl) {
				const response = await to(this.props.dispatch(new initAction.initAction()));
				if (response[0]) {
					return null;
				}

				if (isStorageSupport) {
					// save to session storage, when user close browser will be gone
					window.sessionStorage.removeItem('initCache');
					window.sessionStorage.initCache = JSON.stringify(response[1]);
				}

				this.initApp();
				return response[1];
			}

			return false;
		}

		handleScroll(e) {
			const docHeight = this.docBody ? this.docBody.scrollHeight - window.innerHeight : 0;
			this.setState({
				scroll: {
					top: window.scrollY,
					docHeight,
					// isNavSticky: ((oldPos = this.currentScrollPos) => {
					// 	if (!scroll) {
					// 		return false;
					// 	}
					// 	this.currentScrollPos = this.state.scroll.top;
					// 	return this.state.scroll.top > oldPos && this.state.scroll.top < this.state.scroll.docHeight;
					// })()
					isSticky: false
				}
			});
		}

		snackStyle = () => {
			const snackStyle = this.persistSnackStyle || { css: {}, sticky: true, theming: {} };
			const snackCss = _.chain(snackStyle).get('css.snack').value() || {};
			const themingSnackCss = _.chain(snackStyle).get('theming.snack').value() || {};
			const stickyEl = (this.botNav) || false;
			const snackSticky = !snackStyle.sticky ? {} : {
				bottom: (!this.state.scroll.isNavSticky && stickyEl) || this.botBar
						? (+(parseInt(snackCss.bottom, 10) || 0) + (stickyEl ? +stickyEl.getBoundingClientRect().height : +this.botBar.getBoundingClientRect().height))
						: (+(parseInt(snackCss.bottom, 10) || 0) + 0),
				zIndex: !this.state.scroll.isNavSticky && stickyEl ? 2 : 999
			};
			const customStyles = { ...snackStyle.css, snack: { ...snackCss, ...snackSticky, largeScreen: { ...snackCss, ...snackSticky } } };
			return { theming: { ...snackStyle.theming, snack: { ...themingSnackCss, ...snackSticky, largeScreen: { ...snackCss, ...snackSticky } } }, customStyles };
		};

		render() {
			const { scroll } = this.state;
			const { location, history } = this.props;
			return (
				<div className='shared_container'>
					<Snackbar history={history} location={location} theming={this.snackStyle().theming} customStyles={this.snackStyle().customStyles} />
					<WrappedComponent {...this.props} scroll={scroll} botNav={(r) => { this.botNav = r; }} botBar={(r) => { this.botBar = r; }} />
					{
						back2top && scroll.top > 20 && (
							<a href='#root' className={styles.backToTop}>
								<Svg src='ico_to-top.svg' />
							</a>
						)
					}
				</div>
			);
		}
	}
	return SharedAction;
};

export default sharedAction;
