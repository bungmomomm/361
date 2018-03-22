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
	setUserInfoCookie
} from '@/utils';
import styles from '../user.scss';
import _ from 'lodash';
import validator from 'validator';
import util from 'util';
import to from 'await-to-js';

import Logout from './Logout';

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

	componentDidMount() {

	}

	async onLogin(e) {
		const { cookies, dispatch, history } = this.props;
		const { loginId, password, redirectUri } = this.state;
		const [err, response] = await to(dispatch(new users.userLogin(cookies.get('user.token'), loginId, password)));
		if (err) {
			return err;
		}
		setUserCookie(this.props.cookies, response.token);
		setUserInfoCookie(cookies, _.toInteger(response.userprofile.userid));
		dispatch(new users.afterLogin(cookies.get('user.token')));
		history.push(redirectUri || '/');
		return response;
	}

	async onSocialLogin(provider, token, profile) {
		const { cookies, dispatch, history } = this.props;
		const { redirectUri } = this.state;
		const { accessToken } = token;
		const [err, response] = await to(dispatch(new users.userSocialLogin(cookies.get('user.token'), provider, accessToken)));
		if (err) {
			return err;
		}
		setUserCookie(this.props.cookies, response.token);
		dispatch(new users.afterLogin(cookies.get('user.token')));
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
				validLoginPassword: !validator.isEmpty(value) && validator.isLength(value, { min: 6, max: undefined })
			});
		}
	}

	handlePick(current) {
		this.setState({ current });
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

		return (
			<div className={styles.container}>
				<div className='margin--medium-v font-medium'>Login Dengan</div>
				<LoginWidget
					provider={providerConfig}
					onSuccess={(provider, token, profile) => this.onSocialLogin(provider, token, profile)}
					onFailure={(provider, e) => console.log(provider, e)}
				/>
				<div className={styles.divider}><span>Atau</span></div>
				{renderIf(login)(
					<Notification style={{ marginBottom: '20px' }} disableClose color='pink' show><span className='font-color--secondary'>Email/No Handphone/Password yang Anda masukkan salah</span></Notification>
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
						iconRight={
							<Button onClick={() => this.setState({ visiblePassword: !visiblePassword })}>
								<Svg src={visiblePassword ? 'ico_password_hide.svg' : 'ico_password_show.svg'} />
							</Button>
						}
						type={visiblePassword ? 'text' : 'password'}
						placeholder=''
						error={!validLoginPassword && password !== ''}
						hint={!validLoginPassword && 'Password minimal 6 karakter'}
						flat
					/>
				</div>
				<div className='text-right margin--medium-v'>
					<Link className='pull-right' to={`/forgot-password?redirectUri=${redirectUri}`}>LUPA PASSWORD</Link>
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
