import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import * as data from '@/data/example/Hashtags';

class Hashtags extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		return (
			<div>
				<h1>asdasdsad</h1>
			</div>);
	}
}

Hashtags.defaultProps = {
	Hashtags: data.Hashtags,
	Contents: data.Contents
};


export default withCookies(Hashtags);