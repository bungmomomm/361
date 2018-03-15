import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import queryString from 'query-string';

import Shared from '@/containers/Mobile/Shared';
import Login from './Login/Page';
import Register from './Register';
import {
	Header,
	Page,
	Svg,
	Tabs
} from '@/components/mobile/';

class Users extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		const query = queryString.parse(props.location.search);
		this.state = {
			current: location.pathname.substring(1),
			redirectUri: query.redirect_uri || false
		};
	}

	handlePick(current) {
		const { history } = this.props;
		this.setState({
			current
		});
		history.replace(`/${current}`);
	}

	render() {
		const { style, users, history } = this.props;
		const { current, redirectUri } = this.state;
		let layout = null;
		const HeaderPage = {
			left: (
				<Link to='/'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: _.capitalize(current),
			right: null,
			shadow: false,
			rows: [
				{
					center: (
						<Tabs
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
				}
			]
		};
		if (current === 'login') {
			layout = (
				<Login history={history} users={users} redirectUri={redirectUri} />
			);
		} else {
			layout = (
				<Register history={history} users={users} redirectUri={redirectUri} />
			);
		}
		return (
			<div className='full-height' style={style}>
				<Page color='white'>
					{layout}
				</Page>
				<Header.Modal {...HeaderPage} />
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