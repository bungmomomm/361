import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { action } from '@/state/v4/User';
import { getSessionDomain } from '@/utils';
import { Header, Page, Navigation, Button, Input } from '@/components/mobile';


class Login extends Component {
	constructor(props) {
		super(props);
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
		this.props = props;
		this.state = {
			current: 'login'
		};
	}

	componentDidMount() {
		this.props.dispatch(new action.userAnonymousLogin());
	}

	async onLogin(e) {
		try {
			const { token } = await this.props.dispatch(new action.userLogin(this.props.userCookies, 'agus.sarwono@mataharimall.com', 'iniharusnyapassword'));
			this.setUserCookie(token);
		} catch (error) {
			console.log(error);
		}
	}

	onUserChange(e) {
		console.log(e);
		this.props.dispatch(new action.userNameChange(e));
	}

	setUserCookie(token) {
		const currentDate = new Date();
		currentDate.setDate(currentDate.getDate() + (2 * 365));
		this.props.cookies.set('user.exp', Number(token.expires_in), { domain: getSessionDomain(), expires: currentDate });
		this.props.cookies.set('user.rf.token', token.refresh_token, { domain: getSessionDomain(), expires: currentDate });
		this.props.cookies.set('user.token', token.token, { domain: getSessionDomain(), expires: currentDate });
	}

	handlePick(current) {
		this.setState({ current });
	}

	render() {
		const { userprofile } = this.props.users;
		const userinfo = Object.keys(userprofile).map((id, key) => {
			const value = userprofile[id];
			return (
				<li key={id}>{value}</li>
			);
		});

		return (
			<div style={this.props.style}>
				<Page>
					Login
					{userinfo}
					username
					<Input value={this.props.users.username} onChange={(e) => this.onUserChange(e.target.value)} />
					<Button color='primary' size='small' loading={this.props.isLoginLoading} onClick={(e) => this.onLogin(e)} >Login</Button>
					<Button color='primary' size='small' loading={this.props.isLoginLoading} onClick={(e) => this.onUserChange('')} >remove keyword</Button>
					<Button color='primary' size='small' loading={this.props.isRegisterLoading} onClick={(e) => this.onRegister(e)} >Register By Phone</Button>
					<Button color='primary' size='small' loading={this.props.isRegisterLoading} onClick={(e) => this.onRegister(e)} >Register By Email</Button>
					<Button color='primary' size='small' loading={this.props.isRegisterLoading} onClick={(e) => this.onRegister(e)} >Forgotpassword</Button>
					<Button color='primary' size='small' loading={this.props.isRegisterLoading} onClick={(e) => this.onRegister(e)} >Logout</Button>
				</Page>
				<Header />
				<Navigation />
			</div>);
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

export default withCookies(connect(mapStateToProps)(Login));
