import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { actions as productActions } from '@/state/v4/Product';
import { actions as commentActions } from '@/state/v4/Comment';
import { Link } from 'react-router-dom';
import { Page, Header, Navigation, Level, Button, Svg, Card, Comment, Image, Radio, Grid } from '@/components/mobile';
import styles from './products.scss';

const DUMMY_PRODUCT = {
	images: [
		{ mobile: 'https://www.wowkeren.com/images/events/ori/2015/03/26/minah-album-i-am-a-woman-too-01.jpg' },
		{ mobile: 'https://www.wowkeren.com/images/events/ori/2015/03/26/minah-album-i-am-a-woman-too-02.jpg' }
	],
	product_title: 'Immaculate Brands of the Year by Yannis Philippakis',
	brand: 'Olivia Von Halle pink print',
	pricing: {
		formatted: {
			effective_price: 'Rp.1000.000',
			base_price: 'Rp.900.000'
		},
		discount: '20%'
	}
};

const DUMMY_PRODUCT_GRID = {
	images: [
		{ mobile: 'https://www.wowkeren.com/images/events/ori/2015/03/26/minah-album-i-am-a-woman-too-01.jpg' },
		{ mobile: 'https://www.wowkeren.com/images/events/ori/2015/03/26/minah-album-i-am-a-woman-too-02.jpg' }
	],
	productTitle: 'Immaculate Brands of the Year by Yannis Philippakis',
	brandName: 'Olivia Von Halle pink print',
	pricing: {
		formatted: {
			effective_price: 'Rp.1000.000',
			base_price: 'Rp.900.000'
		},
		discount: '20%'
	}
};

class Products extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
		this.handleScroll = this.handleScroll.bind(this);
		this.state = {
			size: 's',
			showScrollInfomation: false
		};
	}
	

	componentDidMount() {
		const { dispatch, match } = this.props;
		dispatch(new productActions.productDetailAction(this.userCookies, match.params.id));
		dispatch(new productActions.productRecommendationAction(this.userCookies));
		dispatch(new productActions.productSimilarAction(this.userCookies));
		dispatch(new productActions.productSocialSummaryAction(this.userCookies));
		dispatch(new commentActions.productCommentAction(this.userCookies));
		window.addEventListener('scroll', this.handleScroll, true);
	}
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll, true);
	}

	handleScroll(e) {
		const { showScrollInfomation } = this.state;
		if (e.target.scrollTop > 400 && !showScrollInfomation) {
			this.setState({ showScrollInfomation: true });
		}
		if (e.target.scrollTop < 400 && showScrollInfomation) {
			this.setState({ showScrollInfomation: false });
		}
	}

	addComment() {
		const { dispatch } = this.props;
		dispatch(new commentActions.commentAddAction(this.userCookies));		
	}

	renderHeaderPage() {
		if (this.state.showScrollInfomation) {
			return {
				left: (
					<a href={history.go - 1}>
						<Svg src={'ico_arrow-back-left.svg'} />
					</a>
				),
				center: <div style={{ width: '220px', margin: '0 auto' }} className='text-elipsis --disable-flex'>{DUMMY_PRODUCT.product_title}</div>,
				right: (
					<a href={'/'} onClick={this.switchMode}>
						<Svg src={'ico_share.svg'} />
					</a>
				)
			};
		}
		return {
			left: (
				<a href={history.go - 1}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</a>
			),
			center: '',
			right: (
				<a href={'/'} onClick={this.switchMode}>
					<Svg src={'ico_share.svg'} />
				</a>
			)
		};
	}

	renderStickyAction() {
		if (this.state.showScrollInfomation) {
			return (
				<div className={styles.stickyAction}>
					<Level style={{ padding: '10px' }} className='flex-center'>
						<Level.Left>
							<div className={styles.stickyActionImage}>
								<img alt='product' src='https://www.wowkeren.com/images/events/ori/2015/03/26/minah-album-i-am-a-woman-too-01.jpg' />
							</div>
						</Level.Left>
						<Level.Item className='padding--medium'>
							<div className='font-normal'>Rp1.199.000</div>
							<div className='font-small font-color--primary-ext-2'>Rp999.000</div>
						</Level.Item>
						<Level.Right>
							<Button color='secondary' size='medium'>BELI AJA</Button>
						</Level.Right>
					</Level>
				</div>
			);
		};
		return null;
	}

	render() {
		const { showScrollInfomation } = this.state;
		return (
			<div>
				<Page>
					<div style={{ marginTop: '-60px', marginBottom: '70px' }}>
						<Card.Lovelist data={DUMMY_PRODUCT} />
						<Level style={{ borderBottom: '1px solid #D8D8D8', borderTop: '1px solid #D8D8D8' }}>
							<Level.Left className='flex-center'>
								<Svg src='ico_ovo.svg' />
							</Level.Left>
							<Level.Item>
								<div style={{ marginLeft: '15px' }} className='padding--small'>Point: 300.000</div>
							</Level.Item>
							<Level.Right>
								<Button>
									<Svg src='ico_warning.svg' />
								</Button>
							</Level.Right>
						</Level>
						<div className='flex-center margin--large'>
							<Radio 
								name='size'
								checked={this.state.size}
								style={{ marginBottom: '10px' }}
								onChange={(e) => this.setState({ size: e })} 
								data={[
									{ label: 'xs', value: 'xs', disabled: true },
									{ label: 's', value: 's' },
									{ label: 'm', value: 'm' },
									{ label: 'l', value: 'l' },
									{ label: 'xl', value: 'xl' },
									{ label: '2xl', value: '2xl' }
								]}
							/>
							<p className='font-color--red font-small'>Stock Habis</p>
							<p className='text-center margin--medium'>Panduan Ukuran</p>
						</div>
						<p className='margin--small padding--medium'>
							lydoaharyantho and 287 others love this
							DELLOVISIMO Dress, red, premium cotton, bust 88 and length 94, ready to ship 3 Jan 2018.
						</p>
						<span className='margin--small padding--medium'>
							<a>#jualbajubangkok</a> <a>#supplierbangkok</a> <a>#pobkkfirsthand</a> <a>#pobkk</a> <a>#pohk</a> <a>#grosirbaju</a> <a>#premiumquaity</a> <a>#readytowear</a> <a>#ootdindo</a> <a>#olshop</a> <a>#trustedseller</a> <a>#supplierbaju</a> <a>#pochina</a>
						</span>
						<div className='margin--medium --disable-flex padding--medium'>
							<Button className='font--lato-normal font-color--primary-ext-2'>View 38 comments</Button>
						</div>
						<hr className='margin--small' />
						<div className='margin--small padding--medium font-medium'>Shop the Look</div>
						<div className='flex-row'>
							<Card.CatalogGrid {...DUMMY_PRODUCT_GRID} />
							<Card.CatalogGrid {...DUMMY_PRODUCT_GRID} />
						</div>
						<div style={{ backgroundColor: '#F5F5F5' }}>
							<div className='padding--small' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
								<div className='margin--medium'>
									<div className='padding--small flex-row flex-spaceBetween'>
										<div className='font-medium'>Ulasan</div>
										<Link className='font-color--primary-ext-2' to='/'><span style={{ marginRight: '5px' }} >See All</span> <Svg src='ico_chevron-right.svg' /></Link>
									</div>
									<Comment type='review' />
									<Comment type='review' />
									<Comment type='review' />
								</div>
							</div>
							<div className='padding--small' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
								<div className='margin--medium'>
									<div className='padding--small flex-row flex-spaceBetween'>
										<div className='padding--small'>
											<Image avatar width={60} height={60} src='http://coolspotters.com/files/photos/323634/zara-profile.jpg?1357481236' />
										</div>
										<Level>
											<Level.Item className='text-center padding--large'>
												<div className='font-large'>4.5</div>
												<div className='font-small font-color--primary-ext-2'>Reviews</div>
											</Level.Item>
											<Level.Item className='text-center'>
												<div className='font-large'>90</div>
												<div className='font-small font-color--primary-ext-2'>Products</div>
											</Level.Item>
										</Level>
									</div>
									<div className='padding--medium margin--small'>
										<div className='font-medium'>Bitter Ballen Ball</div>
										<div className='font-small'>Jakarta Selatan</div>
									</div>
									<div className='margin--medium'>
										<Grid split={4} className='padding--small'> 
											<div className='padding--normal'><Image src='https://cms.souqcdn.com/spring/cms/en/ae/2017_LP/women-clothing/images/women-clothing-skirts.jpg' /></div>
											<div className='padding--normal'><Image src='https://cms.souqcdn.com/spring/cms/en/ae/2017_LP/women-clothing/images/women-clothing-skirts.jpg' /></div>
											<div className='padding--normal'><Image src='https://cms.souqcdn.com/spring/cms/en/ae/2017_LP/women-clothing/images/women-clothing-skirts.jpg' /></div>
											<div className='padding--normal'>
												<Image src='https://cms.souqcdn.com/spring/cms/en/ae/2017_LP/women-clothing/images/women-clothing-skirts.jpg' />
												<div className={styles.seeAll}>
													SEE ALL
												</div>
											</div>
										</Grid>
									</div>
								</div>
							</div>
							<div className='padding--small' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
								<div className='margin--small padding--medium font-medium'>Similar Items</div>
								<div className='flex-row'>
									<Card.CatalogGrid {...DUMMY_PRODUCT_GRID} />
									<Card.CatalogGrid {...DUMMY_PRODUCT_GRID} />
								</div>
							</div>
						</div>
					</div>
					{this.renderStickyAction()}
				</Page>
				<Header.Modal style={!showScrollInfomation ? { backgroundColor: 'transparent', border: 'none', boxShadow: 'none' } : {}} {...this.renderHeaderPage()} />
				<Navigation />
			</div>);
	}
}

const mapStateToProps = (state) => {
	return {
		...state
	};
};

export default withCookies(connect(mapStateToProps)(Products));
