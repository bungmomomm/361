import React, { Component } from 'react';
import Recaptcha from 'react-recaptcha';
import { 
	Modal,
	Input, 
	InputGroup, 
	Button
} from '@/components';
import { T } from '@/data/translations';

export default class ModalVerifyPhoneNumber extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	verifyCallback() {
		this.setState({
			verifiedRecaptcha: true
		});
	}
	
	render() {
		return (
			<Modal 
				close
				show
				variant='clean'
				size='medium'
				className='modalVerifyPhoneNumber'
				handleClose={() => this.props.handleClose()} 
			>
				<Modal.Header>
					<div>{T.checkout.PHONE_NUMBER_VERIFICATION}</div>
					<small>{T.checkout.PLEASE_ADD_PHONE_NUMBER}</small>
				</Modal.Header>
				<Modal.Body>
					<InputGroup>
						<Input 
							placeholder={T.checkout.EX_YOUR_PHONE_NUMBER}
							name='phonenumber'
							type='text'
						/>
					</InputGroup>
					<InputGroup>
						{ 
							process.env.GOOGLE_CAPTCHA_SITE_KEY && (
								<Recaptcha
									sitekey={process.env.GOOGLE_CAPTCHA_SITE_KEY}
									verifyCallback={() => this.verifyCallback()}
								/>
							) 
						}
					</InputGroup>
					<InputGroup>
						<Button 
							block
							type='button'
							content='Konfirmasi'
							color='dark'
						/>
					</InputGroup>
					<InputGroup>
						<Button 
							block
							type='button'
							size='medium'
							content='Nanti aja'
							className='font-orange'
							onClick={() => this.props.handleClose()}
						/>
					</InputGroup>
				</Modal.Body>
			</Modal>
		);
	}
}