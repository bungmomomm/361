import React, { Component } from 'react';

// component load
import { Modal } from '@/components';

export default class Vt3dsModalBox extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.onClose = this.onClose.bind(this);
	}
    
	onClose(closed) {
		this.props.onClose(closed);
	}

	render() {
		const modal = true;
		return (
			<Modal size='medium' shown={this.props.shown} onClose={this.onClose} modal={modal}>
				<Modal.Body>
					<iframe title='vtToken' src={this.props.src} frameBorder={0} height={470} width={470} />
				</Modal.Body>				
			</Modal>
		);
	}
}
