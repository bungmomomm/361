import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { actions as users } from '@/state/v4/User';
import { Link, Redirect } from 'react-router-dom';
import { Header, Page, Button, Input, Tabs, Svg, Notification } from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import LoginWidget from '@/containers/Mobile/Shared/Widget/Login';
import { setUserCookie, renderIf } from '@/utils';
import styles from '../user.scss';
import _ from 'lodash';
import validator from 'validator';
import util from 'util';
import to from 'await-to-js';
import queryString from 'query-string';

class Login extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		const query = queryString.parse(props.location.search);
		this.state = {
			current: 'login',
			visiblePassword: false,
			loginId: '',
			password: '',
			validLoginId: false,
			validPassword: false,
			validLogin: false,
			redirectUrl: query.redirect_uri || false
		};
	}

	componentDidMount() {

	}

	async onLogin(e) {
		const { cookies, dispatch, history } = this.props;
		const { loginId, password, redirectUrl } = this.state;
		const [err, response] = await to(dispatch(new users.userLogin(cookies.get('user.token'), loginId, password)));
		if (err) {
			return err;
		}
		setUserCookie(this.props.cookies, response.token);
		history.push(redirectUrl || '/');
		return response;
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
		const { style } = this.props;
		const { isLoading, error } = this.props.users;
		const { visiblePassword, current, validLoginId, validLoginPassword, loginId, password } = this.state;
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
			<div className='full-height' style={style}>
				{renderIf(register)(
					<Redirect to='/register' />
				)}
				<Page>
					<Tabs
						current={current}
						variants={[
							{
								title: 'Login',
								id: 'login'
							},
							{
								title: 'register',
								id: 'register'
							}
						]}
						onPick={(e) => this.handlePick(e)}
					/>
					<div className={styles.container}>
						<div className='margin--medium-v'>Login Dengan</div>
						<LoginWidget
							provider={providerConfig}
							onSuccess={(provider, token, profile) => this.onSocialLogin(provider, token, profile)}
							onFailure={(provider, e) => console.log(provider, e)}
						/>
						<div className={styles.divider}><span>Atau</span></div>
						{ renderIf(error)(
							<Notification style={{ marginBottom: '20px' }} disableClose color='pink' show><span className='font-color--secondary'>Email/No Handphone/Password yang Anda masukkan salah</span></Notification>
						) }
						<div>
							<Input value={loginId} ref={c => { this.loginId = c; }} onChange={(event) => { this.onFieldChange(event, 'loginId'); this.setState({ loginId: event.target.value }); }} label='Nomor Handphone/Email' type='text' flat placeholder='Nomor Handphone/Email' />
							<Input value={password} ref={c => { this.password = c; }} onChange={(event) => { this.onFieldChange(event, 'password'); this.setState({ password: event.target.value }); }} label='Password' iconRight={<Button onClick={() => this.setState({ visiblePassword: !visiblePassword })}>show</Button>} type={visiblePassword ? 'text' : 'password'} flat placeholder='Password minimal 6 karakter' />
						</div>
						<div className='flex-row flex-center flex-spaceBetween'>
							<div style={{ width: '45%' }}>
								<div className='margin--medium-v text-left'>
									<Link to='/forgot-password'>LUPA PASSWORD</Link>
								</div>
							</div>
							<div style={{ width: '45%' }}>
								<div className='margin--medium-v text-right'>
									<Link to='/register'>DAFTAR</Link>
								</div>
							</div>
						</div>
						<div className='margin--medium-v'>
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
	const userCookies = props.cookies.get('user.token');
	if (!_.isEmpty(userCookies)) {
		console.log('redirecting...');
		// props.history.push('/dashboard');
	}
};

export default withCookies(connect(mapStateToProps)(Shared(Login, doAfterAnonymous)));
