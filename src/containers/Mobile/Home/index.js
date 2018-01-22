import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import Carousel from 'nuka-carousel';
import { Header, Tabs, Page, Level, Button, Grid, Article, Navigation, Svg, Image } from '@/components/mobile';
import styles from './home.scss';
import { actions } from '@/state/v4/Home';

class Home extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			current: 'wanita'
		};
		this.mainNavCategories = [
			{ id: 'wanita', title: 'Wanita' },
			{ id: 'pria', title: 'Pria' },
			{ id: 'anak-anak', title: 'Anak-Anak' }
		];
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
	}

	componentDidMount() {
		this.slider.refs.frame.style.height = '500px';
		console.log(this.props);
		const { dispatch } = this.props;
		dispatch(new actions.initAction({
			token: this.userCookies
		})).then((response) => {
			console.log(response);
		}).catch(error => {
			console.log(error.response.data.code);
		});
	}

	handlePick(current) {
		this.setState({ current });
	}


	render() {
		const renderSectionHeader = (title, options) => {
			return (
				<Level>
					<Level.Left><div className={styles.headline}>{title}</div></Level.Left>
					<Level.Right><Link to={options.url || '/'} className={styles.readmore}>{options ? options.title : 'Lihat Semua'}<Svg src='ico_arrow_right_small.svg' /></Link></Level.Right>
				</Level>
			);
		};

		return (
			<div style={this.props.style}>
				<Page>
					<Tabs
						current={this.state.current}
						variants={this.mainNavCategories}
						onPick={(e) => this.handlePick(e)}
					/>
					<Carousel dragging ref={(n) => { this.slider = n; }}>
						<Image local alt='slide' src='temp/banner.jpg' />
						<Image local alt='slide' src='temp/banner.jpg' />
						<Image local alt='slide' src='temp/banner.jpg' />
					</Carousel>
					{renderSectionHeader('#MauGayaItuGampang', { title: 'See all', url: 'http://www.google.com' })}
					<Grid split={3}>
						<div><Image lazyload local alt='thumbnail' src='temp/thumb-1.jpg' /></div>
						<div><Image lazyload local alt='thumbnail' src='temp/thumb-2.jpg' /></div>
						<div><Image lazyload local alt='thumbnail' src='temp/thumb-3.jpg' /></div>
					</Grid>
					<div className='margin--medium'>
						<Image local lazyload alt='banner' src='temp/banner-react-1.jpg' />
						<Image local lazyload alt='banner' src='temp/banner-react-2.jpg' />
					</div>
					{renderSectionHeader('New Arrival', { title: 'See all', url: 'http://www.google.com' })}
					<Grid split={3}>
						<div>
							<Image local lazyload alt='thumbnail' src='temp/thumb-2-1.jpg' />
							<Button className={styles.btnThumbnail} transparent color='secondary' size='small'>Rp. 1.000.000</Button>
						</div>
						<div>
							<Image local lazyload alt='thumbnail' src='temp/thumb-2-2.jpg' />
							<Button className={styles.btnThumbnail} transparent color='secondary' size='small'>Rp. 1.000.000</Button>
						</div>
						<div>
							<Image local lazyload alt='thumbnail' src='temp/thumb-2-3.jpg' />
							<Button className={styles.btnThumbnail} transparent color='primary' outline size='small'>Rp. 1.000.000</Button>
						</div>
					</Grid>
					<div className='margin--medium'>
						<Image local lazyload alt='banner' src='temp/banner-landscape-1.jpg' />
						<Image local lazyload alt='banner' src='temp/banner-landscape-2.jpg' />
					</div>
					{renderSectionHeader('Best Seller', { title: 'See all', url: 'http://www.google.com' })}
					<Grid split={3}>
						<div>
							<Image local lazyload alt='thumbnail' src='temp/thumb-2-1.jpg' />
							<Button className={styles.btnThumbnail} transparent color='secondary' size='small'>Rp. 1.000.000</Button>
						</div>
						<div>
							<Image local lazyload alt='thumbnail' src='temp/thumb-2-2.jpg' />
							<Button className={styles.btnThumbnail} transparent color='secondary' size='small'>Rp. 1.000.000</Button>
						</div>
						<div>
							<Image local lazyload alt='thumbnail' src='temp/thumb-2-3.jpg' />
							<Button className={styles.btnThumbnail} transparent color='primary' outline size='small'>Rp. 1.000.000</Button>
						</div>
					</Grid>
					<div className='margin--medium'>
						<Image local lazyload alt='banner' src='temp/banner-landscape-1.jpg' />
						<Image local lazyload alt='banner' src='temp/banner-landscape-2.jpg' />
					</div>
					{renderSectionHeader('Featured Brands', { title: 'See all', url: 'http://www.google.com' })}
					<Grid split={3}>
						<div>
							<Image lazyload alt='thumbnail' src='https://i.pinimg.com/originals/76/1d/c8/761dc83ce2eed1757bbe27f7adb672c2.png' />
						</div>
						<div>
							<Image lazyload alt='thumbnail' src='https://i.pinimg.com/originals/76/1d/c8/761dc83ce2eed1757bbe27f7adb672c2.png' />
						</div>
						<div>
							<Image lazyload alt='thumbnail' src='https://i.pinimg.com/originals/76/1d/c8/761dc83ce2eed1757bbe27f7adb672c2.png' />
						</div>
						<div>
							<Image lazyload alt='thumbnail' src='https://i.pinimg.com/originals/76/1d/c8/761dc83ce2eed1757bbe27f7adb672c2.png' />
						</div>
						<div>
							<Image lazyload alt='thumbnail' src='https://i.pinimg.com/originals/76/1d/c8/761dc83ce2eed1757bbe27f7adb672c2.png' />
						</div>
						<div>
							<Image lazyload alt='thumbnail' src='https://i.pinimg.com/originals/76/1d/c8/761dc83ce2eed1757bbe27f7adb672c2.png' />
						</div>
					</Grid>
					{renderSectionHeader('Mozaic Megazine', { title: 'See all', url: 'http://www.google.com' })}
					<Article />
				</Page>
				<Header />
				<Navigation>
					<Navigation.Item
						to='/'
						icon='ico_home.svg'
						label='Home'
					/>
					<Navigation.Item
						to='/'
						icon='ico_categories.svg'
						label='categories'
					/>
					<Navigation.Item
						to='/'
						icon='ico_cart.svg'
						label='Shopping Bag'
					/>
					<Navigation.Item
						to='/'
						icon='ico_promo.svg'
						label='Promo'
					/>
					<Navigation.Item
						to='/'
						icon='ico_user.svg'
						label='Profile'
					/>
				</Navigation>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	console.log(state);
	return {
		...state
	};
};

export default withCookies(connect(mapStateToProps)(Home));