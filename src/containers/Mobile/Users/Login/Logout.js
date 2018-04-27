import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import {
	Header,
	Spinner,
	Page
} from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import queryString from 'query-string';
import { setUserCookie, removeUserProfileCookie } from '@/utils';
import { actions as userActions } from '@/state/v4/User';
import to from 'await-to-js';
import handler from '@/containers/Mobile/Shared/handler';

import { userToken } from '@/data/cookiesLabel';

@handler
class Logout extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		const query = queryString.parse(props.location.search);

		this.state = {
			loading: true,
			redirectUri: query.redirect_uri || false
		};

	}

	componentDidMount() {
		this.timeout = setTimeout(() => {
			this.redirect();
		}, 2000);
	}

	async redirect() {
		const {
			dispatch,
			history,
			cookies
		} = this.props;
		const { redirectUri } = this.state;
		const [err, response] = await to(dispatch(userActions.userLogout(cookies.get(userToken))));
		if (err) {
			return err;
		}
		// remove current token
		window.sessionStorage.removeItem('cacheToken');
		removeUserProfileCookie(cookies);
		setUserCookie(cookies, response.token, true);
		history.push(redirectUri || '/');
		return response;
	}

	render() {
		const { style } = this.props;
		const HeaderPage = {
			left: null,
			center: 'Logout',
			right: null,
			shadow: false,
			rows: []
		};
		return (
			<div className='full-height' style={style}>
				<Page color='white'>
					<p className={'text-center'} style={{ padding: '20px auto' }}>Redirecting...</p>
					<Spinner />
				</Page>
				<Header.Modal {...HeaderPage} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return state;
};

export default withCookies(connect(mapStateToProps)(Shared(Logout)));
