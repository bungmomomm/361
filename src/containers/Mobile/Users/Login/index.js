import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { action } from '@/state/v4/User';
import { renderIf } from '@/utils';
import { Header, Page, Navigation, Tabs, Button } from '@/components/mobile';


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

	setUserCookie(token) {
		console.log(this.state);
		console.log(token);
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
					<Tabs
						current={this.state.current}
						variants={this.props.Tabs}
						onPick={(e) => this.handlePick(e)}
					/>
					{renderIf(this.state.current === 'login')(
						<div>
							Login
							{userinfo}
							<Button color='primary' size='small' loading={this.props.isLoginLoading} onClick={(e) => this.onLogin(e)} >Login</Button>
						</div>
					)}
					{renderIf(this.state.current === 'register')(
						<div>
							Register
						</div>
					)}
				</Page>
				<Header />
				<Navigation />
			</div>);
	}
}

Login.defaultProps = {
	Home: 'hallo',
	Data: 'akjsdaskdjasldjsaldjalskdj',
	Tabs: [
		{
			id: 'login',
			title: 'Login',
			active: true
		},
		{
			id: 'register',
			title: 'Register'
		}
	]
};

const mapStateToProps = (state) => {
	return {
		...state,
		isLoginLoading: !state.users.isLoading
	};
};

export default withCookies(connect(mapStateToProps)(Login));
