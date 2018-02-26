import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { actions as users } from '@/state/v4/User';
import { Link, Redirect } from 'react-router-dom';
import { Header, Page, Button, Input, Tabs, Svg, Notification } from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import { setUserCookie, renderIf, SocialLogin } from '@/utils';
import styles from '../user.scss';
import _ from 'lodash';
import validator from 'validator';
import util from 'util';
import { to } from 'await-to-js';
import { Helmet } from 'react-helmet';

const DUMMY_TAB = [{
	Title: 'Login',
	id: 'login'
}, {
	Title: 'Daftar',
	id: 'register'
}];

class Login extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			current: 'login',
			visiblePassword: false,
			loginId: '',
			password: '',
			validLoginId: false,
			validPassword: false,
			validLogin: false,
		};
	}

	async onLogin(e) {
		const { cookies } = this.props;
		const [err, response] = await to(this.props.dispatch(new users.userLogin(cookies.get('user.token'), this.state.loginId, this.state.password)));
		if (err) {
			return err;
		}
		setUserCookie(this.props.cookies, response.token);
		this.props.history.push('/');
		return response;
	}

	async onSocialLogin(provider, e) {
		const { cookies } = this.props;
		const { accessToken } = e;
		const [err, response] = await to(this.props.dispatch(new users.userSocialLogin(cookies.get('user.token'), provider, accessToken)));
		if (err) {
			return err;
		}
		setUserCookie(this.props.cookies, response.token);
		this.props.history.push('/');
		return response;
	}

	onFieldChange(e, type) {
		const value = util.format('%s', e.target.value);
		if (type === 'loginId') {
			let valudId = false;
			if ((value.substring(0, 1) === '0' && _.parseInt(value) > 0 && validator.isMobilePhone(value, 'any')) || validator.isEmail(value)) {
				valudId = true;
			}
			this.setState({
				validLoginId: valudId
			});
		} else {
			this.setState({
				validLoginPassword: !validator.isEmpty(value) && validator.isLength(value, { min: 6, max: undefined })
			});
		}
	}

	handlePick(current) {
		this.setState({ current });
	}

	render() {
		const { isLoading, error } = this.props.users;
		const { visiblePassword, current, validLoginId, validLoginPassword } = this.state;
		const buttonLoginEnable = !isLoading && validLoginId && validLoginPassword;
		const register = (current === 'register');
		const HeaderPage = {
			left: (
				<Link to='/'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Login',
			right: null,
			shadow: false
		};

		return (
			<div className='full-height' style={this.props.style}>
				{renderIf(register)(
					<Redirect to='/register' />
				)}
				<Helmet>
					<title>Login</title>
				</Helmet>
				<Page>
					<Tabs
						current={this.state.current}
						variants={DUMMY_TAB}
						onPick={(e) => this.handlePick(e)}
					/>
					<div className={styles.container}>
						<div className='margin--medium'>Login Dengan</div>
						<div className='flex-row flex-center flex-spaceBetween'>
							<div style={{ width: '45%' }}>
								<SocialLogin 
									provider={'facebook'} 
									wide
									size='medium' 
									appId={process.env.FBAPP_ID} 
									onSuccess={(e) => this.onSocialLogin('facebook', e)} 
									callback={(e) => console.log('callback', e)}
								>
									Facebook
								</SocialLogin>
							</div>
							<div style={{ width: '45%' }}>
								<SocialLogin 
									provider={'google'} 
									wide 
									size='medium' 
									clientId={process.env.GOOGLEAPP_ID} 
									appId={process.env.GOOGLEAPP_APIKEY} 
									onSuccess={(e) => this.onSocialLogin('google', e)} 
									callback={(e) => console.log('callback', e)}
								>
									<Svg src='ico_google.svg' style={{ marginRight: '10px' }} />Google
								</SocialLogin>
							</div>
						</div>
						<div className={styles.divider}><span>Atau</span></div>
						{ renderIf(error)(
							<Notification style={{ marginBottom: '20px' }} disableClose color='pink' show><span className='font-color--secondary'>Email/No Handphone/Password yang Anda masukkan salah</span></Notification>
						) }
						<div>
							<Input value={this.state.loginId} ref={c => { this.loginId = c; }} onChange={(event) => { console.log(event.target.value); this.onFieldChange(event, 'loginId'); this.setState({ loginId: event.target.value }); }} label='Nomor Handphone/Email' type='text' flat placeholder='Nomor Handphone/Email' />
							<Input value={this.state.password} ref={c => { this.password = c; }} onChange={(event) => { this.onFieldChange(event, 'password'); this.setState({ password: event.target.value }); }} label='Password' iconRight={<Button onClick={() => this.setState({ visiblePassword: !visiblePassword })}>show</Button>} type={visiblePassword ? 'text' : 'password'} flat placeholder='Password minimal 6 karakter' />
						</div>
						<div className='flex-row flex-center flex-spaceBetween'>
							<div style={{ width: '45%' }}>
								<div className='margin--medium text-left'>
									<Link to='/'>LUPA PASSWORD</Link>
								</div>
							</div>
							<div style={{ width: '45%' }}>
								<div className='margin--medium text-right'>
									<Link to='/register'>DAFTAR</Link>
								</div>
							</div>
						</div>
						<div className='margin--medium'>
							<Button color='primary' size='large' disabled={!buttonLoginEnable} loading={isLoading} onClick={(e) => this.onLogin(e)} >LOGIN</Button>
						</div>
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
			</div>
		);
	}
}

Login.defaultProps = {
	Home: 'hallo',
	Data: 'akjsdaskdjasldjsaldjalskdj'
};

const mapStateToProps = (state) => {
	return {
		...state
	};
};
const doAfterAnonymous = (props) => {
	console.log('code here if you need anon token or token');
	const userCookies = props.cookies.get('user.token');
	if (!_.isEmpty(userCookies)) {
		console.log('redirecting...');
		// props.history.push('/dashboard');
	}
};

export default withCookies(connect(mapStateToProps)(Shared(Login, doAfterAnonymous)));
