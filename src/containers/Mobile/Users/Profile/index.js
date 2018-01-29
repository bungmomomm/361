import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { Page, Navigation, Header, Svg } from '@/components/mobile';

class Profile extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		const HeaderPage = {
			left: null,
			center: 'Profile',
			right: (<Svg src='ico_setting.svg' />)
		};
		return (
			<div>
				<Page>
					<div>Profile</div>
					<Link to='/profile/edit'>Edit</Link>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Navigation active='Profile' />
			</div>
		);
	}
}

Profile.defaultProps = {};

export default withCookies(Profile);
