import React, { Component } from 'react';
// import Recaptcha from 'react-recaptcha';
import { renderIf } from '@/utils';
// component load
import { Modal, Input, Button, InputGroup } from '@/components';

export default class VerifikasiNoHandponeModalbox extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			shown: this.props.shown || false,
			buttonSubmitPhone: false,
			alreadySubmitPhone: false,
			enableButtonOtp: true,
			contentOtp: 'Resend OTP',
			phone: null,
			otp: null,
			buttonResendOtp: false,
		};
		this.hideModal = this.hideModal.bind(this);
		this.onSubmitPhoneNumber = this.onSubmitPhoneNumber.bind(this);
		this.onSubmitOtp = this.onSubmitOtp.bind(this);
		this.onResendOtp = this.onResendOtp.bind(this);
		this.onVerificationClose = this.onVerificationClose.bind(this);
		this.validatePhone = this.validatePhone.bind(this);
		this.validateOtp = this.validateOtp.bind(this);
		this.setIntervalButton = this.setIntervalButton.bind(this);
	}

	onSubmitPhoneNumber(event) {
		this.setState({
			alreadySubmitPhone: true,
			buttonResendOtp: true,
		});
		this.props.onSubmitPhoneNumber(this.state.phone);
		this.setIntervalButton();
	}
	onSubmitOtp(event) {
		this.props.onSubmitOtp(this.state.otp);
	}
	
	onResendOtp(event) {
		this.setIntervalButton();
		this.props.onResendOtp(event);
	}
	
	onVerificationClose(event) {
		this.props.onVerificationClose(event);
	}

	setIntervalButton() {
		clearInterval(this.interval);
		let intervalTime = 60;
		this.interval = null;
		this.interval = setInterval(() => {
			this.setState({
				contentOtp: `Resend OTP dalam waktu ${intervalTime}`
			});
			if (intervalTime > 0) {
				this.setState({
					enableButtonOtp: false
				});
			}
			if (intervalTime === 0) {
				clearInterval(this.interval);
				this.setState({
					enableButtonOtp: true,
					contentOtp: 'Resend OTP'
				});
			}
			intervalTime--;
		}, 1000);
	}

	validatePhone(event) {
		const value = event.target.value;
		if (value.length > 6 && value.length < 14) {
			this.setState({
				buttonSubmitPhone: true,
				phone: value,
			});
		}
	}

	validateOtp(event) {
		const value = event.target.value;
		if (value.length === 6) {
			this.setState({
				buttonSubmitOtp: true,
				otp: value
			});
		}
	}

	hideModal() {
		this.props.onVerificationClose({});
	}

	render() {
		return (
			this.props.otp.valid ? null : 
			<Modal size='small' shown={this.props.shown} onClose={this.onVerificationClose} >
				<Modal.Header>
					<p>Verifikasi No Handphone</p>
					<p className='font-grey'><small>Mohon masukan no Handphone anda untuk verifikasi data</small></p>
				</Modal.Header>
				<Modal.Body>
					<form>
						{
							!this.state.alreadySubmitPhone ? 
								<div>
									<InputGroup>
										<Input disabled={this.state.alreadySubmitPhone} name='phone' number placeholder='No Handphone anda (contoh: 08219823982189)' onChange={this.validatePhone} />
									</InputGroup>
									<InputGroup>
										{/* { renderIf(process.env.GOOGLE_CAPTCHA_SITE_KEY)( */}
										{/*<Recaptcha*/}
											{/*sitekey={process.env.GOOGLE_CAPTCHA_SITE_KEY}*/}
										{/*/>*/}
										{/* ) } */}
									</InputGroup>
								</div>
							:
								<InputGroup>
									<Input name='otp' value={this.state.otp} number placeholder='OTP dari no handphone anda (contoh: 123123)' onChange={this.validateOtp} message={this.props.otp.message} color={this.props.otp.message ? 'red' : null} />
								</InputGroup>
						}
					</form>
				</Modal.Body>
				<Modal.Footer>
					<InputGroup>
						{ renderIf(this.state.buttonSubmitPhone && !this.state.alreadySubmitPhone)(
							<Button type='button' content='Kirim' block color='dark' onClick={this.onSubmitPhoneNumber} />
						) }
						{ renderIf(this.state.buttonSubmitOtp)(
							<div>
								<Button type='button' content='Konfirmasi' block color='dark' onClick={this.onSubmitOtp} />
							</div>
						) }
					</InputGroup>
					<InputGroup>
						{ renderIf(this.state.buttonResendOtp)(
							<div>
								<Button type='button' disabled={!this.state.enableButtonOtp} content={this.state.contentOtp} color='dark' onClick={this.onResendOtp} />
							</div>
						) }
					</InputGroup>
					<InputGroup>
						<Button onClick={this.hideModal} type='button' size='medium' content='Nanti aja' block className='font-orange' />
					</InputGroup>
				</Modal.Footer>
			</Modal>
		);
	}
};
