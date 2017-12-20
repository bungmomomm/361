import React, { Component } from 'react';

// component load
import { Group, Button, Modal, Icon } from 'mm-ui';
import { T } from '@/data/translations';

export default class ModalErrorPayment extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.message = (
			<strong dangerouslySetInnerHTML={{ __html: T.checkout.PAYMENT_ERROR }} />
		);
	}
	render() {
		if (this.props.paymentErrorMessage && this.props.paymentErrorMessage !== '') {
			this.message = (
				<strong>{this.props.paymentErrorMessage}</strong>
			);
		}
		return (
			<Modal size='small' className='text-center' show={this.props.show} onCloseRequest={(e) => this.props.onClose(e)} >
				<Modal.Header>
					<Icon name='times' custom='error' />
				</Modal.Header>
				<Modal.Body>
					<p>{this.message}</p>
				</Modal.Body>
				{
					this.props.isConfirm && (
						<Modal.Footer>
							<Group grouped className='text-center'>
								<div style={{ width: '100%' }}><Button block color='red' onClick={e => this.props.okeoce('close')}>close</Button></div>
								<div style={{ width: '100%' }}><Button block color='green' onClick={e => this.props.okeoce('ok')}>process</Button></div>
							</Group>
						</Modal.Footer>
					)
				}
			</Modal>
		);
	}
};
