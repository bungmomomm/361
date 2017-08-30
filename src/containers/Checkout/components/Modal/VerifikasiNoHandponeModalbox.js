import React, { Component } from 'react';
import Recaptcha from 'react-recaptcha';
import { renderIf } from '@/utils';
// component load
import { Modal, Input, Button, InputGroup } from '@/components';

export default class VerifikasiNoHandponeModalbox extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			shown: this.props.shown || false
		};
		this.hideModal = this.hideModal.bind(this);
		this.onSubmitPhoneNumber = this.onSubmitPhoneNumber.bind(this);
		this.onSubmitOtp = this.onSubmitOtp.bind(this);
		this.onResendOtp = this.onResendOtp.bind(this);
		this.onVerificationClose = this.onVerificationClose.bind(this);
	}

	onSubmitPhoneNumber(event) {
		this.props.onSubmitPhoneNumber(event);
	}
	onSubmitOtp(event) {
		this.props.onSubmitOtp(event);
	}
	
	onResendOtp(event) {
		this.props.onResendOtp(event);
	}
	
	onVerificationClose(event) {
		this.props.onVerificationClose(event);
	}
	hideModal() {
		this.props.onVerificationClose({});
	}

	render() {
		return (
			<Modal size='small' shown={this.props.shown}>
				<Modal.Header>
					<p>Verifikasi No Handphone</p>
					<p className='font-grey'><small>Mohon masukan no Handphone anda untuk verifikasi data</small></p>
				</Modal.Header>
				<Modal.Body>
					<form>
						<InputGroup>
							<Input number placeholder='No Handphone anda (contoh: 08219823982189)' />
						</InputGroup>
						<InputGroup>
							<Recaptcha
								sitekey='xxxxxxxxxxxxxxxxxxxx'
							/>
						</InputGroup>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<InputGroup>
						{ renderIf(this.props.state === 0)(
							<Button type='button' content='Kirim' block color='dark' onClick={this.onSubmitPhoneNumber} />
						) }
						{ renderIf(this.props.state === 0)(
							<Button type='button' content='Konfirmasi' block color='dark' onClick={this.onSubmitOtp} />
						) }
						{ renderIf(this.props.state === 0)(
							<Button type='button' content='Resend' block color='dark' onClick={this.onResendOtp} />
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
