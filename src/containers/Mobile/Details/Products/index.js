import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { urlBuilder } from '@/utils';
import { actions as productActions } from '@/state/v4/Product';
import { actions as lovelistActions } from '@/state/v4/Lovelist';
import { actions as shopBagActions } from '@/state/v4/ShopBag';
import { Modal, Page, Header, Level, Button, Svg, Card, Comment, Image, Radio, Grid, Carousel, Rating, Spinner, Badge } from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import styles from './products.scss';
import SellerProfile from '../../Discovery/Seller/components/SellerProfile';
import { Promise } from 'es6-promise';

class Products extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
		this.isLogin = this.props.cookies.get('isLogin');
		this.defaultCount = 1;

		this.closeZoomImage = this.closeZoomImage.bind(this);
		this.goBackPreviousPage = this.goBackPreviousPage.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.handleLovelistClick = this.handleLovelistClick.bind(this);
		this.handleImageItemClick = this.handleImageItemClick.bind(this);
		this.handleCloseModalPopUp = this.handleCloseModalPopUp.bind(this);
		this.handleBtnBeliClicked = this.handleBtnBeliClicked.bind(this);
		this.handleSelectVariant = this.handleSelectVariant.bind(this);
		this.redirectToComments = this.redirectToComments.bind(this);
		this.removeAddItem = this.removeAddItem.bind(this);
		this.setCarouselSlideIndex = this.setCarouselSlideIndex.bind(this);

		this.state = {
			size: '',
			status: {
				showScrollInfomation: false,
				isLoved: false,
				isZoomed: false,
				showConfirmDelete: false,
				pdpDataHasLoaded: false,
				similarSet: false,
				recommendationSet: false,
				reviewsSet: false,
				bulkieSet: false,
				hasVariantSize: false,
				pendingAddProduct: false,
				productAdded: false,
				showModalSelectSize: false
			},
			pdpData: {
				cardProduct: {},
				reviewContent: {}
			},
			detail: {},
			carousel: {
				slideIndex: 0
			},
			selectedVariant: {},
			btnBeliLabel: 'BELI AJA'
		};

		this.loadingContent = (
			<div style={{ margin: '20% auto 20% auto' }}>
				<Spinner size='large' />
			</div>
		);
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll, true);
	}

	componentWillReceiveProps(nextProps) {
		const { product, lovelist, dispatch } = nextProps;
		const { detail, recommendation, similar, socialSummary } = product;
		const { pdpData, status } = this.state;
		const { selectedVariant } = this.state;

		status.loading = product.loading;
		// sets card product
		if (!_.isEmpty(product.detail) && !status.pdpDataHasLoaded) {
			pdpData.cardProduct = productActions.getProductCardData(detail);
			status.pdpDataHasLoaded = true;
			
			if (!_.isEmpty(detail.spec) && _.isArray(detail.spec)) {
				const selectedSize = product.detail.spec.filter(specItem => (specItem.key === 'size'));
				// set default selected size
				if (!_.isEmpty(selectedSize) && typeof selectedSize[0].value !== 'undefined') {
					status.hasVariantSize = (!_.isEmpty(pdpData.cardProduct.variants));
				}
			}

			// set defaults variant if the product has one product variant only ...
			if (!_.isEmpty(detail.variants) && _.isArray(detail.variants) && detail.variants.length === 1) {
				selectedVariant.data = detail.variants[0];
			}
		}

		// sets lovelist data
		if (!_.isEmpty(lovelist.bulkieCountProducts) && status.pdpDataHasLoaded && !status.bulkieSet) {
			const lovelistProduct = dispatch(lovelistActions.getProductBulk(_.toInteger(detail.id)));
			status.bulkieSet = true;
			pdpData.cardProduct.totalLovelist = lovelistProduct.total || 0;
			status.isLoved = (lovelistProduct.status === 1);
		}

		// sets recommendation products data
		if (!_.isEmpty(recommendation.products) && !status.recommendationSet) status.recommendationSet = true;

		// sets similar products data
		if (!_.isEmpty(similar) && !status.similarSet) status.similarSet = true;

		// sets product reviews data
		if (!_.isEmpty(socialSummary.reviews) && !status.reviewsSet) {
			status.reviewsSet = true;
			const commentsSet = (!_.isUndefined(socialSummary.comment) && !_.isEmpty(socialSummary.comment));
			if (commentsSet && (typeof socialSummary.comment.total !== 'undefined')) {
				pdpData.cardProduct.totalComments = socialSummary.comment.total || 0;
			}

			pdpData.reviewContent = socialSummary.reviews.summary.map((item, idx) => {
				return <Comment key={idx} type='review' data={item} />;
			});
		}

		// updates states
		this.setState({ detail, status, pdpData, selectedVariant });
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

	closeZoomImage(e) {
		const { status } = this.state;
		status.isZoomed = false;
		this.setState({ status });
	}

	goBackPreviousPage(e) {
		const { history } = this.props;
		if ((history.length - 1 >= 0)) {
			history.goBack();
		} else {
			history.push('/');
		}
	}

	handleScroll(e) {
		const { status } = this.state;
		if (e.target.scrollTop > 400 && !status.showScrollInfomation) {
			status.showScrollInfomation = true;
		}

		if (e.target.scrollTop < 400 && status.showScrollInfomation) {
			status.showScrollInfomation = false;
		}

		this.setState({ status });
	}

	handleLovelistClick(e) {
		const { status } = this.state;
		// remove product from loved list
		if (status.isLoved) {
			status.showConfirmDelete = !status.showConfirmDelete;
			this.setState({ status });
		} else {
			// adds product into loved list
			this.removeAddItem(e);
		}
	}

	handleCloseModalPopUp(e, modal) {
		const { status } = this.state;

		switch (modal) {
		case 'lovelist':
			status.showConfirmDelete = false;
			break;
		case 'select-size':
			status.showModalSelectSize = false;
			break;
		default:
			break;
		}

		this.setState({ status });
	}

	addToShoppingBag(variantId) {
		const { status } = this.state;
		const { dispatch } = this.props;

		const handler = new Promise((resolve, reject) => {
			resolve(dispatch(shopBagActions.updateAction(this.userCookies, variantId, this.defaultCount, 'add')));
		});

		handler.then((res) => {
			// update carts
			dispatch(shopBagActions.getAction(this.userToken));
			status.pendingAddProduct = false;
			status.productAdded = true;
			this.setState({ btnBeliLabel: 'GO TO SHOPPING BAG' });
		}).catch((err) => {
			throw err;
		});

		this.setState({ status });
	}

	handleBtnBeliClicked(e) {
		const { selectedVariant, status } = this.state;

		// product variants not found
		if (!status.hasVariantSize && _.isEmpty(selectedVariant)) {
			console.log('[BEN BEN]: Inccorect variants data: ', this.props.product);
			return;
		}

		// Go to shopping back
		if (status.productAdded) {
			const { history } = this.props;
			history.push('/cart');
			return;
		}

		if (status.hasVariantSize && _.isEmpty(selectedVariant)) {
			status.showModalSelectSize = true;
			status.pendingAddProduct = true;
			this.setState({ status });
		} else {
			this.addToShoppingBag(selectedVariant.data.id);
		}
	}

	handleImageItemClick() {
		const { status } = this.state;
		status.isZoomed = true;
		this.setState({ status });
	}

	handleSelectVariant(size = '', selectedVariant = {}) {
		if (!_.isUndefined(size) && !_.isUndefined(selectedVariant)) {
			const { status, pdpData } = this.state;
			pdpData.cardProduct.pricing = selectedVariant.data.pricing.formatted;
			console.log('pdpData: ', pdpData);
			this.setState({
				size,
				selectedVariant,
				pdpData
			});
			// Add product to cart automatically after product variant size selected 
			if (status.pendingAddProduct) this.addToShoppingBag(selectedVariant.data.id);
		}
	}

	redirectToComments() {
		const { match, history } = this.props;
		history.push(`/product/comments/${match.params.id}`);
	}

	removeAddItem(e) {
		const { dispatch } = this.props;
		const { pdpData, status, detail } = this.state;

		if (!status.isLoved) {
			status.isLoved = true;
			pdpData.cardProduct.totalLovelist += 1;
			dispatch(lovelistActions.addToLovelist(this.userCookies, detail.id));
		} else {
			status.isLoved = false;
			pdpData.cardProduct.totalLovelist -= 1;
			dispatch(lovelistActions.removeFromLovelist(this.userCookies, detail.id));
		}

		status.showConfirmDelete = false;
		this.setState({ status, pdpData });
	}

	renderSimilarRecommendItems(type) {
		const { product } = this.props;
		let fragment = [];
		let items = {};
		const itemsList = [];

		switch (type) {
		case 'recommendation':
			items = product.recommendation.products;
			break;
		case 'similar':
			items = product.similar;
			break;
		default:
			break;
		}

		// builds items
		items.forEach((item, idx) => {
			const data = {
				key: idx,
				images: item.images,
				productTitle: item.product_title,
				brandName: item.brand.name,
				pricing: item.pricing,
				linkToPdp: '/'
			};

			// set fragment value
			fragment = ((idx + 1) % 2 !== 0) ? [<Card.CatalogGrid {...data} />] : [...fragment, <Card.CatalogGrid {...data} />];

			// push fragment into 
			if ((idx + 1) % 2 === 0 || items.length === (idx + 1)) {
				itemsList.push(fragment);
			}
		});

		return (
			<Carousel className='margin--medium-v'>
				{itemsList.map((item, i) => <Grid split={2} key={i}>{item}</Grid>)}
			</Carousel>
		);
	}

	renderZoomImage() {
		const { carousel, pdpData } = this.state;
		const header = {
			left: (<Button onClick={this.closeZoomImage} ><Svg src={'ico_close-large.svg'} /></Button>),
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
					<Button onClick={this.goBackPreviousPage} >
						<Svg src={'ico_arrow-back-left.svg'} />
					</Button>
				),
				center: <div style={{ width: '220px', margin: '0 auto' }} className='text-elipsis --disable-flex'>{pdpData.cardProduct.product_title}</div>,
				right: (
					<Button href={'/'} onClick={this.switchMode}>
						<Svg src={'ico_share.svg'} />
					</Button>
				)
			};
		}
		return {
			left: (
				<Button onClick={this.goBackPreviousPage}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</Button>
			),
			center: '',
			right: (
				<Button href={'/'} onClick={this.switchMode}>
					<Svg src={'ico_share.svg'} />
				</Button>
			)
		};
	}

	renderStickyAction() {
		const { pdpData, status, detail, btnBeliLabel } = this.state;
		if (status.pdpDataHasLoaded && status.showScrollInfomation && !status.loading) {
			return (
				<div className={styles.stickyAction}>
					<Level style={{ padding: '10px' }} className='flex-center'>
						<Level.Left>
							<Level className={styles.action}>
								<Level.Left>
									<div className={styles.stickyActionImage}>
										<img alt='product' src={detail.images[0].thumbnail} />
									</div>
								</Level.Left>
							</Level>
						</Level.Left>
						<Level.Item className='padding--medium-h'>
							<Level className={styles.action}>
								<Level.Item>
									<div className='font-normal'>{pdpData.cardProduct.pricing.effective_price}</div>
									<div className='font-small font-color--primary-ext-2'>{pdpData.cardProduct.pricing.effective_price}</div>
								</Level.Item>
								<Level.Right>
									<Badge rounded color='red'>
										<span className='font--lato-bold'>{pdpData.cardProduct.pricing.discount || '0%'}</span>
									</Badge>
								</Level.Right>
							</Level>
						</Level.Item>
						<Level.Right>
							<Level className={styles.action}>
								<Level.Right>
									<Button color='secondary' disabled={(pdpData.cardProduct.productStock === 0)} size='medium' onClick={this.handleBtnBeliClicked} >{btnBeliLabel}</Button>
								</Level.Right>
							</Level>
						</Level.Right>
					</Level>
				</div>
			);
		};
		return null;
	}

	render() {
		const { detail, pdpData, status, carousel } = this.state;
		const { match, product } = this.props;
		const { seller, comment, reviews } = product.socialSummary;
		const linkToPdpDisabled = true;
		if (status.isZoomed) {
			return this.renderZoomImage();
		}

		return (
			<div>
				<Page color='#f9f9f9'>
					<div style={{ marginTop: '-60px', marginBottom: '70px' }}>
						{status.pdpDataHasLoaded && (
							<Card.Product
								setCarouselSlideIndex={this.setCarouselSlideIndex}
								slideIndex={carousel.slideIndex}
								onImageItemClick={this.handleImageItemClick}
								data={pdpData.cardProduct || {}}
								isLoved={status.isLoved}
								onBtnLovelistClick={this.handleLovelistClick}
								onBtnCommentClick={this.redirectToComments}
								onBtnBeliClick={this.handleBtnBeliClicked}
								linkToPdpDisabled={linkToPdpDisabled}
							/>
						)}
						
						{!status.pdpDataHasLoaded && this.loadingContent}

						{status.pdpDataHasLoaded && status.hasVariantSize && (
							<div className='flex-center padding--medium-h border-top'>
								<div className='margin--medium-v'>
									<div className='flex-row flex-spaceBetween'>
										<div>Pilih Ukuran</div>
										<Link to='/product/guide' className='d-flex font-color--primary-ext-2 flex-row flex-middle'>
											<Svg src='ico_sizeguide.svg' /> <span className='padding--small-h padding--none-r'>PANDUAN UKURAN</span>
										</Link>
									</div>
									<div className='margin--medium-v horizontal-scroll margin--none-b'>
										<Radio
											name='size'
											checked={this.state.size}
											style={{ marginTop: '10px', marginBottom: '10px' }}
											onChange={this.handleSelectVariant}
											data={pdpData.cardProduct.variants}
										/>
									</div>
									{(pdpData.cardProduct.productStock === 0) && (
										<p className='font-color--red font-small'>Stock Habis</p>
									)}
								</div>
							</div>
						)}
						<Level className='font-color--primary-ext-2 border-top border-bottom'>
							<Level.Item>
								<div className='padding--small-h'>Dapatkan OVO Point: 300.000</div>
							</Level.Item>
							<Level.Right>
								<Button>
									<Svg src='ico_warning.svg' />
								</Button>
							</Level.Right>
						</Level>
						<div className='font-medium margin--medium-v padding--medium-h'><strong>Details</strong></div>
						{
							status.pdpDataHasLoaded && <p className='padding--medium-h' dangerouslySetInnerHTML={{ __html: detail.description }} />
						}
						<div className='margin--medium-v --disable-flex padding--medium-h'>
							{
								(this.isLogin === 'true') &&
								<Link to={`/product/comments/${match.params.id}`} className='font--lato-normal font-color--primary-ext-2'>
									{(status.pdpDataHasLoaded && pdpData.cardProduct.totalComments > 0) ? `Lihat semua ${pdpData.cardProduct.totalComments} komentar` : 'Belum ada komentar'}
								</Link>
							}
							{
								(this.isLogin !== 'true') &&
								<span>
									<a href='/user/login'>Log in</a> / <a href='/user/register'>Register</a> untuk memberikan komentar
								</span>
							}
							{(!_.isUndefined(comment) && !_.isUndefined(comment.summary) && !_.isEmpty(comment.summary)) && (
								<Comment type='lite-review' data={comment.summary} />
							)}
						</div>
						<hr className='margin--small-v' />
						{status.recommendationSet && (
							<div>
								<div className='margin--small-v padding--medium-h font-medium'><strong>Anda Mungkin Suka</strong></div>
								<div className='flex'>{(!status.loading) ? this.renderSimilarRecommendItems('recommendation') : this.loadingContent}</div>
							</div>
						)}
						<div style={{ backgroundColor: '#F5F5F5' }}>
							{status.reviewsSet && (
								<div className='padding--small-h' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
									<div className='margin--medium-v'>
										<div className='padding--small-h margin--small-v margin--none-t flex-row flex-spaceBetween'>
											<div className='font-medium'><strong>Ulasan</strong></div>
											{(typeof reviews.total !== 'undefined' && reviews.total > 0) && (
												<Link className='font-small flex-middle d-flex flex-row font-color--primary-ext-2' to='/'><span style={{ marginRight: '5px' }} >LIHAT SEMUA</span> <Svg src='ico_chevron-right.svg' /></Link>
											)}
										</div>
										<div className='border-bottom'>
											<div className='padding--small-h margin--medium-v margin--none-t flex-row flex-middle'>
												<Rating
													active={(typeof reviews.rating !== 'undefined' && reviews.rating > 0) ? reviews.rating : 0}
													total={(typeof reviews.total !== 'undefined' && reviews.total > 0) ? reviews.total : 0}
												/>
												<div className='flex-row padding--small-h'>
													<strong>{(typeof reviews.rating !== 'undefined' && reviews.rating > 0) ? reviews.rating : 0}/5</strong>
													<span className='font-color--primary-ext-2 padding--small-h'>
														{(typeof reviews.total !== 'undefined' && reviews.total > 0) ? `(${reviews.total} Ulasan)` : 'Belum Ada Ulasan'}
													</span>
												</div>
											</div>
										</div>
										{(!status.loading) ? pdpData.reviewContent : this.loadingContent}
									</div>
								</div>
							)}
							<div className='padding--small-h' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
								{
									status.pdpDataHasLoaded && (
										<SellerProfile
											image={detail.seller.seller_logo}
											status='gold'
											isNewStore={seller.is_new_seller}
											successOrder={(!_.isUndefined(seller.success_order.rate)) ? (seller.success_order.rate || 0) : 0}
											rating={seller.rating}
											totalProduct={(!_.isUndefined(seller.success_order.total)) ? (seller.success_order.total || 0) : 0}
											name={detail.seller.seller}
											location={detail.seller.seller_location}
											description={(seller.description || '')}
											storeAddress={urlBuilder.setId(detail.seller.seller_id).setName(detail.seller.seller).buildStore()}
										/>
									)
								}

								{
									status.pdpDataHasLoaded && (
										<div className='margin--medium-v margin--none-t'>
											<Grid split={4} className='padding--small-h'>
												<div className='padding--normal-h'><Image src='https://cms.souqcdn.com/spring/cms/en/ae/2017_LP/women-clothing/images/women-clothing-skirts.jpg' /></div>
												<div className='padding--normal-h'><Image src='https://cms.souqcdn.com/spring/cms/en/ae/2017_LP/women-clothing/images/women-clothing-skirts.jpg' /></div>
												<div className='padding--normal-h'><Image src='https://cms.souqcdn.com/spring/cms/en/ae/2017_LP/women-clothing/images/women-clothing-skirts.jpg' /></div>
												<div className='padding--normal-h'>
													<Image src='https://cms.souqcdn.com/spring/cms/en/ae/2017_LP/women-clothing/images/women-clothing-skirts.jpg' />
													<div className={styles.seeAll}>
														SEE ALL
													</div>
												</div>
											</Grid>
										</div>
								)}
							</div>
							{status.similarSet && (
								<div className='padding--small-h' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
									<div className='margin--small-v padding--medium-h font-medium'><strong>Product Serupa</strong></div>
									<div className='flex'>{(!status.loading) ? this.renderSimilarRecommendItems('similar') : this.loadingContent}</div>
								</div>
							)}
						</div>
					</div>
					{this.renderStickyAction()}
				</Page>
				<Header.Modal style={!status.showScrollInfomation ? { backgroundColor: 'transparent', border: 'none', boxShadow: 'none' } : {}} {...this.renderHeaderPage()} />
				<Modal show={status.showConfirmDelete}>
					<div className='font-medium'>
						<h3>Hapus Lovelist</h3>
						<Level style={{ padding: '0px' }} className='margin--medium-v'>
							<Level.Left />
							<Level.Item className='padding--medium-h'>
								<div className='font-small'>Kamu yakin mau hapus produk ini dari Lovelist kamu?</div>
							</Level.Item>
						</Level>
					</div>
					<Modal.Action
						closeButton={(
							<Button onClick={(e) => this.handleCloseModalPopUp(e, 'lovelist')}>
								<span className='font-color--primary-ext-2'>BATALKAN</span>
							</Button>)}
						confirmButton={(<Button onClick={this.removeAddItem}>YA, HAPUS</Button>)}
					/>
				</Modal>
				<Modal show={status.showModalSelectSize}>
					<div className='font-medium'>
						<h3>INFORMASI</h3>
						<Level style={{ padding: '0px' }} className='margin--medium'>
							<Level.Left />
							<Level.Item className='padding--medium'>
								<div className='font-small'>Silahkan pilih ukuran terlebih dahulu.</div>
							</Level.Item>
						</Level>
					</div>
					<Modal.Action
						closeButton={(
							<Button onClick={(e) => this.handleCloseModalPopUp(e, 'select-size')} >
								<span className='font-color--primary-ext-2'>PILIH UKURAN</span>
							</Button>)}
					/>
				</Modal>
				{/* <Navigation scroll={this.props.scroll} totalCartItems={shared.totalCart} /> */}
			</div>);
	}
}

const mapStateToProps = (state) => {
	return {
		product: state.product,
		shared: state.shared,
		lovelist: state.lovelist
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, match, cookies } = props;

	const productId = _.toInteger(match.params.id);
	const token = cookies.get('user.token');

	dispatch(new productActions.productDetailAction(token, productId));
	dispatch(new productActions.productRecommendationAction(token, productId, 1, 10));
	dispatch(new productActions.productSimilarAction(token, productId, 1, 10));
	dispatch(new productActions.productSocialSummaryAction(token, productId));
	dispatch(new lovelistActions.bulkieCountByProduct(token, productId));

};

export default withCookies(connect(mapStateToProps)(Shared(Products, doAfterAnonymous)));
