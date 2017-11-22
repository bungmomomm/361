import React, { Component } from 'react';

// component load
import { Modal } from 'mm-ui';

export default class Vt3dsModalBox extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}
    
	render() {
		return (
			<Modal size='small' className='text-center' show={this.props.show} onCloseRequest={(e) => this.props.onClose(e)} >
				<Modal.Body>
					<iframe title='vtToken' src={this.props.src} frameBorder={0} height={300} width='100%' />
				</Modal.Body>				
			</Modal>
		);
	}
}
