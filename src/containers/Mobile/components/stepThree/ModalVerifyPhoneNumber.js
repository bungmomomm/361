import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import React, { Component } from 'react';
import Recaptcha from 'react-recaptcha';
import { 
	Modal,
	Input, 
	Button
} from 'mm-ui';
import { T } from '@/data/translations';
import { componentState } from '@/utils';
import { actions as CouponActions } from '@/state/Coupon';

class ModalVerifyPhoneNumber extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			validOtp: false,
			validPhoneNumber: false,
			verifiedRecaptcha: false,
			phoneNumber: '',
			otp: '',
			resendOtpCountDown: this.defaultOtpCountDown,
			showErrorOtp: false,
		};
		this.interval = null;
		this.defaultOtpCountDown = 60;
	}

	onSubmitPhoneNumber() {
		if (this.isValidSubmitPhoneNumber()) {
			const { dispatch } = this.props;
			dispatch(new CouponActions.resendOtp(this.props.cookies.get('user.token'), this.state.phoneNumber));
			this.setState({
				isModalOtpActive: true
			});
			this.resetContentResendOtp();
		}
	}

	onSubmitOtp() {
		if (this.isValidSubmitOtp()) {
			const { dispatch } = this.props;
			dispatch(
				new CouponActions.verifyOtp(
					this.props.cookies.get('user.token'),
					this.state.phoneNumber,
					this.state.otp,
					this.props,
				)
			).then(() => {
				if (!this.props.coupon.otp.valid) {
					this.setState({
						showErrorOtp: true
					});
				}
			});
		}
	}

	onResendOtp() {
		if (this.isValidSubmitPhoneNumber() && this.isValidResendOtp()) {
			const { dispatch } = this.props;
			dispatch(new CouponActions.resendOtp(this.props.cookies.get('user.token'), this.state.phoneNumber));
			this.setState({
				isModalOtpActive: true
			});
			this.resetContentResendOtp();
		}
	}

	onChangePhoneNumber(e) {
		const value = e.target.value;
		if (value.length > 6 && value.length < 14) {
			this.setState({
				validPhoneNumber: true
			});
		} else {
			this.setState({
				validPhoneNumber: false
			});
		}

		this.setState({
			phoneNumber: value,
		});
	}

	onChangeOtp(e) {
		const value = e.target.value;
		if (value.length === 6) {
			this.setState({
				validOtp: true
			});
		} else {
			this.setState({
				validOtp: false
			});
		}

		this.setState({
			otp: value,
			showErrorOtp: false,
		});
	}

	verifyCallback() {
		this.setState({
			verifiedRecaptcha: true
		});
	}

	isValidSubmitOtp() {
		return this.state.validOtp;
	}

	isValidSubmitPhoneNumber() {
		return this.state.validPhoneNumber && this.state.verifiedRecaptcha;
	}

	isValidResendOtp() {
		return this.state.resendOtpCountDown <= 0;
	}

	buttonConfirmationState() {
		if (this.isValidSubmitPhoneNumber()) {
			return componentState.button.active;
		}

		return componentState.button.disabled;
	}

	buttonSubmitOtpState() {
		if (this.isValidSubmitOtp()) {
			return componentState.button.active;
		}

		return componentState.button.disabled;
	}

	buttonResendOtpState() {
		if (this.isValidResendOtp()) {
			return componentState.button.active;
		}

		return componentState.button.disabled;
	}

	resetContentResendOtp() {
		clearInterval(this.interval);
		this.setState({
			resendOtpCountDown: this.defaultOtpCountDown
		});
		this.interval = null;
		this.interval = setInterval(() => {
			if (this.state.resendOtpCountDown > 0) {
				this.setState({
					resendOtpCountDown: this.state.resendOtpCountDown - 1
				});
			} else {
				clearInterval(this.interval);
			}
		}, 1000);
	}

	closeModal(e) {
		clearInterval(this.interval);
		this.props.handleClose(e);
	}
	
	render() {
		return (
			<Modal
				show
				size='small'
				className='modalVerifyPhoneNumber'
				onCloseRequest={(e) => this.closeModal(e)}
				style={{ padding: '25px 15px', width: '90%' }}
			>
				<Modal.Header>
					<div>{T.checkout.PHONE_NUMBER_VERIFICATION}</div>
					<small>{T.checkout.PLEASE_ADD_PHONE_NUMBER}</small>
				</Modal.Header>
				<Modal.Body>
					{
						!this.state.isModalOtpActive && (
							<Input 
								placeholder='No handphone anda (contoh: 08123456789)'
								name='phoneNumber'
								type='text'
								value={this.state.phoneNumber}
								onChange={(e) => this.onChangePhoneNumber(e)}
							/>
						)
					}
					{
						process.env.GOOGLE_CAPTCHA_SITE_KEY && !this.state.isModalOtpActive && (
							<Recaptcha
								size='small'
								style={{ width: '100px' }}
								sitekey={process.env.GOOGLE_CAPTCHA_SITE_KEY}
								verifyCallback={() => this.verifyCallback()}
							/>
						) 
					}
					{
						this.state.isModalOtpActive && (
							<Input 
								placeholder='OTP dari no handphone anda (contoh: 123123)'
								name='otp'
								type='text'
								value={this.state.otp}
								onChange={(e) => this.onChangeOtp(e)}
								color={this.props.coupon.otp.message !== null && this.state.showErrorOtp ? 'red' : 'dark'}
								label={this.props.coupon.otp.message !== null && this.state.showErrorOtp ? this.props.coupon.otp.message : ''}
							/>
						)
					}
				</Modal.Body>
				<Modal.Footer>
					{
						!this.state.isModalOtpActive && (
							<Button 
								block
								type='button'
								size='medium'
								color='dark'
								state={this.buttonConfirmationState()}
								onClick={() => this.onSubmitPhoneNumber()}
							>
								Konfirmasi
							</Button>
						)
					}
					{
						this.state.isModalOtpActive && (
							<div>
								<Button 
									block
									type='button'
									size='medium'
									color='dark'
									state={this.buttonResendOtpState()}
									onClick={() => this.onSubmitPhoneNumber()}
								>
									Resend OTP ({this.state.resendOtpCountDown})
								</Button>
								<Button 
									block
									type='button'
									color='dark'
									state={this.buttonSubmitOtpState()}
									onClick={() => this.onSubmitOtp()}
								>
									Submit OTP
								</Button>
							</div>
						)
					}
					<Button 
						block
						type='button'
						size='medium'
						className='font-orange'
						onClick={(e) => this.closeModal(e)}
					>
						Nanti aja
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		coupon: state.coupon,
		soNumber: state.cart.soNumber
	};
};

export default withCookies(connect(mapStateToProps)(ModalVerifyPhoneNumber));

