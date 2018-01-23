import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { action } from '@/state/v4/User';

class Login extends Component {
	constructor(props) {
		super(props);
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
		this.props = props;
	}

	componentDidMount() {
		this.props.dispatch(new action.userAnonymousLogin());
	}

	onLogin(e) {
		this.props.dispatch(new action.userLogin(this.props.userCookies, 'username', 'password'));
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
			<div>
				<h1>welcome {this.props.users.userprofile.userid}</h1>
				{userinfo}
				<button onClick={(e) => this.onLogin(e)} >Login</button>
			</div>);
	}
}

Login.defaultProps = {
	Home: 'hallo',
	Data: 'akjsdaskdjasldjsaldjalskdj'

};

const mapStateToProps = (state) => {
	return state;
};

export default withCookies(connect(mapStateToProps)(Login));
