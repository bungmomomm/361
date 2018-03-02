import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { actions as users } from '@/state/v4/User';
import { 
	Link,
	Redirect 
} from 'react-router-dom';
import {
	Header,
	Page,
	Button,
	Input,
	Tabs,
	Svg
} from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import LoginWidget from '@/containers/Mobile/Shared/Widget/Login';
import { 
	setUserCookie, 
	renderIf 
} from '@/utils';
import styles from '../user.scss';
import to from 'await-to-js';

class Register extends Component {
	constructor(props) {
		super(props);
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
		this.props = props;
		this.state = {
			current: 'register',
			visiblePassword: false
		};
	}

	async onSocialLogin(provider, token, profile) {
		const { cookies, dispatch, history } = this.props;
		const { redirectUrl } = this.state;
		const { accessToken } = token;
		const [err, response] = await to(dispatch(new users.userSocialLogin(cookies.get('user.token'), provider, accessToken)));
		if (err) {
			return err;
		}
		setUserCookie(this.props.cookies, response.token);
		history.push(redirectUrl || '/');
		return response;
	}

	onUserChange(e) {
		console.log(e);
		this.props.dispatch(new users.userNameChange(e));
	}

	handlePick(current) {
		this.setState({ current });
	}

	render() {
		const { 
			visiblePassword,
			current
		} = this.state;
		const HeaderPage = {
			left: (
				<Link to='/'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Daftar',
			right: null,
			shadow: false
		};

		const register = (current === 'login');
		const providerConfig = {
			google: {
				clientId: process.env.GOOGLEAPP_ID,
				appId: process.env.GOOGLEAPP_APIKEY
			},
			facebook: {
				appId: process.env.FBAPP_ID
			}
		};
		return (
			<div className='full-height' style={this.props.style}>
				<Page>
					{renderIf(register)(
						<Redirect to='/login' />
					)}
					<Tabs
						current={this.state.current}
						variants={[
							{
								Title: 'Login',
								id: 'login'
							},
							{
								Title: 'Daftar',
								id: 'register'
							}
						]}
						onPick={e => this.handlePick(e)}
					/>
					<div className={styles.container}>
						<div className='margin--medium'>Daftar Dengan</div>
						<LoginWidget
							provider={providerConfig}
							onSuccess={(provider, token, profile) => this.onSocialLogin(provider, token, profile)}
							onFailure={(provider, e) => console.log(provider, e)}
						/>
						<div className={styles.divider}>
							<span>Atau</span>
						</div>
						<div>
							<Input
								label='Nama Lengkap'
								type='text'
								flat
								placeholder='Nama Lengkap'
							/>
							<Input
								label='Nomor Handphone /  Email'
								flat
								error
								value='081381332'
								hint='Format Email/Nomor Handphone tidak sesuai. Silakan cek kembali'
								placeholder='Nomor Handphone /  Email'
							/>
							<Input
								label='Password'
								iconRight={
									<Button>
										<Svg src={visiblePassword ? 'ico_eye.svg' : 'ico_eye-off.svg'} />
									</Button>
								}
								type={visiblePassword ? 'text' : 'password'}
								flat
								placeholder='Password minimal 6 karakter'
							/>
						</div>
						<div className='margin--medium text-left'>
							<p><small>Dengan membuka Akun, Anda telah membaca, mengerti dan menyetujui <Link to='/'>Syarat & Ketentuan dan Kebijakan Privasi</Link> MatahariMall.com</small></p>
						</div>
						<div className='margin--medium'>
							<Button
								color='primary'
								size='large'
							>
								Daftar
							</Button>
						</div>
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
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

export default withCookies(
	connect(mapStateToProps)(Shared(Register, doAfterAnonymous))
);
