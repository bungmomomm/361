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
					<Icon name='check' custom='success' />
				</Modal.Header>
				<Modal.Body>
					<p>
						<strong>
						No Handphone anda <br />
						Berhasil di Verifikasi
						</strong>
					</p>
				</Modal.Body>
			</Modal>
		);
	}
};
