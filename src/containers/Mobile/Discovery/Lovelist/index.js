import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import * as data from '@/data/example/Lovelist';

class Lovelist extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		return (
			<div>
				<h1>{JSON.stringify(data.Lovelist)}</h1>
			</div>);
	}
}

Lovelist.defaultProps = {
	Lovelist: data.Lovelist

};


export default withCookies(Lovelist);
