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
			loggedIn: false,
			products: [],
			notification: {
				show: true
			}
		};

		this.getLovelistCardsContent = this.getLovelistCardsContent.bind(this);
		this.renderLovelistPage = this.renderLovelistPage.bind(this);
	}

	componentWillMount() {
		// const { users } = this.props;
		// const loginStatus = (users.username && !users.isAnonymous);
		const loginStatus = true;

		this.setState({ loggedIn: loginStatus });

		if (this.props.lovelist.count > 0) {
			this.setState({ listEmpty: false });
		}
	}

	componentDidMount() {
		// fetching lovelist items
		this.fetchLovelistItems();
	}

	getLovelistCardsContent() {
		const { listTypeGrid } = this.state;
		const content = this.state.products.map((product, idx) => {
			return !listTypeGrid ? <Card.Lovelist key={idx} data={product} /> : <Card.LovelistGrid key={idx} data={product} />;
		});

		return <div className={styles.cardContainer}>{content}</div>;
	}

	fetchLovelistItems() {
		// fetching data from server
		const { shared } = this.props;

		const loveListService = _.chain(shared).get('serviceUrl.lovelist').value() || false;

		const req = LoveListActionCreator.getLovelisItems(this.userCookies, loveListService);
		const { dispatch } = this.props;
		dispatch(LoveListActionCreator.setLoadingState({ loading: true }));
		req.then(response => {
			this.setState({
				listEmpty: false,
				products: response.data.data.products
			});
			dispatch(LoveListActionCreator.getList(response.data.data));
			dispatch(LoveListActionCreator.setLoadingState({ loading: false }));
		});
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
		if (!this.state.loggedIn) {
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

		if (this.props.lovelist.loading) {
			return this.renderLovelistPage('');
		}

		if (this.state.listEmpty) {
			return (this.renderLovelistPage(
				<div className='text-center --disable-flex'>
					<p className='margin--medium'>Kamu belum memiliki Lovelist</p>
					<p className='margin--medium font--lato-light'>Tap the <Svg width='20px' height='18px' src='ico_love.svg' /> next to an item to add
						<br />it to your Lovelist.
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

export default withCookies(connect(mapStateToProps)(Shared(Lovelist)));
