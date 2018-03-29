import React, { Component } from 'react';
import _ from 'lodash';
import to from 'await-to-js';
import { actions } from '@/state/v4/Shared';
import { actions as users } from '@/state/v4/User';
import { actions as initAction } from '@/state/v4/Home';
import { setUserCookie, setUniqeCookie, setReferrenceCookie, initUTMProcess } from '@/utils';
import { Promise } from 'es6-promise';
import queryString from 'query-string';
import Snackbar from '@/containers/Mobile/Shared/snackbar';
import { Svg } from '@/components/mobile';
import styles from './shared.scss';
import { check as checkConnection, watch as watchConnection } from 'is-offline';
import { userToken, userRfToken, uniqueid } from '@/data/cookiesLabel';
import handler from '@/containers/Mobile/Shared/handler';

const sharedAction = (WrappedComponent, doAfterAnonymousCall) => {
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

			this.userCookies = this.props.cookies.get(userToken);
			this.userRFCookies = this.props.cookies.get(userRfToken);
			this.uniqueId = this.props.cookies.get(uniqueid);
			this.handleScroll = _.throttle(this.handleScroll).bind(this);
			this.docBody = null;
			this.currentScrollPos = 0;
		}

		componentWillMount() {
			// window.mmLoading.destroy();
			const { dispatch, shared, cookies } = this.props;

			dispatch(actions.clearSnackQueue());

			const offline = async (bool) => {
				if (bool) {
					await dispatch(actions.dismissSnack('offline'));
					dispatch(actions.showSnack('offline', {
						label: 'Oops, koneksi Internet kamu sepertinya terputus.',
						timeout: 10000,
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

			if (!window.surfs) window.surfs = [];
		}

		componentDidMount() {
			window.mmLoading.destroy();
			window.addEventListener('scroll', this.handleScroll, true);
			this.docBody = document.body;

			if (typeof this.uniqueId === 'undefined') {
				setUniqeCookie(this.props.cookies);
			}

			initUTMProcess();
		}

		componentWillUnmount() {
			window.mmLoading.play();
			window.surfs = window.surfs ? [this.props.location, ...window.surfs] : [this.props.location];
			window.previousLocation = location.pathname + location.search;
			window.removeEventListener('scroll', this.handleScroll, true);
		}

		shouldLoginAnonymous() {
			const { cookies } = this.props;
			return (_.isEmpty(cookies.get(userToken)) || _.isEmpty(cookies.get(userRfToken)));
		}

		async exeCall(token = null) {
			const { shared, dispatch } = this.props;
			const { login, provider } = this.state;
			let tokenBearer = token === null ? this.userCookies : token.token;
			const rfT = token === null ? this.userRFCookies : token.refresh_token;

			const resp = await to(dispatch(new users.refreshToken(rfT, tokenBearer)));

			const { data } = resp[1].data;

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

			dispatch(new users.userGetProfile(tokenBearer));

			if (typeof doAfterAnonymousCall !== 'undefined') {
				await to(doAfterAnonymousCall.apply(this, [this.props]));
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

		async initProcess() {
			// check existing props
			const { shared } = this.props;
			const serviceUrl = _.chain(shared).get('serviceUrl').value() || false;
			if (!serviceUrl) {
				const response = await to(this.props.dispatch(new initAction.initAction()));
				if (response[0]) {
					return null;
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

		snackStyle = () => {
			const snackStyle = _.chain(this.props.shared.snackbar).get('[0].style').value() || { css: {}, sticky: true, theming: {} };
			const snackCss = _.chain(snackStyle).get('css.snack').value() || {};
			const themingSnackCss = _.chain(snackStyle).get('theming.snack').value() || {};
			const stickyEl = this.botNav || false;
			const snackSticky = !snackStyle.sticky ? {} : {
				bottom: !this.state.scroll.isNavSticky && stickyEl
						? (+(parseInt(snackCss.bottom, 10) || 0) + +stickyEl.getBoundingClientRect().height)
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
					<WrappedComponent {...this.props} scroll={scroll} botNav={(r) => { this.botNav = r; }} />
					{
						scroll.top > 20 && (
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
