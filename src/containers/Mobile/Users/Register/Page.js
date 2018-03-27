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
	Svg
} from '@/components/mobile';
import {
	setUserCookie
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
import {
	TrackingRequest,
	registerSuccessBuilder,
	sendGtm,
} from '@/utils/tracking';
import { userSource, userToken } from '@/data/cookiesLabel';
import handler from '@/containers/Mobile/Shared/handler';

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
			isButtonResendOtpLoading: false
		};
		this.renderRegisterView = this.renderRegisterView.bind(this);
		this.renderValidateOtpView = this.renderValidateOtpView.bind(this);
		this.renderMobileOrEmailHasBeenRegistered = this.renderMobileOrEmailHasBeenRegistered.bind(this);
		this.otpClickBack = this.otpClickBack.bind(this);

	}

	async onSocialRegister(provider, e) {
		const { cookies, dispatch, history } = this.props;
		const { redirectUri } = this.state;
		const { accessToken } = e;

		const [err, response] = await to(dispatch(new users.userSocialLogin(cookies.get(userToken), provider, accessToken)));
		if (err) {
			return err;
		}
		setUserCookie(this.props.cookies, response.token);
		this.trackingHandler(response, provider);
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
		const [errorRegister, responseRegister] = await to(dispatch(new users.userRegister(cookies.get(userToken), dataForRegister)));

		// Throw error if any.
		if (errorRegister) {
			const { code } = errorRegister.response.data;
			if (code === 422 && errorRegister.response.data.error_message === 'hp_email is already taken.') {
				this.setState({ whatIShouldRender: 'EMAIL_MOBILE_HAS_BEEN_REGISTERED' });
				return false;
			}

			return false;
		}
		// Extract response from register
		const { data } = responseRegister;
		const { code } = data;

		// Response from register is success
		if (code === 200 && data.data.id) {
			// Check if we register via mobile.
			if (registerWith === 'MOBILE') {
				// Then send OTP
				const [errorUserOtp, responseUserOtp] = await to(dispatch(new users.userOtp(cookies.get(userToken), dataForRegister.hp_email)));
				if (errorUserOtp) {
					console.log('Error on OTP');
					return false;
				}
				// Set state for OTP
				this.setState({
					whatIShouldRender: 'VALIDATE_OTP'
				});

				return responseUserOtp;

			}

			const [errorUserLogin, responseUserLogin] = await to(dispatch(new users.userLogin(cookies.get(userToken), email, password)));

			if (errorUserLogin) {
				return false;
			}

			this.trackingHandler(responseRegister);

			// Set the cookie for the page.
			setUserCookie(cookies, responseUserLogin.token);
			history.push(redirectUri || '/');

		}

		return responseRegister;

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
				validPassword: !validator.isEmpty(value) && validator.isLength(value, { min: 6, max: undefined })
			});
		}

	}

	trackingHandler(response, method = 'onsite') {
		const request = new TrackingRequest();
		request.setEmailHash('').setUserId(response.userid).setCurrentUrl(`/${this.state.current}`);
		request.setFusionSessionId('').setUserIdEncrypted('').setIpAddress('').setLoginRegisterMethod(method);
		const requestPayload = request.getPayload(registerSuccessBuilder);
		if (requestPayload) sendGtm(requestPayload);
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

	async successValidateOtp() {

		const { cookies, dispatch, history } = this.props;
		const { email, password, redirectUri } = this.state;

		const [errorUserLogin, responseUserLogin] = await to(dispatch(new users.userLogin(cookies.get(userToken), email, password)));

		if (errorUserLogin) {
			console.log('error on user login');
			return false;
		}

		// Set the cookie for the page.
		setUserCookie(cookies, responseUserLogin.token);
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
			validEmailOrMobile
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

		let iconRightPasswordContent = 'ico_password_hide.svg';
		if (visiblePassword === true) {
			iconRightPasswordContent = 'ico_password_show.svg';
		}

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
			iconRight: (
				<Button onClick={() => this.setState({ visiblePassword: !visiblePassword })}>
					<Svg src={iconRightPasswordContent} />
				</Button>)
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

		if (isLoading === true) {
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

		return (
			<div>
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
					<p>Dengan membuka Akun, Anda telah membaca, mengerti dan menyetujui <Link to='/'>Syarat & Ketentuan dan Kebijakan Privasi</Link> MatahariMall.com</p>
				</div>
				<div className='margin--medium-v'>
					<Button {...buttonRegisterAttribute}>Daftar</Button>
				</div>
			</div>
		);
	}

	renderValidateOtpView() {

		const { email } = this.state;

		return (
			<Otp
				phoneEmail={email}
				onClickBack={this.otpClickBack}
				onSuccess={() => this.successValidateOtp()}
			/>
		);
	}

	renderMobileOrEmailHasBeenRegistered() {

		const { email } = this.state;

		const buttonProperty = {
			color: 'secondary',
			size: 'large'
		};

		return (
			<div>
				<p>Akun ini sudah terdafatar. Silahkan lakukan log in untuk mengakses akun</p>
				<p>Masuk dengan {email} </p>
				<Link to='/login'>
					<Button {...buttonProperty}>Login</Button>
				</Link>
				<Link to='/forgotPassword'>Lupa Password</Link>
			</div>
		);
	}

	render() {

		const { callback } = this.props;
		const {
			whatIShouldRender
		} = this.state;

		let View = this.renderRegisterView();

		if (whatIShouldRender === 'VALIDATE_OTP') {
			View = this.renderValidateOtpView();
			callback(whatIShouldRender);
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
