import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { users } from '@/state/v4/User';
import { Link } from 'react-router-dom';
import { Header, Page, Button, Input, Tabs, Svg, Notification } from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import { setUserCookie } from '@/utils';
import styles from '../user.scss';

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
			visibalePasswod: false
		};
	}

	async onLogin(e) {
		try {
			const { token } = await this.props.dispatch(new users.userLogin(this.props.userCookies, 'agus.sarwono@mataharimall.com', 'iniharusnyapassword'));
			setUserCookie(this.props.cookies, token);
		} catch (error) {
			console.log(error);
		}
	}

	onUserChange(e) {
		console.log(e);
		this.props.dispatch(new users.userNameChange(e));
	}


	handlePick(current) {
		this.setState({ current });
	}

	render() {
		const { userProfile } = this.props.users;
		const { visibalePasswod } = this.state;
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

		const userinfo = Object.keys(userProfile).map((id, key) => {
			const value = userProfile[id];
			return (
				<li key={id}>{id} : {value}</li>
			);
		});

		return (
			<div className='full-height' style={this.props.style}>
				<Page>
					<Tabs
						current={this.state.current}
						variants={DUMMY_TAB}
						onPick={(e) => this.handlePick(e)}
					/>
					<div className={styles.container}>
						<div className='margin--medium'>Login Dengan</div>
						<div className='flex-row flex-center flex-spaceBetween'>
							<div style={{ width: '45%' }}><Button wide color='facebook' size='medium' >Facebook</Button></div>
							<div style={{ width: '45%' }}><Button wide color='google' size='medium' ><Svg src='ico_google.svg' style={{ marginRight: '10px' }} />Google</Button></div>
						</div>
						<div className={styles.divider}><span>A	tau</span></div>
						<Notification style={{ marginBottom: '20px' }} disableClose color='pink' show><span className='font-color--secondary'>Email/No Handphone/Password yang Anda masukkan salah</span></Notification>
						<div>
							<Input label='Nomor Handphone/Email' type='text' error hint='wajib diisi' flat placeholder='Nomor Handphone/Email' />
							<Input label='Password' iconRight={<Button onClick={() => this.setState({ visibalePasswod: !visibalePasswod })}>show</Button>} type={visibalePasswod ? 'text' : 'password'} flat placeholder='Password minimal 6 karakter' />
						</div>
						<div className='margin--medium text-right'>
							<Link to='/'>LUPA PASSWORD</Link>
						</div>
						<div className='margin--medium'>
							<Button color='primary' size='large' onClick={(e) => this.onLogin(e)} >LOGIN</Button>
						</div>
					</div>


					<div style={{ display: 'none' }}>
						Login
						<ul>
							{userinfo}
						</ul>
						username
						<Input value={this.props.users.username} onChange={(e) => this.onUserChange(e.target.value)} />
						<Button color='primary' size='small' loading={this.props.isLoginLoading} onClick={(e) => this.onLogin(e)} >Login</Button>
						<Button color='primary' size='small' loading={this.props.isLoginLoading} onClick={(e) => this.onUserChange('')} >remove keyword</Button>
						<Button color='primary' size='small' loading={this.props.isRegisterLoading} onClick={(e) => this.onRegister(e)} >Register By Phone</Button>
						<Button color='primary' size='small' loading={this.props.isRegisterLoading} onClick={(e) => this.onRegister(e)} >Register By Email</Button>
						<Button color='primary' size='small' loading={this.props.isRegisterLoading} onClick={(e) => this.onRegister(e)} >Forgotpassword</Button>
						<Button color='primary' size='small' loading={this.props.isRegisterLoading} onClick={(e) => this.onRegister(e)} >Logout</Button>
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
		...state,
		isLoginLoading: state.users.isLoading
	};
};
const doAfterAnonymous = (props) => {
	console.log('code here if you need anon token or token');
};

export default withCookies(connect(mapStateToProps)(Shared(Login, doAfterAnonymous)));