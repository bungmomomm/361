import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Page, Link } from '@/components/mobile';

class UserProfileEdit extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		return (
			<Page>
				<div>Edit Profile</div>
				<Link to='/profile'>Back</Link>
			</Page>
		);
	}
}

UserProfileEdit.defaultProps = {};

export default withCookies(UserProfileEdit);
