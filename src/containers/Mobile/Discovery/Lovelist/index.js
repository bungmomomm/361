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
			status: {
				listTypeGrid: true,
				listEmpty: true,
				loading: true,
				loggedIn: true, // should be adjust when user-login has done...,
				isBulkSet: false
			},
			notification: {
				show: true
			}
		};

		this.getLovelistCardsContent = this.getLovelistCardsContent.bind(this);
		this.renderLovelistPage = this.renderLovelistPage.bind(this);
		this.handleLovelistClicked = this.handleLovelistClicked.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const { loading, count, items, bulkieCountProducts } = nextProps.lovelist;
		const { status } = this.state;
		const { cookies, dispatch } = this.props;

		// checking resources availability
		if (!_.isEmpty(items.list) && count > 0 && status.listEmpty) {
			// gets number of total lovelist of each product item
			dispatch(LoveListActionCreator.bulkieCountByProduct(cookies.get('user.token'), items.ids));
			// updates listEmpty state
			status.listEmpty = false;
		}

		if (!_.isEmpty(bulkieCountProducts) && !status.isBulkSet) {
			status.isBulkSet = true;
			// updates total lovelist each product item
			items.list = items.list.map((item, idx) => {
				const productFound = dispatch(LoveListActionCreator.getProductBulk(item.original.product_id));
				if (productFound) item.totalLovelist = productFound.total;
				return item;
			});

			dispatch(new LoveListActionCreator.getList(items, false));
		}

		status.loading = loading;
		this.setState({ status });
	}

	getLovelistCardsContent() {
		const { items } = this.props.lovelist;
		const isLoved = true;
		const content = items.list.map((product, idx) => {
			return !this.state.status.listTypeGrid ? 
				(<Card.Lovelist 
					isLoved={isLoved} 
					key={idx} 
					data={product}
					onBtnLovelistClick={this.handleLovelistClicked} 
				/>) : 
				(<Card.LovelistGrid 
					key={idx} 
					data={product} 
					isLoved={isLoved}
					onBtnLovelistClick={() => this.handleLovelistClicked(product)} 
				/>);
		});

		return <div className={styles.cardContainer}>{content}</div>;
	}

	handleLovelistClicked(product) {
		const { dispatch } = this.props;
		const { ids, list } = this.props.lovelist.items;
		const { id } = product;

		const idx = ids.indexOf(id);

		if (idx > -1) {

			// removes item from lovelist list
			dispatch(LoveListActionCreator.removeFromLovelist(this.userCookies, id));
			list.splice(idx, 1);
			ids.splice(idx, 1);
			
			// updates state if Lovelist list is empty
			if (ids.length === 0) {
				const { status } = this.state;
				status.listEmpty = true;
				this.setState({ status });
			}

			// updating lovelist items props
			dispatch(new LoveListActionCreator.getList({ ids, list }, false));
		}
	}

	renderLovelistPage(content) {
		const { status } = this.state;
		const HeaderPage = {
			left: (
				<Button 
					className={status.loggedIn && !status.listEmpty ? null : 'd-none'} 
					onClick={() => {
						status.listTypeGrid = (!status.listTypeGrid);
						this.setState({ status });
					}}
				>
					<Svg src={status.listTypeGrid ? 'ico_grid.svg' : 'ico_list.svg'} />
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
					{ <ForeverBanner {...foreverBannerData} /> }
					{content}
				</Page>
				<Header.Modal {...HeaderPage} />
			</div>
		);
	}

	render() {
		const { status } = this.state;
		if (!status.loggedIn) {
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

		if (status.loading) {
			return this.renderLovelistPage(<h3>Please wait loading content...</h3>);
		}

		if (status.listEmpty) {
			return (this.renderLovelistPage(
				<div className='text-center --disable-flex'>
					<p className='margin--medium'>Lovelist kamu masih kosong</p>
					<p className='margin--medium font--lato-light'>Tekan <Svg width='20px' height='18px' src='ico_love.svg' /> untuk menambahkan
						<br />produk ke Lovelist.
					</p>
					<p className='margin--medium'><Button inline size='large' color='secondary'>BELANJA</Button></p>
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
