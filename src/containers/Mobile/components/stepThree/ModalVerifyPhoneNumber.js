import React, { Component } from 'react';
import Recaptcha from 'react-recaptcha';
import { 
	Modal,
	Input, 
	InputGroup, 
	Button
} from '@/components';

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
					<div>Verifikasi No Handphone</div>
					<small>Mohon masukkan no handphone anda untuk verifikasi data</small>
				</Modal.Header>
				<Modal.Body>
					<InputGroup>
						<Input 
							placeholder='No handphone anda (contoh: 08123456789)'
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