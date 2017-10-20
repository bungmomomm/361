import React, { Component } from 'react';

// component load
import { Modal, Image } from '@/components';

export default class OvoErrorPaymentModal extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}
	render() {
		return (
			<Modal size='small' shown>
				<Modal.Header>
					<Image height={60} src='times-red-button.png' />
				</Modal.Header>
				<Modal.Body>
					<p>Pembayaran Anda belum berhasil coba lagi atau gunakan metode pembayaran lainnya</p>
				</Modal.Body>
			</Modal>
		);
	}
}
