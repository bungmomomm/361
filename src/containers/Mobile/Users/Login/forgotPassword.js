import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { actions as users } from '@/state/v4/User';
// import { Link } from 'react-router-dom';
import { 
	Header,
	Page,
	Button,
	Svg,
	Input,
	Modal
} from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import styles from '../user.scss';
import { to } from 'await-to-js';
import validator from 'validator';
import _ from 'lodash';


class ForgotPassword extends Component {
	constructor(props) {
		super(props);
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
		this.props = props;
		this.state = {
			error: false,
			isValidUsername: false,
			showModal: false,
			userName: '',
		};
	}
	
	async onResetPassword(e) {
		const { dispatch, cookies } = this.props;
		const { username } = this.state;
		const [err, response] = await to(dispatch(new users.userForgotPassword(cookies.get('user.token'), username)));
		if (err) {
			this.setState({
				error: true,
			});
			return err;
		}
		this.setState({
			error: false,
			message: response.data,
			showModal: true
		});
		return response;
	}

	onBack(e) {
		const { history } = this.props;
		history.goBack();
	}

	onUserChange(value) {
		let isValidUsername = false;
		if ((value.substring(0, 1) === '0' && _.parseInt(value) > 0 && validator.isMobilePhone(value, 'any')) || validator.isEmail(value)) {
			isValidUsername = true;
		}
		this.setState({
			error: false,
			userName: value,
			isValidUsername
		});
	}

	handlePick(current) {
		this.setState({ current });
	}

	render() {
		const { isLoginLoading } = this.props;
		const { error, isValidUsername, userName } = this.state;
		const HeaderPage = {
			left: (
				<Button onClick={(e) => this.onBack(e)}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
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
							<Input 
								disabled={isLoginLoading}
								flat 
								placeholder='Email / Nomor Handphone' 
								label='Email / Nomor Handphone' 
								onChange={(e) => this.onUserChange(e.target.value)} 
								error={error}
								hint={error ? 'We are unable to proccess your request, please try again' : ''}
							/>
						</div>
						<div className='margin--medium'>
							<Button
								className={'error'}
								color='primary'
								size='large'
								disabled={!isValidUsername}
								loading={isLoginLoading}
								onClick={e => this.onResetPassword(e)}
							>
								RESET
							</Button>
						</div>
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Modal className='text-center' show={this.state.showModal}>
					<div><strong>Lupa Password</strong></div>
					<p className='margin--medium'>Kami telah mengirimkan link reset password ke <strong>{userName}</strong>, silahkan cek email Anda</p>
					<Modal.Action 
						closeButton={''}
						confirmButton={<Button onClick={() => this.setState({ showModal: !this.state.showModal })}>OK</Button>}
						overlayClose={() => this.setState({ showModal: !this.state.showModal })}
					/>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		...state,
		isLoginLoading: state.users.isLoading
	};
};
const doAfterAnonymous = props => {
	console.log('code here if you need anon token or token');
};

export default withCookies(connect(mapStateToProps)(Shared(ForgotPassword, doAfterAnonymous)));