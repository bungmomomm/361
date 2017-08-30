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
		this.onVerificationClose = this.onVerificationClose.bind(this);
	}
	
	onVerificationClose(event) {
		this.props.onVerificationClose(event);
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
							<Input number placeholder='No Handphone anda (contoh: 08219823982189)' onChange={(event) => this.props.onChange(event)} />
						</InputGroup>
						<InputGroup>
							<Recaptcha
								sitekey='xxxxxxxxxxxxxxxxxxxx'
								verifyCallback={(event) => this.props.onVerify}
							/>
						</InputGroup>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<InputGroup>
						{ renderIf(this.props.state === 0)(
							<Button type='button' content='Kirim' block color='dark' onClick={(event) => this.props.onSubmitPhoneNumber(event)} />
						) }
						{ renderIf(this.props.state === 1)(
							<Button type='button' content='Konfirmasi' block color='dark' onClick={(event) => this.props.onSubmitOtp(event)} />
						) }
						{ renderIf(this.props.state === 1)(
							<Button type='button' content='Resend' block color='dark' onClick={(event) => this.props.onResendOtp(event)} />
						) }
					</InputGroup>
					<InputGroup>
						<Button onClick={this.onVerificationClose} type='button' size='medium' content='Nanti aja' block className='font-orange' />
					</InputGroup>
				</Modal.Footer>
			</Modal>
		);
	}
};
