import React, { Component } from 'react';

// component load
import { Modal, Icon } from '@/components';

export default class PaymentErrorModalbox extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.onClose = this.onClose.bind(this);
	}
    
	onClose(closed) {
		this.props.onClose(closed);
	}

	render() {
		return (
			<Modal size='small' shown={this.props.shown} onClose={this.onClose} >
				<Modal.Header>
					<Icon name='times' custom='error' />
				</Modal.Header>
				<Modal.Body>
					<p>
						<strong>
						Pembayaran Anda tidak <br />
						berhasil coba lagi atau gunakan <br />
						metode pembayaran lainnya <br />
						</strong>
					</p>
				</Modal.Body>
			</Modal>
		);
	}
};
