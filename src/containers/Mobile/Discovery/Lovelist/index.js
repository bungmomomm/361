import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Header, Page, Card } from '@/components/mobile';
import styles from './lovelist.scss';
import * as data from '@/data/example/Lovelist';

class Lovelist extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listTypeGrid: false
		};
	}

	render() {
		const type = this.state.listTypeGrid ? 'grid' : 'list';

		return (
			<div style={this.props.style}>
				<Page>
					<div className={styles.cardContainer}>
						<Card type={type} />
						<Card type={type} />
						<Card type={type} />
						<Card type={type} />
						<Card type={type} />
					</div>
				</Page>
				<Header.Lovelist listTypeGrid={this.state.listTypeGrid} toggleGrid={() => this.setState({ listTypeGrid: !this.state.listTypeGrid })} />
			</div>
		);
	}
}

Lovelist.defaultProps = {
	Lovelist: data.Lovelist

};


export default withCookies(Lovelist);
