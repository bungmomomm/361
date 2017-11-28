import React, { Component } from 'react';

// component load
import { Level, Button, Modal, Icon } from '@/components';
import { renderIf } from '@/utils';

export default class PaymentErrorModalbox extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.onClose = this.onClose.bind(this);
	}
    
	onClose(closed) {
		this.props.onClose(closed);
		document.getElementById('pay-now').disabled = true;
	}

	render() {
		let message = (
			<strong>
				Pembayaran Anda tidak <br />
				berhasil coba lagi atau gunakan <br />
				metode pembayaran lainnya <br />
			</strong>
		);
		if (this.props.paymentErrorMessage && this.props.paymentErrorMessage !== '') {
			message = (
				<strong>{this.props.paymentErrorMessage}</strong>
			);
		}
		return (
			<Modal size='small' shown={this.props.shown} onClose={this.onClose} >
				<Modal.Header>
					<Icon name='times' custom='error' />
				</Modal.Header>
				<Modal.Body>
					<p>
						{message}
					</p>
				</Modal.Body>
				{
					renderIf(this.props.isConfirm)(
						<Modal.Footer>
							<Level padded>
								<Level.Item>
									<Button block content='close' color='red' onClick={e => this.props.okeoce('close')} />
								</Level.Item>
								<Level.Item>
									<Button block content='ok' color='green' onClick={e => this.props.okeoce('ok')} />
								</Level.Item>
							</Level>
						</Modal.Footer>
					)
				}
			</Modal>
		);
	}
};
