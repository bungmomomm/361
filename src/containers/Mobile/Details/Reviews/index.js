import React, { Component } from 'react';
import { withCookies } from 'react-cookie';

class Reviews extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		return (
			<div>
				<h1>{this.props.Data}</h1>
			</div>);
	}
}

Reviews.defaultProps = {
	Home: 'hallo',
	Data: 'akjsdaskdjasldjsaldjalskdj'

};


export default withCookies(Reviews);
