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
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
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
		try {
			const { token } = await this.props.dispatch(new users.userLogin(this.props.userCookies, this.state.loginId, this.state.password));
			setUserCookie(this.props.cookies, token);
			this.props.history.push('/');
		} catch (error) {
			console.log(error.message);
		}
	}

	onSocialLogin(e) {
		console.log(e);
		console.log(this.state);
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
								<SocialLogin.FacebookLogin appId={process.env.FBAPP_ID} onSuccess={(e) => console.log('success', e)} callback={(e) => console.log('callback', e)}>
									<Button wide color='facebook' size='medium' >Facebook</Button>
								</SocialLogin.FacebookLogin>
							</div>
							<div style={{ width: '45%' }}>
								<SocialLogin.GoogleLogin clientId={process.env.GOOGLEAPP_ID} appId={process.env.GOOGLEAPP_APIKEY} onSuccess={(e) => console.log('success', e)} callback={(e) => console.log('callback', e)}>
									<Button wide color='google' size='medium' ><Svg src='ico_google.svg' style={{ marginRight: '10px' }} />Google</Button>
								</SocialLogin.GoogleLogin>
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
