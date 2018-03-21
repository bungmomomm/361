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
			inputValue: '',
			inputHint: '',
			validForm: false,
			disabledInput: false,
			resendButtonMessage: '',
			isLoading: false
		};

		this.HP_EMAIL_FIELD = CONST.USER_PROFILE_FIELD.hpEmail;
		this.OTP_FIELD = CONST.USER_PROFILE_FIELD.otp;
		this.loadingView = <Spinner />;
		this.recaptchaInstance = null;
		this.resendIcon = <Svg src='ico_resend_otp.svg' />;
	}

	componentWillMount = async () => {
		const { dispatch, phoneEmail } = this.props;

		this.setState({ isLoading: true });

		if (phoneEmail !== undefined && phoneEmail !== '') {
			const [err, response] = await to(dispatch(userActions.userOtp(this.userToken, phoneEmail)));
			if (err) {
				this.setState({
					showNotif: true,
					statusNotif: 'failed',
					isLoading: false
				});
			} else if (response) {
				this.setState({ isLoading: false });

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

		this.setState({ isLoading: true });

		if (phoneEmail !== undefined && phoneEmail !== '') {
			const [err, response] = await to(dispatch(userActions.userOtp(this.userToken, phoneEmail)));
			if (err) {
				this.setState({
					showNotif: true,
					statusNotif: 'failed',
					inputValue: '',
					isLoading: false
				});
			} else if (response) {
				this.setState({
					validForm: true,
					showNotif: true,
					statusNotif: 'success',
					inputValue: '',
					isLoading: false
				});

				const countdown = _.chain(response).get('countdown').value() || 60;
				this.countdownTimer(countdown);
			}

			if (this.recaptchaInstance !== null) {
				this.recaptchaInstance.reset();
			}
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

		let validForm = false;
		if (validator.isNumeric(value) && validator.isLength(value, { min: 6 })) {
			validForm = true;
			this.validateOtp(value);
		}
			
		const inputHint = value.length > 0 && validForm === false ? 'Format Kode OTP tidak sesuai.' : '';
		
		this.setState({
			inputValue: value,
			validForm,
			inputHint
		});
	}

	validateOtp = async (data) => {
		const { dispatch, onSuccess, type } = this.props;
		const { phoneEmail } = this.state;

		const otpData = {
			action: type,
			[this.HP_EMAIL_FIELD]: phoneEmail,
			[this.OTP_FIELD]: data
		};

		this.setState({ disabledInput: true });
		const [err, response] = await to(dispatch(userActions.userOtpValidate(this.userToken, otpData)));
		if (err) {
			this.setState({
				validForm: false,
				disabledInput: false,
				inputHint: err.error_message || 'Invalid OTP'
			});
		} else if (response) {
			onSuccess(response);
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
		const { inputHint, validForm, inputValue, disabledInput } = this.state;
		return (
			<div className='margin--medium-v text-center'>
				<Input
					value={inputValue}
					error={!validForm && inputValue !== ''}
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
					verifyCallback={(e) => this.resendOtp(e)}
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
					onClick={() => {
						if (this.recaptchaInstance !== null) {
							this.recaptchaInstance.execute();
						}
						this.setState({ inputHint: '' });
					}}
				>
					{enableResend ? this.resendIcon : ''}{resendButtonMessage}
				</Button>
			</div>
		);
	}

	render() {
		const { phoneEmail, isLoading } = this.state;

		return (
			<div className='full-height' style={this.props.style}>
				<Page>
					<div className={styles.container}>
						<div className='margin--medium-v'>Kami telah mengirimkan kode verifikasi ke no {phoneEmail}. Silakan masukan kode verifikasi.</div>
						{this.renderNotification()}
						{this.renderOtpForm()}
						{this.renderRecaptcha()}
						{isLoading ? this.loadingView : this.renderResendButton()}
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

Otp.defaultProps = {
	type: 'edit'
};

export default withCookies(connect(mapStateToProps)(Otp));