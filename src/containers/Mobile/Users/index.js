import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import _ from 'lodash';
import queryString from 'query-string';
import Shared from '@/containers/Mobile/Shared';
import Login from './Login';
import Register from './Register';
import {
	Button,
	Header,
	Page,
	Svg,
	Tabs
} from '@/components/mobile/';
import handler from '@/containers/Mobile/Shared/handler';
import { isLogin } from '@/data/cookiesLabel';

@handler
class Users extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		const query = queryString.parse(props.location.search);
		this.state = {
			current: location.pathname.substring(1),
			redirectUri: query.redirect_uri || false,
			loading: true,
			callback: {
				register: {
					view: ''
				}
			}
		};
		this.callbackRegisterComponent = this.callbackRegisterComponent.bind(this);
	}

	componentDidMount() {
		
		const { redirectUri } = this.state;
		const { history } = this.props;
		
		if (redirectUri.indexOf('digital') > -1) {
			
			// Do nothing let them stay into the page.
			
		} else if (this.props.cookies.get(isLogin) === 'true') {
			history.replace('/profile');
		}
		
	}

	onBack(e) {
		const { history } = this.props;
		if (history.length > 0) {
			history.goBack();
		} else {
			history.push('/');
		}
	}

	handlePick(current) {
		const { history } = this.props;
		this.setState({
			current
		});
		history.replace(`/${current}${location.search}`);
	}

	callbackRegisterComponent(value) {
		this.setState({
			callback: {
				register: {
					view: value
				}
			}
		});
	};

	render() {
		const { style, users, history } = this.props;
		const { current, redirectUri } = this.state;
		const { callback } = this.state;
		let layout = null;
		const HeaderPage = {
			left: (
				<Button onClick={(e) => this.onBack(e)}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: _.capitalize(current),
			right: null,
			shadow: false,
			rows: (
				<Tabs
					type='borderedBottom'
					activeTab={current}
					variants={[
						{
							title: 'Login',
							id: 'login'
						},
						{
							title: 'Daftar',
							id: 'register'
						}
					]}
					onPick={(e) => this.handlePick(e)}
				/>
			)
		};
		if (current === 'login') {
			layout = (
				<Login history={history} users={users} redirectUri={redirectUri} />
			);
		} else {
			layout = (
				<Register
					history={history}
					users={users}
					redirectUri={redirectUri}
					callback={this.callbackRegisterComponent}
				/>
			);
		}
		return (
			<div className='full-height' style={style}>
				<Page color='white'>
					{layout}
				</Page>
				{(callback.register.view !== 'VALIDATE_OTP') ? <Header.Modal {...HeaderPage} /> : null}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		...state
	};
};

export default withCookies(connect(mapStateToProps)(Shared(Users)));
