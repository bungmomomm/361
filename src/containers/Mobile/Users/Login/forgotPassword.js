import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { users } from '@/state/v4/User';
import { Link } from 'react-router-dom';
import { Header, Page, Button, Svg, Input, Modal } from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import styles from '../user.scss';


class ForgotPassword extends Component {
	constructor(props) {
		super(props);
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
		this.props = props;
		this.state = {
			visibalePasswod: false,
			showModal: true,
		};
	}
	
	onUserChange(e) {
		this.props.dispatch(new users.userNameChange(e));
	}

	handlePick(current) {
		this.setState({ current });
	}

	render() {
		const HeaderPage = {
			left: (
				<Link to='/'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Lupa Password',
			right: null
		};
		
		return (
			<div className='full-height' style={this.props.style}>
				<Page>
					<div className={styles.container}>
						<div className='margin--medium'>Masukkan alamat email atau nomer telepon Anda dan kami akan mengirimkan link untuk mengubah password lama Anda.</div>
						<div className='margin--medium text-center'>
							<Input flat placeholder='Email / Nomor Handphone' label='Email / Nomor Handphone' />
						</div>
						<div className='margin--medium'>
							<Button
								color='primary'
								size='large'
								onClick={e => this.onLogin(e)}
							>
								RESET
							</Button>
						</div>
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Modal.Content className='text-center' show={this.state.showModal}>
					<div><strong>Lupa Password</strong></div>
					<p className='margin--medium'>Kami telah mengirimkan link reset password ke <strong>me@bungmomo.com</strong>, silahkan cek email Anda</p>
					<Modal.Action 
						closeButton={<Button onClick={() => this.setState({ showModal: !this.state.showModal })}>CLOSE</Button>}
						confirmButton={<Button>OK</Button>}
						overlayClose={() => this.setState({ showModal: !this.state.showModal })}
					/>
				</Modal.Content>
			</div>
		);
	}
}

ForgotPassword.defaultProps = {
	Home: 'hallo',
	Data: 'akjsdaskdjasldjsaldjalskdj'
};

const mapStateToProps = state => {
	return {
		...state,
		isLoginLoading: state.users.isLoading
	};
};
const doAfterAnonymous = props => {
	console.log('code here if you need anon token or token');
};

export default withCookies(
	connect(mapStateToProps)(Shared(ForgotPassword, doAfterAnonymous))
);
