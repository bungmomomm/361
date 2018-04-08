import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { actions as users } from '@/state/v4/User';
import {
	Link
} from 'react-router-dom';
import {
	Button,
	Input,
	Svg,
	Notification
} from '@/components/mobile';
import {
	Login as LoginWidget
} from '@/containers/Mobile/Widget';
import {
	setUserCookie,
	renderIf,
	setUserInfoCookie,
	isFullUrl
} from '@/utils';
import styles from '../user.scss';
import _ from 'lodash';
import validator from 'validator';
import util from 'util';
import to from 'await-to-js';
import { userToken } from '@/data/cookiesLabel';
import Logout from './Logout';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Login extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			current: 'login',
			visiblePassword: false,
			loginId: '',
			password: '',
			validLoginId: false,
			validPassword: false,
			validLogin: false,
			redirectUri: props.redirectUri
		};
	}

	async onLogin(e) {
		const { cookies, dispatch, history } = this.props;
		const { loginId, password, redirectUri } = this.state;
		const [err, response] = await to(dispatch(users.userLogin(cookies.get(userToken), loginId, password)));
		if (err) {
			return err;
		}
		// remove current token
		window.sessionStorage.removeItem('cacheToken');
		const userProfile = JSON.stringify({ name: response.userprofile.name, avatar: response.userprofile.avatar });
		setUserCookie(this.props.cookies, response.token, false, userProfile);
		const userInfo = {
			id: response.userprofile.userid,
			encId: response.userprofile.enc_userid,
			encEmail: response.userprofile.enc_email
		};
		setUserInfoCookie(cookies, JSON.stringify(userInfo));
		await dispatch(new users.afterLogin(cookies.get(userToken)));
		if (isFullUrl(redirectUri)) {
			top.location.href = redirectUri;
			return true;
		}
		history.push(redirectUri || '/');
		return response;
	}

	async onSocialLogin(provider, token, profile) {
		const { cookies, dispatch, history } = this.props;
		const { redirectUri } = this.state;
		const { accessToken } = token;
		const [err, response] = await to(dispatch(users.userSocialLogin(cookies.get(userToken), provider, accessToken)));
		if (err) {
			return err;
		}
		// remove current token
		window.sessionStorage.removeItem('cacheToken');
		const userProfile = JSON.stringify({ name: response.userprofile.name, avatar: response.userprofile.avatar });
		setUserCookie(this.props.cookies, response.token, false, userProfile);
		await dispatch(new users.afterLogin(cookies.get(userToken)));
		if (isFullUrl(redirectUri)) {
			top.location.href = redirectUri;
			return true;
		}
		history.push(redirectUri || '/');
		return response;
	}

	onFieldChange(e, type) {
		const value = util.format('%s', e.target.value);
		if (type === 'loginId') {
			let valudId = false;
			if ((value.substring(0, 1) === '0' && _.parseInt(value) > 0 && validator.isMobilePhone(value, 'any')) || validator.isEmail(value)) {
				valudId = true;
			}
			this.setState({
				validLoginId: valudId
			});
		} else {
			this.setState({
				passTyped: (value !== ''),
				validLoginPassword: !validator.isEmpty(value) && validator.isLength(value, { min: 6, max: undefined })
			});
		}
	}

	handlePick(current) {
		this.setState({ current });
	}

	removeError() {
		this.props.dispatch(new users.clearError(this.props.cookies.get(userToken)));
	}

	render() {
		const {
			isLoading,
			login
		} = this.props.users;
		const {
			visiblePassword,
			validLoginId,
			validLoginPassword,
			loginId,
			redirectUri,
			passTyped,
			password
		} = this.state;
		const buttonLoginEnable = !isLoading && validLoginId && validLoginPassword;

		const providerConfig = {
			google: {
				clientId: process.env.GOOGLEAPP_ID,
				appId: process.env.GOOGLEAPP_APIKEY
			},
			facebook: {
				appId: process.env.FBAPP_ID
			}
		};
		
		const digitalNotificationAttribute = {
			color: 'blue',
			show: true,
			disableClose: true
		};
		
		let showDigitalNotification = false;
		if (redirectUri === process.env.DIGITAL_URL) {
			showDigitalNotification = true;
		}
		
		return (
			<div className={styles.container}>
				{ showDigitalNotification && (
					<Notification {...digitalNotificationAttribute}>
						<span className='font-color--black'>
							Silahkan login untuk melanjutkan ke digital
						</span>
					</Notification>
				)}
				<div className='margin--medium-v font-medium'>Login Dengan</div>
				<LoginWidget
					provider={providerConfig}
					onSuccess={(provider, token, profile) => this.onSocialLogin(provider, token, profile)}
					onFailure={(provider, e) => console.log(provider, e)}
				/>
				<div className={styles.divider}><span>Atau</span></div>
				{renderIf(login)(
					<Notification timeout={3000} style={{ marginBottom: '20px' }} disableClose onClose={() => this.removeError()} color='pink' show><span className='font-color--secondary'>Email/No Handphone/Password yang Anda masukkan salah</span></Notification>
				)}
				<div>
					<Input
						value={loginId}
						ref={c => { this.loginId = c; }}
						onChange={(event) => {
							this.onFieldChange(event, 'loginId');
							this.setState({ loginId: event.target.value });
						}}
						label='Nomor Handphone/Email'
						type='text'
						placeholder=''
						error={!validLoginId && loginId !== ''}
						hint={!validLoginId && 'Format Nomor Handphone/Email harus benar'}
						flat
					/>
					<Input
						value={password}
						ref={c => { this.password = c; }}
						onChange={(event) => {
							this.onFieldChange(event, 'password');
							this.setState({ password: event.target.value });
						}}
						label='Password'
						iconRight={passTyped && (
							<Button onClick={() => this.setState({ visiblePassword: !visiblePassword })}>
								<Svg src={visiblePassword ? 'ico_password_hide.svg' : 'ico_password_show.svg'} />
							</Button>
						)}
						type={visiblePassword ? 'text' : 'password'}
						placeholder=''
						error={!validLoginPassword && password !== ''}
						hint={!validLoginPassword && 'Password minimal 6 karakter'}
						flat
					/>
				</div>
				<div className='text-right margin--medium-v'>
					<Link className='pull-right' to={redirectUri ? `/forgot-password?redirect_uri=${redirectUri}` : '/forgot-password'}>LUPA PASSWORD</Link>
				</div>
				<div className='margin--medium-v'>
					<Button color='secondary' size='large' disabled={!buttonLoginEnable} loading={isLoading} onClick={(e) => this.onLogin(e)} >LOGIN</Button>
				</div>
			</div>
		);
	}
}

Login.Logout = Logout;

export default withCookies(connect()(Login));
