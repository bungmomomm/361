import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Header, Page, Card, Button, Svg, Image } from '@/components/mobile';
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
				<Header.Lovelist />
				<Page>
					{ data.Lovelist.products.length > 0 ? (
						<div className='text-center --disable-flex'>
							<p className='margin--medium'>Kamu belum memiliki Lovelist</p>
							<p className='margin--medium font--lato-light'>Tap the <Svg src='ico_love.svg' /> next to an item to add
								<br />it to your Lovelist.
							</p>
							<p className='margin--medium'><Button inline size='large' color='primary'>BELANJA</Button></p>
							<Image local style={{ marginBottom: '-30px' }} alt='Tap the love icon' src='lovelist-guide.png' />
						</div>
					) : (
						<div>
							<Card />
							<Card />
							<Card />
							<Card />
						</div>
						)
					}

				</Page>
			</div>
		);
	}
}

Lovelist.defaultProps = {
	Lovelist: data.Lovelist

};

export default withCookies(Lovelist);
