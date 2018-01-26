import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { users } from '@/state/v4/User';
import { Header, Page, Navigation, Button, Input } from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import { setUserCookie } from '@/utils';


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
		const userinfo = Object.keys(userProfile).map((id, key) => {
			const value = userProfile[id];
			return (
				<li key={id}>{id} : {value}</li>
			);
		});

		return (
			<div style={this.props.style}>
				<Page>
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
const doAfterAnonymous = (props) => {
	console.log('code here if you need anon token or token');
};

export default withCookies(connect(mapStateToProps)(Shared(Login, doAfterAnonymous)));