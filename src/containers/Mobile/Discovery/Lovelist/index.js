import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { Header, Page, Card, Button, Svg, Image } from '@/components/mobile';
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
		const { listTypeGrid } = this.state;
		const HeaderPage = {
			left: (
				<Button onClick={() => this.setState({ listTypeGrid: !listTypeGrid })}>
					<Svg src={!listTypeGrid ? 'ico_grid.svg' : 'ico_list.svg'} />
				</Button>
			), 
			center: 'Lovelist',
			right: (
				<Link to='/'>
					<Svg src='ico_arrow-back.svg' />
				</Link>
			)
		};

		return (
			<div style={this.props.style}>
				<Header.Lovelist listTypeGrid={this.state.listTypeGrid} toggleGrid={() => this.setState({ listTypeGrid: !this.state.listTypeGrid })} />
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
						<div className={styles.cardContainer}>
							{!listTypeGrid ? <Card.Lovelist /> : <Card.LovelistGrid />}
							{!listTypeGrid ? <Card.Lovelist /> : <Card.LovelistGrid />}
							{!listTypeGrid ? <Card.Lovelist /> : <Card.LovelistGrid />}
							{!listTypeGrid ? <Card.Lovelist /> : <Card.LovelistGrid />}
						</div>
						)
					}
				</Page>
				<Header.Modal {...HeaderPage} />
			</div>
		);
	}
}

Lovelist.defaultProps = {
	Lovelist: data.Lovelist

};

export default withCookies(Lovelist);
