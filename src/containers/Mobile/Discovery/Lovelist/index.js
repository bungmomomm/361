import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { Header, Page, Card, Button, Svg, Image, Level } from '@/components/mobile';
import _ from 'lodash';
import styles from './lovelist.scss';
import { actions as LoveListActionCreator } from '@/state/v4/Lovelist';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import Shared from '@/containers/Mobile/Shared';

class Lovelist extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			listTypeGrid: true,
			listEmpty: true,
			loading: true,
			loggedIn: true, // should be adjust when user-login has done... 
			lovedProducts: [],
			notification: {
				show: true
			}
		};

		this.getLovelistCardsContent = this.getLovelistCardsContent.bind(this);
		this.renderLovelistPage = this.renderLovelistPage.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const { count, items } = nextProps.lovelist;
		const { listEmpty } = this.state;
		// checking resources availability
		if (!_.isEmpty(items) && _.isInteger(count) && (count > 0) && listEmpty) {
			const lovedItems = items.map((item, idx) => {
				return {
					brand: item.brand.brand_name,
					images: item.images,
					pricing: item.pricing,
					product_title: item.product_title,
					totalLovelist: 0,
					totalComments: 0
				};
			});

			this.setState({
				listEmpty: false,
				lovedProducts: lovedItems,
				loading: false,
				lovedComponent: lovedItems
			});
		}
	}

	getLovelistCardsContent() {
		const { listTypeGrid, lovedProducts } = this.state;
		const isLoved = true;
		const content = lovedProducts.map((product, idx) => {
			return !listTypeGrid ? <Card.Lovelist isLoved={isLoved} key={idx} data={product} /> : <Card.LovelistGrid key={idx} data={product} />;
		});

		return <div className={styles.cardContainer}>{content}</div>;
	}

	renderLovelistPage(content) {
		const { listTypeGrid } = this.state;
		const HeaderPage = {
			left: (
				<Button className={this.state.loggedIn && !this.state.listEmpty ? null : 'd-none'} onClick={() => this.setState({ listTypeGrid: !listTypeGrid })}>
					<Svg src={listTypeGrid ? 'ico_grid.svg' : 'ico_list.svg'} />
				</Button>
			),
			center: 'Lovelist',
			right: (
				<Link to='/'>
					<Svg src='ico_arrow-back.svg' />
				</Link>
			)
		};
		const { shared } = this.props;
		const foreverBannerData = shared.foreverBanner;
		foreverBannerData.show = this.state.notification.show;
		foreverBannerData.onClose = () => this.setState({ notification: { show: false } });
		return (
			<div style={this.props.style}>
				<Page>
					{
						<ForeverBanner {...foreverBannerData} />
					}
					{content}
				</Page>
				<Header.Modal {...HeaderPage} />
			</div>
		);
	}

	render() {
		const { loading, loggedIn, listEmpty } = this.state;
		if (!loggedIn) {
			return (this.renderLovelistPage(
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

		if (loading) {
			return this.renderLovelistPage(null);
		}

		if (listEmpty) {
			return (this.renderLovelistPage(
				<div className='text-center --disable-flex'>
					<p className='margin--medium'>Lovelist kamu masih kosong</p>
					<p className='margin--medium font--lato-light'>Tekan <Svg width='20px' height='18px' src='ico_love.svg' /> untuk menambahkan
						<br />produk ke Lovelist.
					</p>
					<p className='margin--medium'><Button inline size='large' color='primary'>BELANJA</Button></p>
					<Image local style={{ margin: '0 auto -30px auto' }} alt='Tap the love icon' src='lovelist-guide.png' />
				</div>
			));
		}

		return (this.renderLovelistPage(this.getLovelistCardsContent()));
	}
}

const mapStateToProps = (state) => {
	return {
		lovelist: state.lovelist,
		shared: state.shared
	};
};

const doAfterAnonymous = (props) => {

	const { dispatch, cookies } = props;

	dispatch(LoveListActionCreator.getLovelisItems(cookies.get('user.token')));
};

export default withCookies(connect(mapStateToProps)(Shared(Lovelist, doAfterAnonymous)));
