import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { actions as users } from '@/state/v4/User';
// import { Link } from 'react-router-dom';
// import {
// 	setUserCookie
// } from '@/utils';
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
import queryString from 'query-string';

import Otp from '@/containers/Mobile/Shared/Otp';
import { userToken, userSource } from '@/data/cookiesLabel';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class ForgotPassword extends Component {
	constructor(props) {
		super(props);
		this.source = this.props.cookies.get(userSource);
		this.props = props;

		const query = queryString.parse(props.location.search);
		this.state = {
			redirectUri: query.redirect_uri || false,
			error: false,
			isValidUsername: false,
			showModal: false,
			userName: '',
			showOtp: false,
			useOtp: false
		};
	}

	async onResetPassword(e) {
		const { dispatch, cookies } = this.props;
		const { userName, useOtp } = this.state;
		const response = await to(dispatch(new users.userForgotPassword(cookies.get(userToken), userName)));
		this.setState({
			error: false,
			data: response[1] ? response[1].data : '',
			message: response[1] ? response[1].message : '',
			showModal: !useOtp,
			showOtp: useOtp
		});
		return response[1];
	}

	onBack(e) {
		const { history } = this.props;
		const { showOtp } = this.state;
		if (showOtp) {
			this.setState({
				showOtp: false
			});
		} else {
			history.goBack();
		}
	}

	onUserChange(value) {
		let isValidUsername = false;
		let useOtp = false;
		if ((value.substring(0, 1) === '0' && _.parseInt(value) > 0 && validator.isMobilePhone(value, 'any')) || validator.isEmail(value)) {
			isValidUsername = true;
		}

		if (validator.isMobilePhone(value, 'any')) {
			useOtp = true;
		}
		this.setState({
			error: false,
			userName: value,
			isValidUsername,
			useOtp,
			typed: value !== ''
		});
	}

	handlePick(current) {
		this.setState({ current });
	}

	async successValidateOtp(response) {
		const { history } = this.props;
		history.push(`/user/newpassword?token=${response.token}`);
	}

	render() {
		const { isLoginLoading } = this.props;
		const { error, isValidUsername, userName, showOtp, data, typed } = this.state;
		const HeaderPage = {
			left: (
				<Button onClick={(e) => this.onBack(e)}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: 'Lupa Password',
			right: null
		};

		if (showOtp) {
			return (
				<Otp
					isLoading={isLoginLoading}
					autoSend={false}
					type={'forgot'}
					phoneEmail={userName}
					countdownValue={data.countdown}
					onClickBack={() => this.onBack()}
					onSuccess={(response) => this.successValidateOtp(response)}
				/>
			);
		};
		return (
			<div className='full-height' style={this.props.style}>
				<Page color='white'>
					<div className={styles.container}>
						<div className='margin--medium-v text-left'>Masukkan alamat email atau nomer telepon Anda dan kami akan mengirimkan link untuk mengubah password lama Anda.</div>
						<div className='margin--medium-v text-center'>
							<Input
								disabled={isLoginLoading}
								flat
								placeholder=''
								label='Email / Nomor Handphone'
								onChange={(e) => this.onUserChange(e.target.value)}
								error={error || (!isValidUsername && typed)}
								hint={error || (!isValidUsername && typed) ? ((!isValidUsername && typed) ? 'Format Nomor Handphone/Email harus benar' : 'We are unable to proccess your request, please try again') : 'Format Nomor Handphone/Email harus benar'}
							/>
						</div>
						<div className='margin--medium-v'>
							<Button
								className={'error'}
								color='yellow'
								size='large'
								disabled={!isValidUsername}
								loading={isLoginLoading}
								onClick={e => this.onResetPassword(e)}
							>
								RESET PASSWORD
							</Button>
						</div>
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Modal className='text-center' show={this.state.showModal}>
					<div><strong>Lupa Password</strong></div>
					<p className='margin--medium-v'>Kami telah mengirimkan link reset password ke <strong>{userName}</strong>, silahkan cek email Anda</p>
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
