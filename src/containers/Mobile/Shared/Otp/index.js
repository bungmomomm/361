import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
// import _ from 'lodash';
// import util from 'util';
// import { to } from 'await-to-js';
// import validator from 'validator';

import { Header, Page, Button, Svg, Input, Notification } from '@/components/mobile';

import { actions as userActions } from '@/state/v4/User';

import CONST from '@/constants';
import { renderIf } from '@/utils';

import styles from './otp.scss';


class Otp extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.userToken = this.props.cookies.get(CONST.COOKIE_USER_TOKEN);

		this.state = {
			showNotif: false,
			statusNotif: '',
			showVerifyButton: false,
			phoneEmail: props.phoneEmail,
			isLoading: false,
			otpCount: 0
		};
	}

	componentWillMount = async () => {
		const { phoneEmail, dispatch } = this.props;

		if (phoneEmail !== '') {
			const [err, response] = dispatch(userActions.userOtp(this.userToken, phoneEmail));
			if (err) {
				console.log('err', err);
			} else if (response) {
				console.log('response', response);
			}
		}
	}

	renderHeader() {
		const { onClickBack, headerTitle } = this.props;
		const HeaderPage = {
			left: (
				<Button onClick={onClickBack}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: headerTitle || 'Verifikasi Nomor HP',
			right: null
		};

		return <Header.Modal {...HeaderPage} />;
	}

	renderNotification() {
		const { showNotif, statusNotif } = this.state;

		let color = null;
		let message = null;
		switch (statusNotif) {
		case 'success':
			color = 'green';
			message = 'Pengiriman kode verifikasi sukses!';
			break;
		default:
			color = 'pink';
			message = 'Pengiriman kode verifikasi gagal, silakan coba lagi.';
			break;
		}

		renderIf(showNotif)(
			<Notification color={color} show disableClose>
				<span>{message}</span>
			</Notification>
		);
	}

	renderOtpForm() {
		console.log(this.state);
		return (
			<div className='margin--medium-v text-center'>
				<Input
					error
					hint='Kode verifikasi salah'
					partitioned 
					maxLength={6}
				/>
			</div>
		);
	}

	renderResendButton() {
		return (
			<div className='margin--small-v'>
				<Button
					color='secondary'
					size='large'
					outline
					onClick={e => this.onClickResend(e)}
				>
					Kirim Ulang Kode SMS
				</Button>
			</div>
		);
	}

	renderVerifyButton() {
		const { showVerifyButton } = this.state;
		renderIf(showVerifyButton)(
			<div className='margin--medium-v'>
				<Button
					color='primary'
					size='large'
					onClick={e => this.onClickVerify(e)}
				>
					VERIFIKASI
				</Button>
			</div>
		);
	}

	render() {
		const { phoneEmail } = this.state;

		return (
			<div className='full-height' style={this.props.style}>
				<Page>
					<div className={styles.container}>
						<div className='margin--medium-v'>Kami telah mengirimkan kode verifikasi ke no {phoneEmail}. Silakan masukan kode verifikasi.</div>
						{this.renderNotification()}
						{this.renderOtpForm()}
						{this.renderResendButton()}
						{this.renderVerifyButton()}
					</div>
				</Page>
				{this.renderHeader()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		...state
	};
};

export default withCookies(connect(mapStateToProps)(Otp));