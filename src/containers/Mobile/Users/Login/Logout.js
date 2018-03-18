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
import { removeUserCookie } from '@/utils';

class Logout extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		
		const query = queryString.parse(props.location.search);
		
		this.state = {
			loading: true,
			redirectUri: query.redirectUri || false
		};
		this.timeout = setTimeout(() => {
			this.redirect();
		}, 2000);
	}

	redirect() {
		const { 
			history, 
			cookies 
		} = this.props;
		const { redirectUri } = this.state;
		removeUserCookie(cookies);
		history.push(redirectUri || '/');
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

export default withCookies(connect()(Shared(Logout)));