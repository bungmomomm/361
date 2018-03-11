import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import _ from 'lodash';
import util from 'util';
import { to } from 'await-to-js';
import validator from 'validator';

import { Header, Page, Button, Svg, Input, Notification, Spinner } from '@/components/mobile';

import { actions as userActions } from '@/state/v4/User';

import CONST from '@/constants';
import { renderIf } from '@/utils';

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
			showVerifyButton: false,
			phoneEmail: props.phoneEmail || '',
			otpCount: 0,
			inputHint: '',
			validForm: false,
			disabledInput: false,
			resendButtonMessage: ''
		};

		this.HP_EMAIL_FIELD = CONST.USER_PROFILE_FIELD.hpEmail;
		this.OTP_FIELD = CONST.USER_PROFILE_FIELD.otp;
		this.loadingView = <Spinner />;
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
					statusNotif: 'failed'
				});
			} else if (response) {
				console.log('response resend', response);

				this.setState({
					otpCount: otpCount + 1,
					validForm: true,
					showNotif: true,
					statusNotif: 'success'
				});

				const countdown = _.chain(response).get('countdown').value() || 60;
				this.countdownTimer(countdown);
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
		const { phoneEmail } = this.state;
		const value = util.format('%s', e.target.value);

		let validForm = false;
		if (validator.isNumeric(value) && validator.isLength(value, { min: 6 })) {
			validForm = true;
		}

		let inputHint = '';
		if (validForm) {
			this.validateOtp({
				[this.HP_EMAIL_FIELD]: phoneEmail,
				[this.OTP_FIELD]: value
			});
		} else {
			inputHint = value.length > 0 && validForm === false ? 'Format Kode OTP tidak sesuai. Silahkan cek kembali' : '';
		}

		this.setState({
			validForm,
			inputHint
		});
	}

	validateOtp = async (data) => {
		const { dispatch, onSuccess } = this.props;

		this.setState({ disabledInput: true });
		const [err, response] = await to(dispatch(userActions.userOtpValidate(this.userToken, data, 'edit')));
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
					value={null}
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

	renderVerifyButton() {
		const { showVerifyButton } = this.state;
		renderIf(showVerifyButton)(
			<div className='margin--medium-v'>
				<Button
					color='primary'
					size='large'
					onClick={e => this.onClickVerify(e)}
				>
					VERIFIKASI
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
						{this.renderResendButton()}
						{this.renderVerifyButton()}
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