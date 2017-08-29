import React, { Component } from 'react';

// component load
import { Modal } from '@/components';

export default class EcashModalBox extends Component {
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
			<Modal size='medium' shown={this.props.shown} onClose={this.onClose} >
				<Modal.Header>
					{this.props.title}
				</Modal.Header>
				<Modal.Body>
					<iframe title={this.props.title} src={this.props.src} frameBorder={0} height={300} width={470} />
				</Modal.Body>
				<Modal.Footer>
					{this.props.footer}
				</Modal.Footer>				
			</Modal>
		);
	}
}
