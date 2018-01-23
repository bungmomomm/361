import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Header, Page, Card, Button, Svg, Image, Level } from '@/components/mobile';
import styles from './lovelist.scss';
import * as data from '@/data/example/Lovelist';

class Lovelist extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listTypeGrid: false,
			listEmpty: false,
			loggedIn: false
		};
	}

	render() {
		const type = this.state.listTypeGrid ? 'grid' : 'list';

		const renderLovelistPage = (content) => {
			return (
				<div style={this.props.style}>
					<Header.Lovelist
						listType={this.state.loggedIn && !this.state.listEmpty}
						listTypeGrid={this.state.listTypeGrid}
						toggleGrid={() => this.setState({ listTypeGrid: !this.state.listTypeGrid })}
					/>
					<Page>
						{content}
					</Page>
				</div>
			);
		};
		if (!this.state.loggedIn) {
			return (renderLovelistPage(
				<div style={{ marginTop: '60px', padding: '20px' }} className='text-center --disable-flex'>
					<Svg src='ico_ghost.svg' />
					<p className='margin--medium'>Unlock the Full Experience</p>
					<Level className='margin--medium'>
						<Level.Left>&nbsp;</Level.Left>
						<Level.Item>
							<p className='margin--small'><Button wide size='large' color='primary'>LOGIN</Button></p>
							<p className='margin--small'><Button wide outline size='large' color='primary'>DAFTAR</Button></p>
						</Level.Item>
						<Level.Right>&nbsp;</Level.Right>
					</Level>
				</div>
			));
		}
		if (this.state.listEmpty) {
			return (renderLovelistPage(
				<div className='text-center --disable-flex'>
					<p className='margin--medium'>Kamu belum memiliki Lovelist</p>
					<p className='margin--medium font--lato-light'>Tap the <Svg src='ico_love.svg' /> next to an item to add
						<br />it to your Lovelist.
					</p>
					<p className='margin--medium'><Button inline size='large' color='primary'>BELANJA</Button></p>
					<Image local style={{ marginBottom: '-30px' }} alt='Tap the love icon' src='lovelist-guide.png' />
				</div>
			));
		}
		return (renderLovelistPage(
			<div className={styles.cardContainer}>
				<Card type={type} />
				<Card type={type} />
				<Card type={type} />
				<Card type={type} />
				<Card type={type} />
			</div>
		));
	}
}

Lovelist.defaultProps = {
	Lovelist: data.Lovelist

};

export default withCookies(Lovelist);
