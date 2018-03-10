import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { actions as users } from '@/state/v4/User';
import { Link, Redirect } from 'react-router-dom';
import {
	Header,
	Page,
	Button,
	Input,
	Tabs,
	Svg,
	Notification
} from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import { setUserCookie, renderIf } from '@/utils';
import styles from '../user.scss';
import { to } from 'await-to-js';
import queryString from 'query-string';
import validator from 'validator';
import util from 'util';
import _ from 'lodash';
import { 
	Login as LoginWidget 
} from '@/containers/Mobile/Widget';
import Helmet from 'react-helmet';
import Recaptcha from 'react-recaptcha';

const DUMMY_TAB = [
	{
		Title: 'Login',
		id: 'login'
	},
	{
		Title: 'Daftar',
		id: 'register'
	}
];
const OTP_BUTTON_TEXT = 'Kirim ulang kode otp';

class Register extends Component {
	constructor(props) {
		super(props);
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
		this.props = props;
		const query = queryString.parse(props.location.search);
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
			redirectUrl: query.redirect_url || false,
			disableOtpButton: false,
			otpButtonText: OTP_BUTTON_TEXT,
			displayMessageOnValidateOtpForm: false,
			messageType: 'SUCCESS',
			textMessageOnValidateOtpForm: '',
			captchaValue: '',
			isButtonResendOtpLoading: false
		};
		this.renderRegisterView = this.renderRegisterView.bind(this);
		this.renderValidateOtpView = this.renderValidateOtpView.bind(this);
		this.renderMobileOrEmailHasBeenRegistered = this.renderMobileOrEmailHasBeenRegistered.bind(this);
		
	}
	
	async onSocialRegister(provider, e) {
		const { cookies, dispatch, history } = this.props;
		const { redirectUrl } = this.state;
		const { accessToken } = e;
		
		const [err, response] = await to(dispatch(new users.userSocialLogin(cookies.get('user.token'), provider, accessToken)));
		if (err) {
			return err;
		}
		setUserCookie(this.props.cookies, response.token);
		history.push(redirectUrl || '/');
		return response;
	}
	
	async onRegister(e) {
		
		// Extract some props.
		const { cookies, dispatch, history } = this.props;
		
		// Extract some state.
		const { loginId, email, password, redirectUrl, registerWith } = this.state;
		
		// Prepare data for register.
		const dataForRegister = { fullname: loginId, hp_email: email, pwd: password };
		
		// Call register action.
		const [errorRegister, responseRegister] = await to(dispatch(new users.userRegister(cookies.get('user.token'), dataForRegister)));
		
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
				const [errorUserOtp, responseUserOtp] = await to(dispatch(new users.userOtp(cookies.get('user.token'), dataForRegister.hp_email)));
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
			
			const [errorUserLogin, responseUserLogin] = await to(dispatch(new users.userLogin(cookies.get('user.token'), email, password)));
			
			if (errorUserLogin) {
				return false;
			}
			
			// Set the cookie for the page.
			setUserCookie(cookies, responseUserLogin.token);
			history.push(redirectUrl || '/');
			
		}
		
		return responseRegister;
  
	}
	
	async onSendOtp() {
  
		this.setState({
			isButtonResendOtpLoading: true,
			disableOtpButton: true,
			otpValue: '',
			messageType: 'SUCCESS'
		});
		
		const { cookies, dispatch } = this.props;
		const { email } = this.state;
  
		// Send the OTP again.
		
		const [error, response] = await to(dispatch(new users.userOtp(cookies.get('user.token'), email)));
		
		if (error) {
			return false;
		}
		
		// Extract response from send OTP
		const { data } = response;
		
		const { code } = data;
		
		if (code === 200) {
			this.setState({
				displayMessageOnValidateOtpForm: true,
				textMessageOnValidateOtpForm: 'Pengiriman kode OTP berhasil'
			});
		}
		
		// Set the initial number for OTP to 10.
		let number = 301;
		
		const counterDown = () => {
			
			if (number > 0) {
				number -= 1;
				this.setState({
					otpButtonText: number
				});
			}
		};
		
		const doCounter = setInterval(() => {
			counterDown();
			if (number === 0) {
				this.setState({
					disableOtpButton: false,
					otpButtonText: OTP_BUTTON_TEXT
				});
				clearInterval(doCounter);
			}
		}, 1000);

		
		doCounter();
		
		return response;
		
	}
	
	async onVerifyOtp() {
		
		const { cookies, dispatch, history } = this.props;
		const { loginId, email, password, otpValue, redirectUrl, captchaValue } = this.state;
		
		if (captchaValue.length === 0) {

			this.setState({
				displayMessageOnValidateOtpForm: true,
				textMessageOnValidateOtpForm: 'Mohon centang checkbox pada captcha. ',
				messageType: 'ERROR'
			});
			
			return false;
		}
		
		const dataForVerify = {
			hp_email: email,
			pwd: password,
			fullname: loginId,
			otp: otpValue
		};
		
		const [err, response] = await to(dispatch(new users.userOtpValidate(cookies.get('user.token'), dataForVerify)));
		
		if (err) {
			
			this.setState({
				displayMessageOnValidateOtpForm: true,
				textMessageOnValidateOtpForm: 'Kode OTP tidak valid.',
				messageType: 'ERROR'
			});
   
			return err;
		}
		
		const [errorUserLogin, responseUserLogin] = await to(dispatch(new users.userLogin(cookies.get('user.token'), email, password)));
		
		if (errorUserLogin) {
			console.log('error on user login');
			return false;
		}
		
		// Set the cookie for the page.
		setUserCookie(cookies, responseUserLogin.token);
		history.push(redirectUrl || '/');
  
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
				validPassword: !validator.isEmpty(value) && validator.isLength(value, { min: 6, max: undefined })
			});
		}
		
	}
 
 
	handlePick(current) {
		this.setState({ current });
	}
	
	renderHelmet = () => {
  
		return (
			<Helmet>
				<script
					src={process.env.GOOGLE_CAPTCHA_END_POINT}
					async
					defer
				/>
			</Helmet>
		);
	};
	
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
			placeholder: 'Nama Lengkap'
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
			placeholder: 'Nomor Handphone /  Email'
		};
		
		if (email.length > 0 && validEmailOrMobile === false) {
			inputMobileEmailAttribute.error = true;
			inputMobileEmailAttribute.hint = 'Format Email/Nomor Handphone tidak sesuai. Silahkan cek kembali';
		}
        
		let iconRightPasswordContent = 'ico_eye.svg';
		if (visiblePassword === true) {
			iconRightPasswordContent = 'ico_eye-off.svg';
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
			placeholder: 'Password minimal 6 karakter',
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
			color: 'primary',
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
				<div className='margin--medium'>Daftar Dengan</div>
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
				<div className='margin--medium text-left'>
					<p><small>Dengan membuka Akun, Anda telah membaca, mengerti dan menyetujui <Link to='/'>Syarat & Ketentuan dan Kebijakan Privasi</Link> MatahariMall.com</small></p>
				</div>
				<div className='margin--medium'>
					<Button {...buttonRegisterAttribute}>Daftar</Button>
				</div>
			</div>
		);
	}
	
	renderValidateOtpView() {
		
		const {
			disableOtpButton,
			otpValue,
			otpButtonText,
            displayMessageOnValidateOtpForm,
			textMessageOnValidateOtpForm,
            messageType,
			isButtonResendOtpLoading
		} = this.state;
		
		const { isLoading } = this.props.users;
  
		const buttonPropertyResendOTP = {
			color: 'secondary',
			size: 'large',
			onClick: (e) => this.onSendOtp()
		};
		
		if ((isButtonResendOtpLoading && isLoading) === true) {
			buttonPropertyResendOTP.loading = true;
		}
  
		if (disableOtpButton === true) {
			buttonPropertyResendOTP.disabled = true;
		}
		
		const buttonPropertyVerify = {
			color: 'secondary',
			size: 'large',
			onClick: (e) => this.onVerifyOtp(),
			disabled: true
		};
		
		if (otpValue.length === 6 && !isLoading) {
			buttonPropertyVerify.disabled = false;
		}
		
		if ((!isButtonResendOtpLoading && isLoading) === true) {
			buttonPropertyVerify.loading = true;
		}
		
		const enterOtpVerification = {
			value: otpValue,
			label: 'Masukan kode verifikasi',
			flat: true,
			placeholder: 'Masukan kode verifikasi',
			onChange: (event) => { this.setState({ otpValue: event.target.value }); }
		};
		
		return (
			<div>
				{this.renderHelmet()}
				<div>
					<p>Kami telah mengirimkan kode verifikasi ke no XXXXXXX</p>
					<p>Silahkan masukan kode verifikasi</p>
					
					{ displayMessageOnValidateOtpForm && (
						<Notification color={(messageType === 'SUCCESS') ? 'green' : 'red'} show disableClose>
							<span>{ textMessageOnValidateOtpForm }</span>
						</Notification>
					)}
					<Input {...enterOtpVerification} />
				</div>
				<p>
					<Button {...buttonPropertyResendOTP}>
						{otpButtonText}
					</Button>
				</p>
				
				<p>
					<Recaptcha
						sitekey={`${process.env.GOOGLE_CAPTCHA_SITE_KEY}`}
						size='compact'
						render='explicit'
						verifyCallback={
							(response) => {
								if (response.length !== 0) {
									this.setState(
										{
											captchaValue: response
										}
									);
								}
							}
						}
					/>
				</p>
				
				<p>
					<Button {...buttonPropertyVerify}>
						Verifikasi
					</Button>
				</p>
				
			</div>
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
		const { current } = this.state;
		const HeaderPage = {
			left: (
				<Link to='/'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Daftar',
			right: null,
			shadow: false
		};
		
		const tabProperty = {
			current: this.state.current,
			variants: DUMMY_TAB,
			onPick: (e) => this.handlePick(e)
		};
		
		const register = (current === 'login');
		
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
			<div className='full-height' style={this.props.style}>
				<Page>
					{renderIf(register)(
						<Redirect to='/login' />
					)}
					<Tabs {...tabProperty} />
					<div className={styles.container}>
						{View}
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
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
const doAfterAnonymous = props => {
	console.log('code here if you need anon token or token');
};

export default withCookies(
	connect(mapStateToProps)(Shared(Register, doAfterAnonymous))
);
