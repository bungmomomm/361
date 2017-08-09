import React, { Component } from 'react';
import Recaptcha from 'react-recaptcha';

// component load
import { Modal, Input, Button, InputGroup } from '@/components/Base';

export default class VerifikasiNoHandponeModalbox extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			shown: this.props.shown || false
		};
		this.hideModal = this.hideModal.bind(this);
	}

	hideModal() {
		this.setState({
			shown: false
		});
	}

	render() {
		return (
			!this.state.shown ? null : (
				<Modal small shown={this.props.shown}>
					<Modal.Header>
						<p>Verifikasi No Handphone</p>
						<p className='font-grey'><small>Mohon masukan no Handphone anda untuk verifikasi data</small></p>
					</Modal.Header>
					<Modal.Body>
						<form>
							<InputGroup>
								<Input placeholder='No Handphone anda (contoh: 08219823982189)' />
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
							<Button type='button' content='Konfirmasi' block color='dark' />
						</InputGroup>
						<InputGroup>
							<Button onClick={this.hideModal} type='button' size='medium' content='Nanti aja' block className='font-orange' />
						</InputGroup>
					</Modal.Footer>
				</Modal>
			)
		);
	}
};
