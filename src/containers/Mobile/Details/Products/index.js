import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { actions as productActions } from '@/state/v4/Product';
import { actions as commentActions } from '@/state/v4/Comment';
import { actions as lovelistActions } from '@/state/v4/Lovelist';
import { Link } from 'react-router-dom';
import { Page, Header, Navigation, Level, Button, Svg, Card, Comment, Image, Radio, Grid, Carousel } from '@/components/mobile';
import styles from './products.scss';
import _ from 'lodash';

class Products extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');

		this.handleScroll = this.handleScroll.bind(this);
		this.handleLovelistClick = this.handleLovelistClick.bind(this);
		this.handleImageItemClick = this.handleImageItemClick.bind(this);
		this.setCarouselSlideIndex = this.setCarouselSlideIndex.bind(this);


		this.state = {
			size: 's',
			status: {
				showScrollInfomation: false,
				loading: true,
				isLoved: false,
				isZoomed: false,
				pdpDataHasLoaded: false,
			},
			pdpData: {
				cardProduct: false,
				similarItems: 'loading content',
				reviewItems: 'loading content'
			},
			detail: {},
			carousel: {
				slideIndex: 0
			}
		};
	}

	componentDidMount() {
		const { dispatch, match } = this.props;
		const productId = match.params.id;
		const token = this.userCookies;
		dispatch(new productActions.productDetailAction(token, productId));
		dispatch(new productActions.productRecommendationAction(token));
		dispatch(new productActions.productSimilarAction(token));
		dispatch(new productActions.productSocialSummaryAction(token, productId));
		dispatch(new commentActions.productCommentAction(token, productId));
		window.addEventListener('scroll', this.handleScroll, true);
	}

	componentWillReceiveProps(nextProps) {
		const { detail, similar, reviews } = nextProps.product;
		const { status } = this.state;
		
		if (!_.isEmpty(detail) && !_.isEmpty(similar) && !_.isEmpty(reviews) && !status.pdpDataHasLoaded) {
			const cardProduct = productActions.getProductCardData(detail);
			const similarItems = similar.map((item, idx) => {
				const data = {
					productTitle: item.product_title,
					brandName: item.brand,
					pricing: item.pricing,
					images: item.images
				};
				return <Card.CatalogGrid {...data} key={idx} />;
			});

			const reviewItems = reviews.summary.map((item, idx) => {
				return <Comment key={idx} type='review' data={item} />;
			});

			this.setState({
				loading: false,
				detail,
				status: {
					pdpDataHasLoaded: true,
				},
				pdpData: {
					cardProduct,
					similarItems,
					reviewItems
				}
			});
		}
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll, true);
	}

	setCarouselSlideIndex(index) {
		this.setState({
			carousel: {
				slideIndex: index || 0
			}
		});
	}

	handleScroll(e) {
		const { status } = this.state;
		if (e.target.scrollTop > 400 && !status.showScrollInfomation) {
			this.setState({ showScrollInfomation: true });
		}
		if (e.target.scrollTop < 400 && status.showScrollInfomation) {
			this.setState({ showScrollInfomation: false });
		}
	}

	addComment() {
		const { dispatch } = this.props;
		dispatch(new commentActions.commentAddAction(this.userCookies));
	}

	handleLovelistClick(e) {
		const { dispatch, match } = this.props;
		const { pdpData } = this.state;
		let { isLoved } = this.state.status;
 
		if (!isLoved) {
			isLoved = true;
			pdpData.cardProduct.lovelistTotal += 1;
			dispatch(lovelistActions.addToLovelist(this.userCookies, 1, match.params.id));
		} else {
			isLoved = false;
			pdpData.cardProduct.lovelistTotal -= 1;
			dispatch(lovelistActions.removeFromLovelist(this.userCookies, 1, match.params.id));
		}

		this.setState({ status: { isLoved }, pdpData });
	}

	handleImageItemClick() {
		this.setState({ status: { isZoomed: true } });
	}

	renderZoomImage() {
		const { carousel, pdpData } = this.state;
		const header = {
			left: (
				<Button onClick={() => this.setState({ status: { isZoomed: false } })} >
					<Svg src={'ico_close-large.svg'} />
				</Button>
			),
			center: '',
			right: ''
		};

		return (
			<div>
				<Carousel
					slideIndex={carousel.slideIndex}
					afterSlide={newSlideIndex => this.setCarouselSlideIndex(newSlideIndex)}
				>
					{
						pdpData.cardProduct.images.map((image, idx) => (
							<div tabIndex='0' role='button' onClick={this.props.onImageItemClick} key={idx} data-img={image.mobile}>
								<Image src={image.mobile} alt='product' />
							</div>
						))
					}
				</Carousel>
				<Header.Modal style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }} {...header} />
			</div>
		);
	}

	renderHeaderPage() {
		const { pdpData, status } = this.state;
		if (status.showScrollInfomation) {
			return {
				left: (
					<a href={history.go - 1}>
						<Svg src={'ico_arrow-back-left.svg'} />
					</a>
				),
				center: <div style={{ width: '220px', margin: '0 auto' }} className='text-elipsis --disable-flex'>{pdpData.cardProduct.product_title}</div>,
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
		const { pdpData, status, detail } = this.state;
		if (status.showScrollInfomation && !status.loading) {
			return (
				<div className={styles.stickyAction}>
					<Level style={{ padding: '10px' }} className='flex-center'>
						<Level.Left>
							<div className={styles.stickyActionImage}>
								<img alt='product' src={detail.images[0].thumbnail} />
							</div>
						</Level.Left>
						<Level.Item className='padding--medium'>
							<div className='font-normal'>{pdpData.cardProduct.pricing.formatted.effective_price}</div>
							<div className='font-small font-color--primary-ext-2'>{pdpData.cardProduct.pricing.formatted.base_price}</div>
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
		const { showScrollInfomation, detail, pdpData, status, carousel } = this.state;
		const { match, history } = this.props;

		if (status.loading) {
			return <div>Please wait, loading content...</div>;
		}

		if (status.isZoomed) {
			return this.renderZoomImage();
		}

		return (
			<div>
				<Page>
					<div style={{ marginTop: '-60px', marginBottom: '70px' }}>
						<Card.Lovelist 
							setCarouselSlideIndex={this.setCarouselSlideIndex}
							slideIndex={carousel.slideIndex}
							onImageItemClick={this.handleImageItemClick}
							data={pdpData.cardProduct}
							isLoved={status.isLoved}
							onBtnLovelistClick={this.handleLovelistClick} 
							onBtnCommentClick={(e) => (history.push(`/product/comments/${match.params.id}`))}
						/>
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
						<p className='margin--small padding--medium'>{detail.description}</p>
						<span className='margin--small padding--medium'>
							<a>#jualbajubangkok</a> <a>#supplierbangkok</a> <a>#pobkkfirsthand</a> <a>#pobkk</a> <a>#pohk</a> <a>#grosirbaju</a> <a>#premiumquaity</a> <a>#readytowear</a> <a>#ootdindo</a> <a>#olshop</a> <a>#trustedseller</a> <a>#supplierbaju</a> <a>#pochina</a>
						</span>
						<div className='margin--medium --disable-flex padding--medium'>
							<Link to={`/product/comments/${match.params.id}`}>
								<Button className='font--lato-normal font-color--primary-ext-2'>
									Lihat semua 38 komentar
								</Button>
							</Link>
						</div>
						<hr className='margin--small' />
						<div className='margin--small padding--medium font-medium'>Shop the Look</div>
						<div className='flex-row'>
							{pdpData.similarItems}
						</div>
						<div style={{ backgroundColor: '#F5F5F5' }}>
							<div className='padding--small' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
								<div className='margin--medium'>
									<div className='padding--small flex-row flex-spaceBetween'>
										<div className='font-medium'>Penilaian Produk</div>
										<Link className='font-color--primary-ext-2' to='/'><span style={{ marginRight: '5px' }} >LIHAT SEMUA</span> <Svg src='ico_chevron-right.svg' /></Link>
									</div>
									{pdpData.reviewItems}
								</div>
							</div>
							<div className='padding--small' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
								<div className='margin--medium'>
									<div className='padding--small flex-row flex-spaceBetween'>
										<div className='padding--small'>
											<Image avatar width={60} height={60} src={detail.seller.seller_logo} />
										</div>
										<Level>
											<Level.Item className='text-center padding--large'>
												<div className='font-large'>4.5</div>
												<div className='font-small font-color--primary-ext-2'>Ulasan</div>
											</Level.Item>
											<Level.Item className='text-center'>
												<div className='font-large'>90</div>
												<div className='font-small font-color--primary-ext-2'>Produk</div>
											</Level.Item>
										</Level>
									</div>
									<div className='padding--medium margin--small'>
										<div className='font-medium'>{detail.seller.seller}</div>
										<div className='font-small'>{detail.seller.seller_location}</div>
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
								<div className='margin--small padding--medium font-medium'>Produk Serupa</div>
								<div className='flex-row'>
									{pdpData.similarItems}
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
		product: state.product, 
		shared: state.shared
	};
};

export default withCookies(connect(mapStateToProps)(Products));
