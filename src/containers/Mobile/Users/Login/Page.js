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
// import Shared from '@/containers/Mobile/Shared';
import {
	Login as LoginWidget
} from '@/containers/Mobile/Widget';
import {
	setUserCookie,
	renderIf
} from '@/utils';
import styles from '../user.scss';
import _ from 'lodash';
import validator from 'validator';
import util from 'util';
import to from 'await-to-js';
import {
	TrackingRequest,
	loginSuccessBuilder,
	sendGtm,
} from '@/utils/tracking';

import { userToken } from '@/data/cookiesLabel';
import handler from '@/containers/Mobile/Shared/handler';
import { Utils } from '@/utils/tracking/lucidworks';

@handler
class LoginPage extends Component {
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
		const [err, response] = await to(dispatch(new users.userLogin(cookies.get(userToken), loginId, password)));
		if (err) {
			return err;
		}
		setUserCookie(this.props.cookies, response.token);
		dispatch(new users.afterLogin(cookies.get(userToken)));
		history.push(redirectUri || '/');

		this.trackingHandler(response, this.props);

		return response;
	}

	async onSocialLogin(provider, token, profile) {
		const { cookies, dispatch, history } = this.props;
		const { redirectUri } = this.state;
		const { accessToken } = token;
		const [err, response] = await to(dispatch(new users.userSocialLogin(cookies.get(userToken), provider, accessToken)));
		if (err) {
			return err;
		}
		setUserCookie(this.props.cookies, response.token);
		dispatch(new users.afterLogin(cookies.get(userToken)));
		history.push(redirectUri || '/');

		this.trackingHandler(response, this.props, provider);

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

	trackingHandler(response, props, method = 'onsite') {
		console.log(this.props);
		const { shared } = props;
		const { userProfile } = users;
		const data = {
			emailHash: _.defaultTo(userProfile.enc_email, ''),
			userIdEncrypted: userProfile.enc_userid,
			userId: userProfile.id,
			ipAddress: shared.ipAddress,
			currentUrl: `/${this.state.current}`,
			fusionSessionId: Utils.getSessionID(),
			loginRegisterMethod: method
		};

		const request = new TrackingRequest(data);
		const requestPayload = request.getPayload(loginSuccessBuilder);
		if (requestPayload) sendGtm(requestPayload);
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
								<Svg src='ico_password_hide.svg' />
								{
									// <Svg src='ico_password_show.svg' />
								}
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
					<Link className='pull-right' to='/forgot-password'>LUPA PASSWORD</Link>
				</div>
				<div className='margin--medium-v'>
					<Button color='secondary' size='large' disabled={!buttonLoginEnable} loading={isLoading} onClick={(e) => this.onLogin(e)} >LOGIN</Button>
				</div>
			</div>
		);
	}
}

export default withCookies(connect()(LoginPage));
