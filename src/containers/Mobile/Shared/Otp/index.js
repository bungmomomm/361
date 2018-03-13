import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import _ from 'lodash';
import util from 'util';
import { to } from 'await-to-js';
import validator from 'validator';
import Recaptcha from 'react-recaptcha';

import { Header, Page, Button, Svg, Input, Notification, Spinner } from '@/components/mobile';

import { actions as userActions } from '@/state/v4/User';

import CONST from '@/constants';

import styles from './otp.scss';


class Otp extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.userToken = this.props.cookies.get(CONST.COOKIE_USER_TOKEN);

		this.state = {
			showNotif: false,
			statusNotif: '',
			enableResend: false,
			phoneEmail: props.phoneEmail || '',
			otp: '',
			otpCount: 0,
			inputValue: null,
			inputHint: '',
			captchaValid: false,
			validForm: false,
			disabledInput: false,
			resendButtonMessage: ''
		};

		this.HP_EMAIL_FIELD = CONST.USER_PROFILE_FIELD.hpEmail;
		this.OTP_FIELD = CONST.USER_PROFILE_FIELD.otp;
		this.loadingView = <Spinner />;
		this.recaptchaInstance = null;
	}

	componentWillMount = async () => {
		const { dispatch, phoneEmail } = this.props;
		const { otpCount } = this.state;

		if (phoneEmail !== undefined && phoneEmail !== '') {
			const [err, response] = await to(dispatch(userActions.userOtp(this.userToken, phoneEmail)));
			if (err) {
				console.log('err mount', err);

				this.setState({
					showNotif: true,
					statusNotif: 'failed'
				});
			} else if (response) {
				console.log('response mount', response);

				this.setState({
					otpCount: otpCount + 1
				});

				const countdown = _.chain(response).get('countdown').value() || 60;
				this.countdownTimer(countdown);
			}
		}

		this.setTimeoutNotif(5000);
	}

	setTimeoutNotif(n) {
		window.setTimeout(() => {
			this.setState({
				showNotif: false,
				statusNotif: ''
			});
		}, n);
	}

	resendOtp = async () => {
		const { dispatch, phoneEmail } = this.props;
		const { otpCount } = this.state;

		if (phoneEmail !== undefined && phoneEmail !== '') {
			const [err, response] = await to(dispatch(userActions.userOtp(this.userToken, phoneEmail)));
			if (err) {
				console.log('err resend', err);

				this.setState({
					showNotif: true,
					statusNotif: 'failed',
					inputValue: ''
				});
			} else if (response) {
				console.log('response resend', response);

				this.setState({
					otpCount: otpCount + 1,
					validForm: true,
					showNotif: true,
					statusNotif: 'success',
					inputValue: ''
				});

				const countdown = _.chain(response).get('countdown').value() || 60;
				this.countdownTimer(countdown);
			}

			if (this.recaptchaInstance !== null) {
				this.recaptchaInstance.reset();
			}
		}

		if (otpCount > 2) {
			this.setState({
				showVerifyButton: true,
				autoSubmit: false
			});
		}

		this.setTimeoutNotif(5000);
	}

	countdownTimer = async (number) => {
		const counterDown = () => {
			if (number > 0) {
				number -= 1;
				this.setState({
					enableResend: false,
					resendButtonMessage: `Kirim Ulang Kode OTP Dalam ${number} detik`
				});
			}
		};
		
		const doCounter = setInterval(() => {
			counterDown();
			if (number === 0) {
				this.setState({
					enableResend: true,
					resendButtonMessage: 'Kirim Ulang Kode OTP'
				});
				clearInterval(doCounter);
			}
		}, 1000);
	}
	
	inputHandler(e) {
		const value = util.format('%s', e.target.value);

		this.setState({
			otp: value
		});

		let validForm = false;
		let inputHint = '';
		if (validator.isNumeric(value) && validator.isLength(value, { min: 6 })) {
			if (this.recaptchaInstance !== null) {
				this.recaptchaInstance.execute();
			}
			validForm = true;
		} else {
			inputHint = value.length > 0 && validForm === false ? 'Format Kode OTP tidak sesuai. Silahkan cek kembali' : '';
		}

		this.setState({
			validForm,
			inputHint
		});
	}

	validateOtp = async (e) => {
		console.log('captcha response', e);
		const { dispatch, onSuccess } = this.props;
		const { phoneEmail, otp } = this.state;

		const otpData = {
			action: 'edit',
			[this.HP_EMAIL_FIELD]: phoneEmail,
			[this.OTP_FIELD]: otp
		};

		this.setState({ disabledInput: true });
		const [err, response] = await to(dispatch(userActions.userOtpValidate(this.userToken, otpData)));
		if (err) {
			console.log('err validate', err);

			this.setState({
				validForm: false,
				disabledInput: false,
				inputHint: err.error_message || 'Invalid OTP'
			});
		} else if (response) {
			console.log('response validate', response);

			onSuccess();
		}

		if (this.recaptchaInstance !== null) {
			this.recaptchaInstance.reset();
		}
	}

	renderHeader() {
		const { onClickBack, headerTitle } = this.props;
		const HeaderPage = {
			left: (
				<Button onClick={onClickBack}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: headerTitle || 'Verifikasi Nomor HP',
			right: null
		};

		return <Header.Modal {...HeaderPage} />;
	}

	renderNotification() {
		const { showNotif, statusNotif } = this.state;

		let color = null;
		let message = null;
		switch (statusNotif) {
		case 'success':
			color = 'green';
			message = 'Pengiriman kode verifikasi sukses!';
			break;
		default:
			color = 'pink';
			message = 'Pengiriman kode verifikasi gagal, silakan coba lagi.';
			break;
		}

		return (
			<Notification color={color} show={showNotif} disableClose>
				<span>{message}</span>
			</Notification>
		);
	}

	renderOtpForm() {
		const { inputHint, validForm, disabledInput } = this.state;
		return (
			<div className='margin--medium-v text-center'>
				<Input
					error={!validForm}
					hint={inputHint}
					partitioned 
					maxLength={6}
					disabled={disabledInput}
					onChange={(e) => this.inputHandler(e)}
				/>
			</div>
		);
	}

	renderRecaptcha() {
		return (
			<div className='margin--small-v'>
				<Recaptcha
					size='invisible'
					ref={e => { this.recaptchaInstance = e; }}
					sitekey={process.env.GOOGLE_CAPTCHA_SITE_KEY}
					verifyCallback={(e) => this.validateOtp(e)}
				/>
			</div>
		);
	}

	renderResendButton() {
		const { isLoading } = this.props;
		const { enableResend, resendButtonMessage } = this.state;

		return (
			<div className='margin--medium-v'>
				<Button
					color='secondary'
					size='large'
					outline
					loading={isLoading}
					disabled={!enableResend}
					onClick={() => this.resendOtp()}
				>
					{resendButtonMessage}
				</Button>
			</div>
		);
	}

	render() {
		const { phoneEmail } = this.state;

		return (
			<div className='full-height' style={this.props.style}>
				<Page>
					<div className={styles.container}>
						<div className='margin--medium-v'>Kami telah mengirimkan kode verifikasi ke no {phoneEmail}. Silakan masukan kode verifikasi.</div>
						{this.renderNotification()}
						{this.renderOtpForm()}
						{this.renderRecaptcha()}
						{this.renderResendButton()}
					</div>
				</Page>
				{this.renderHeader()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		...state,
		isLoading: state.users.isLoading
	};
};

export default withCookies(connect(mapStateToProps)(Otp));