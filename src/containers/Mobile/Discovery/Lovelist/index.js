import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { Header, Page, Card, Button, Svg, Image, Level } from '@/components/mobile';
import styles from './lovelist.scss';
import * as data from '@/data/example/Lovelist';
import { actions as LoveListActionCreator } from '@/state/v4/Lovelist';
class Lovelist extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listTypeGrid: false,
			listEmpty: true,
			loggedIn: false
		};
	}

	componentWillMount() {
		// const loginStatus = true;
		const loginStatus = (this.props.user.user);
		if (loginStatus) {
			this.setState({ loggedIn: true });
			const userId = 1;
			this.props.dispatch(LoveListActionCreator.getList(this.userCookies, userId));
		// this.props.distpach(new lovelistAction.getList(this.userCookies, this.props.user.user.id));
		}
		
		if (this.props.lovelist.count > 0) {
			this.setState({ listEmpty: false });
		}

		console.log('checking state on will mount: ', this.state);
	}

	componentDidMount() {
		const userId = 1;
		this.props.dispatch(LoveListActionCreator.getList(this.userCookies, userId));
		// this.props.distpach(new lovelistAction.getList(this.userCookies, this.props.user.user.id));
		console.log('checking state on didmount: ', this.state);
	}

	render() {
		const { listTypeGrid } = this.state;
		const HeaderPage = {
			left: (
				<Button className={this.state.loggedIn && !this.state.listEmpty ? null : 'd-none'} onClick={() => this.setState({ listTypeGrid: !listTypeGrid })}>
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

		const renderLovelistPage = (content) => {
			return (
				<div style={this.props.style}>
					<Page>
						{content}
					</Page>
					<Header.Modal {...HeaderPage} />
				</div>
			);
		};

		if (!this.state.loggedIn) {
			return (renderLovelistPage(
				<div style={{ marginTop: '30%', padding: '20px' }} className='text-center --disable-flex'>
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
				{!listTypeGrid ? <Card.Lovelist /> : <Card.LovelistGrid />}
				{!listTypeGrid ? <Card.Lovelist /> : <Card.LovelistGrid />}
				{!listTypeGrid ? <Card.Lovelist /> : <Card.LovelistGrid />}
				{!listTypeGrid ? <Card.Lovelist /> : <Card.LovelistGrid />}
			</div>
		));
	}
}

Lovelist.defaultProps = {
	Lovelist: data.Lovelist

};

const mapStateToProps = (state) => {
	return {
		...state
	};
};

export default withCookies(connect(mapStateToProps)(Lovelist));
