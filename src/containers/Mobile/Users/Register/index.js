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
	setUserCookie,
	isFullUrl
} from '@/utils';
import styles from '../user.scss';
import { to } from 'await-to-js';
import validator from 'validator';
import util from 'util';
import _ from 'lodash';
import {
	Login as LoginWidget
} from '@/containers/Mobile/Widget';
import Otp from '@/containers/Mobile/Shared/Otp';
import { userSource, userToken } from '@/data/cookiesLabel';
import handler from '@/containers/Mobile/Shared/handler';
import {
	TrackingRequest,
	sendGtm,
	registerSuccessBuilder,
} from '@/utils/tracking';
import { Utils } from '@/utils/tracking/lucidworks';

const trackSuccessRegister = (userProfile, ipAddress, provider = 'onsite') => {
	const data = {
		emailHash: _.defaultTo(userProfile.enc_email, ''),
		userIdEncrypted: userProfile.enc_userid,
		userId: userProfile.userid,
		ipAddress,
		currentUrl: '/register',
		fusionSessionId: Utils.getSessionID(),
		loginRegisterMethod: provider
	};
	const request = new TrackingRequest(data);
	const requestPayload = request.getPayload(registerSuccessBuilder);
	if (requestPayload) sendGtm(requestPayload);
};
@handler
class Register extends Component {
	constructor(props) {
		super(props);
		this.source = this.props.cookies.get(userSource);
		this.props = props;
		this.state = {
			current: 'register',
			visiblePassword: false,
			loginId: '',
			email: '',
			password: '',
			otpValue: '',
			validLoginId: false,
			validPassword: false,
			validEmailOrMobile: false,
			registerWith: 'EMAIL',
			whatIShouldRender: 'REGISTER',
			redirectUri: props.redirectUri || false,
			disableOtpButton: false,
			messageType: 'SUCCESS',
			isButtonResendOtpLoading: false,
			countdownValue: 60
		};
		this.renderRegisterView = this.renderRegisterView.bind(this);
		this.renderValidateOtpView = this.renderValidateOtpView.bind(this);
		this.renderMobileOrEmailHasBeenRegistered = this.renderMobileOrEmailHasBeenRegistered.bind(this);

	}

	async onSocialRegister(provider, e) {
		const { cookies, dispatch, history } = this.props;
		const { redirectUri } = this.state;
		const { accessToken } = e;

		const [err, response] = await to(dispatch(new users.userSocialLogin(cookies.get(userToken), provider, accessToken)));
		if (err) {
			return err;
		}
		const userProfile = JSON.stringify({ name: response.userprofile.name, avatar: response.userprofile.avatar });
		setUserCookie(this.props.cookies, response.token, false, userProfile);
		await dispatch(new users.afterLogin(cookies.get(userToken)));

		trackSuccessRegister(response.userprofile, response.ipAddress, provider);

		if (isFullUrl(redirectUri)) {
			top.location.href = redirectUri;
			return true;
		}
		history.push(redirectUri || '/');
		return response;
	}

	async onRegister(e) {

		// Extract some props.
		const { cookies, dispatch, history } = this.props;

		// Extract some state.
		const { loginId, email, password, redirectUri, registerWith } = this.state;

		// Prepare data for register.
		const dataForRegister = { fullname: loginId, hp_email: email, pwd: password };

		// Call register action.
		const [errorRegister, response] = await to(dispatch(new users.userRegister(cookies.get(userToken), dataForRegister)));

		// Throw error if any.
		if (errorRegister) {
			if (errorRegister.code === 409 || errorRegister.error_message.indexOf('taken') > -1 || errorRegister.error_message.indexOf('sudah terdaftar') > -1) {
				this.setView('EMAIL_MOBILE_HAS_BEEN_REGISTERED');
				return false;
			}
			return false;
		}
		// remove current token
		window.sessionStorage.removeItem('cacheToken');
		// Response from register is success
		if (response.data.id) {
			// Check if we register via mobile.
			if (registerWith === 'MOBILE') {
				const otpResponse = await to(dispatch(new users.userOtp(cookies.get(userToken), email, 'register')));
				if (otpResponse[0]) {
					return otpResponse[0];
				}
				this.setState({
					countdownValue: _.chain(otpResponse[1]).get('countdown').value() || 60
				});
				// Set state for OTP
				this.setView('VALIDATE_OTP');
				return false;
			}

			const [errorUserLogin, responseUserLogin] = await to(dispatch(new users.userLogin(cookies.get(userToken), email, password)));

			if (errorUserLogin) {
				return errorUserLogin;
			}

			// Set the cookie for the page.
			const userProfile = JSON.stringify({ name: responseUserLogin.userprofile.name, avatar: responseUserLogin.userprofile.avatar });
			setUserCookie(this.props.cookies, responseUserLogin.token, false, userProfile);
			await dispatch(new users.afterLogin(cookies.get(userToken)));

			trackSuccessRegister(responseUserLogin.userprofile, responseUserLogin.ipAddress);

			if (isFullUrl(redirectUri)) {
				top.location.href = redirectUri;
				return true;
			}
			history.push(redirectUri || '/');
		}

		return response;

	}

	onFieldChange(e, type) {

		const value = util.format('%s', e.target.value);

		if (type === 'email') {

			let valueId = false;
			this.setState({ registerWith: 'EMAIL' });

			if ((value.substring(0, 1) === '0' && _.parseInt(value) > 0 && validator.isMobilePhone(value, 'any')) || validator.isEmail(value)) {
				valueId = true;
			}

			if (validator.isMobilePhone(value, 'any') === true) {
				this.setState({ registerWith: 'MOBILE' });
			}

			this.setState({
				validEmailOrMobile: valueId
			});

		} else if (type === 'loginId') {
			this.setState({
				validLoginId: !validator.isEmpty(value)
			});
		} else {
			this.setState({
				typed: value !== '',
				validPassword: !validator.isEmpty(value) && validator.isLength(value, { min: 6, max: undefined })
			});
		}

	}

	setView(whatIShouldRender) {
		this.setState({
			whatIShouldRender
		});
		this.props.callback(whatIShouldRender);
	}

	otpClickBack() {
		const { callback } = this.props;
		// Also clear state from previous page.
		this.setState({
			whatIShouldRender: 'REGISTER',
			loginId: '',
			email: '',
			password: ''
		}, callback('REGISTER'));
	}

	async successValidateOtp(response) {

		const { cookies, dispatch, history } = this.props;
		const { email, password, redirectUri } = this.state;

		const [errorUserLogin, responseUserLogin] = await to(dispatch(new users.userLogin(cookies.get(userToken), email, password)));

		if (errorUserLogin) {
			console.log('error on user login');
			return errorUserLogin;
		}

		// Set the cookie for the page.
		const userProfile = JSON.stringify({ name: responseUserLogin.userprofile.name, avatar: responseUserLogin.userprofile.avatar });
		setUserCookie(this.props.cookies, responseUserLogin.token, false, userProfile);
		await dispatch(new users.afterLogin(cookies.get(userToken)));

		trackSuccessRegister(responseUserLogin.userprofile, responseUserLogin.ipAddress);

		if (isFullUrl(redirectUri)) {
			top.location.href = redirectUri;
			return true;
		}
		history.push(redirectUri || '/');

		return responseUserLogin;
	}

	renderRegisterView() {
		const {
			email,
			password,
			loginId,
			visiblePassword,
			validLoginId,
			validPassword,
			validEmailOrMobile,
			typed,
            redirectUri
		} = this.state;

		const { isLoading } = this.props.users;
		const buttonLoginEnable = !isLoading && validLoginId && validPassword && validEmailOrMobile;

		const inputFullNameAttribute = {
			value: loginId,
			ref: (c) => { this.loginId = c; },
			onChange: (event) => {
				this.onFieldChange(event, 'loginId');
				this.setState({ loginId: event.target.value });
			},
			label: 'Nama Lengkap',
			type: 'text',
			flat: true,
			placeholder: ''
		};

		if (loginId.length > 0 && validLoginId === false) {
			inputFullNameAttribute.error = true;
			inputFullNameAttribute.hint = 'Nama Lengkap Harus Di isi';
		}

		const inputMobileEmailAttribute = {
			value: email,
			ref: (c) => { this.email = c; },
			onChange: (event) => {
				this.onFieldChange(event, 'email');
				this.setState({ email: event.target.value });
			},
			label: 'Nomor Handphone /  Email',
			flat: true,
			placeholder: ''
		};

		if (email.length > 0 && validEmailOrMobile === false) {
			inputMobileEmailAttribute.error = true;
			inputMobileEmailAttribute.hint = 'Format Email/Nomor Handphone tidak sesuai. Silahkan cek kembali';
		}

		const iconRightPasswordContent = visiblePassword ? 'ico_password_show.svg' : 'ico_password_hide.svg';

		const inputPasswordAttribute = {
			value: password,
			ref: (c) => { this.password = c; },
			onChange: (event) => {
				this.onFieldChange(event, 'password');
				this.setState({ password: event.target.value });
			},
			label: 'Password',
			flat: true,
			placeholder: '',
			type: (visiblePassword) ? 'text' : 'password',
			iconRight: typed && (
				<Button onClick={() => this.setState({ visiblePassword: !visiblePassword })}>
					<Svg src={iconRightPasswordContent} />
				</Button>
			)
		};

		if (password.length > 0 && validPassword === false) {
			inputPasswordAttribute.error = true;
			inputPasswordAttribute.hint = 'Password tidak valid';
		}

		const buttonRegisterAttribute = {
			color: 'secondary',
			size: 'large',
			onClick: (e) => this.onRegister(e),
			disabled: !buttonLoginEnable
		};

		if (isLoading) {
			buttonRegisterAttribute.loading = true;
		}

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
		if (redirectUri.indexOf('digital') > -1) {
			showDigitalNotification = true;
		}
        
		return (
			<div>
				{ showDigitalNotification && (
					<Notification {...digitalNotificationAttribute}>
						<span className='font-color--black'>
							Silahkan daftar untuk melanjutkan ke digital
						</span>
					</Notification>
				)}
				<div className='margin--medium font-medium'>Daftar Dengan</div>
				<LoginWidget
					provider={providerConfig}
					onSuccess={(provider, token) => this.onSocialRegister(provider, token)}
					onFailure={(provider, e) => console.log(provider, e)}
				/>
				<div className={styles.divider}>
					<span>Atau</span>
				</div>
				<div>
					<Input {...inputFullNameAttribute} />
					<Input {...inputMobileEmailAttribute} />
					<Input {...inputPasswordAttribute} />
				</div>
				<div className='margin--medium-v text-left'>
					<p>Dengan membuka Akun, Anda telah membaca, mengerti dan menyetujui <a href='https://super.mataharimall.com/static/cf/terms-conditions.html'>Syarat & Ketentuan</a> dan <a href='https://super.mataharimall.com/static/cf/privacy-policy.html'>Kebijakan Privasi</a> MatahariMall.com</p>
				</div>
				<div className='margin--medium-v'>
					<Button {...buttonRegisterAttribute}>Daftar</Button>
				</div>
			</div>
		);
	}

	renderValidateOtpView() {
		
		const { email, countdownValue } = this.state;
		
		return (
			<Otp
				countdownValue={countdownValue}
				autoSend={false}
				type={'register'}
				phoneEmail={email}
				onClickBack={() => this.otpClickBack()}
				onSuccess={(response) => this.successValidateOtp(response)}
			/>
		);
	}

	renderMobileOrEmailHasBeenRegistered() {

		const { email } = this.state;

		const buttonProperty = {
			color: 'secondary',
			size: 'large',
			wide: true
		};

		return (
			<div className={styles.container}>
				<div className='margin--medium-v font-medium'>Akun ini sudah terdaftar. Silahkan lakukan log in untuk mengakses akun.</div>
				<div className='margin--medium-v font-medium text-center'>
					<p>
						MASUK DENGAN {email}
					</p>
				</div>
				<div className='margin--small-v'>
					<Link to={`/login${location.search}`}>
						<Button {...buttonProperty}>LOGIN</Button>
					</Link>
				</div>
				<div className='margin--medium-v text-center'>
					<Link to={`/forgot-password${location.search}`}>Lupa Password</Link>
				</div>
			</div>
		);
	}

	render() {
		const {
			whatIShouldRender
		} = this.state;

		let View = this.renderRegisterView();

		if (whatIShouldRender === 'VALIDATE_OTP') {
			View = this.renderValidateOtpView();
		}

		if (whatIShouldRender === 'EMAIL_MOBILE_HAS_BEEN_REGISTERED') {
			View = this.renderMobileOrEmailHasBeenRegistered();
		}

		return (
			<div className={styles.container}>
				{View}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		...state,
		isLoginLoading: state.users.isLoading
	};
};

export default withCookies(
	connect(mapStateToProps)(Register)
);
