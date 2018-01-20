import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import * as data from '@/data/example/Hashtags';

class HashtagsDetails extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		return (
			<div>
				<h1>asdad</h1>
			</div>);
	}
}

HashtagsDetails.defaultProps = {
	HashtagsDetails: data.HashtagsDetails
};


export default withCookies(HashtagsDetails);
