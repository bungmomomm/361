import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Header, Page, Card } from '@/components/mobile';
import * as data from '@/data/example/Lovelist';

class Lovelist extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shown: false
		};
	}
	componentDidMount() {

	}

	render() {
		return (
			<div style={this.props.style}>
				<Page>
					<Card />
					<Card />
					<Card />
					<Card />
					<Card />
				</Page>
				<Header.Lovelist />
			</div>
		);
	}
}

Lovelist.defaultProps = {
	Lovelist: data.Lovelist

};


export default withCookies(Lovelist);
