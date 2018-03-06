import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { users } from '@/state/v4/User';
import { Link } from 'react-router-dom';
import { Header, Page, Button, Svg, Input, Notification } from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import styles from '../user.scss';


class RegisteredPhoneValidation extends Component {
	constructor(props) {
		super(props);
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
		this.props = props;
		this.state = {
			visibalePasswod: false
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
			center: 'Verifikasi Nomor HP',
			right: null
		};

		return (
			<div className='full-height' style={this.props.style}>
				<Page>
					<div className={styles.container}>
						<div className='margin--medium-v'>Kami telah mengirimkan kode verifikasi ke no XXXXXXXX. Silakan masukan kode verifikasi.</div>
						<Notification color='green' show disableClose>
							<span>Pengiriman kode verifikasi sukses!</span>
						</Notification>
						<div className='margin--medium-v text-center'>
							<Input value='123123' error hint='Kode verifikasi salah' partitioned maxLength={6} />
						</div>
						<div className='margin--small-v'>
							<Button
								color='secondary'
								size='large'
								outline
								onClick={e => this.onLogin(e)}
							>
								Kirim Ulang Kode SMS
							</Button>
						</div>
						<div className='margin--medium-v'>
							<Button
								color='primary'
								size='large'
								onClick={e => this.onLogin(e)}
							>
								VERIFIKASI
							</Button>
						</div>
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
			</div>
		);
	}
}

RegisteredPhoneValidation.defaultProps = {
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
	connect(mapStateToProps)(Shared(RegisteredPhoneValidation, doAfterAnonymous))
);
