import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { urlBuilder } from '@/utils';
import { actions as productActions } from '@/state/v4/Product';
import { actions as sharedActions } from '@/state/v4/Shared';
import { actions as lovelistActions } from '@/state/v4/Lovelist';
import { actions as shopBagActions } from '@/state/v4/ShopBag';
import { Modal, Page, Header, Level, Button, Svg, Card, Comment, Image, Radio, Grid, Carousel, Rating, Spinner, Badge } from '@/components/mobile';
import Share from '@/components/mobile/Share';
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
		this.isLogin = (typeof this.props.cookies.get('isLogin') === 'string' && this.props.cookies.get('isLogin') === 'true');
		this.defaultCount = 1;
		this.slideWrapAround = true;

		this.closeZoomImage = this.closeZoomImage.bind(this);
		this.goBackPreviousPage = this.goBackPreviousPage.bind(this);
		this.handleLovelistClick = this.handleLovelistClick.bind(this);
		this.handleImageItemClick = this.handleImageItemClick.bind(this);
		this.handleCloseModalPopUp = this.handleCloseModalPopUp.bind(this);
		this.handleBtnBeliClicked = this.handleBtnBeliClicked.bind(this);
		this.handleSelectVariant = this.handleSelectVariant.bind(this);
		this.onOvoInfoClick = this.onOvoInfoClick.bind(this);
		this.redirectToPage = this.redirectToPage.bind(this);
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
				bulkieSet: false,
				hasVariantSize: false,
				pendingAddProduct: false,
				productAdded: false,
				showModalSelectSize: false,
				btnBeliDisabled: false,
				forceLogin: false,
				showOvoInfo: false,
				sellerDataSet: false,
			},
			pdpData: {
				cardProduct: {},
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

	componentWillReceiveProps(nextProps) {
		const { product, lovelist, dispatch } = nextProps;
		const { detail, promo } = product;
		const { pdpData, status } = this.state;
		let { selectedVariant, size } = this.state;

		status.loading = product.loading;
		// sets card product
		if (!_.isEmpty(detail) && !status.pdpDataHasLoaded) {
			pdpData.cardProduct = productActions.getProductCardData(detail);
			status.pdpDataHasLoaded = true;
			status.hasVariantSize = pdpData.cardProduct.hasVariantSize;

			// Sets whether product has variants size or set defaults variant
			// if the product has one product variant only ...
			if (!_.isEmpty(pdpData.cardProduct.variants) && _.isArray(pdpData.cardProduct.variants)) {
				if (pdpData.cardProduct.variants.length === 1 && pdpData.cardProduct.hasVariantSize) {
					const variant = pdpData.cardProduct.variants[0];
					selectedVariant = pdpData.cardProduct.variantsData[variant.value];
					size = variant.value;
				} else if (pdpData.cardProduct.variants.length === 1 && !pdpData.cardProduct.hasVariantSize) {
					selectedVariant = pdpData.cardProduct.variants[0];
				}
			}

			// disable enabled button BELI AJA
			if (_.isEmpty(pdpData.cardProduct.variants) ||
				pdpData.cardProduct.productStock === 0 || detail.is_product_available === 0) {
				status.btnBeliDisabled = true;
			} else {
				status.btnBeliDisabled = false;
			}

			if (typeof detail.seller !== 'undefined' && typeof detail.seller.seller_id !== 'undefined' && !status.sellerDataSet) {
				dispatch(new productActions.productStoreAction(this.userCookies, detail.seller.seller_id));
				status.sellerDataSet = true;
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
		if (!_.isEmpty(promo.recommended_items.products) && !status.recommendationSet) status.recommendationSet = true;

		// sets similar products data
		if (!_.isEmpty(promo.similar_items.products) && !status.similarSet) status.similarSet = true;

		// updates states
		this.setState({ detail, status, pdpData, selectedVariant, size });
		this.handleScroll();
	}

	onOvoInfoClick(e) {
		const { promo } = this.props.product;
		const { status } = this.state;
		status.showOvoInfo = false;
		if (!_.isEmpty(promo.meta_data.ovo_info)) status.showOvoInfo = true;

		this.setState({ status });
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
		if (!this.carouselEL) return;
		const { status } = this.state;
		const carouselHeight = this.carouselEL.getBoundingClientRect().height;
		if (this.props.scroll.top > carouselHeight && !status.showScrollInfomation) {
			status.showScrollInfomation = true;
			this.setState({ status });
		}

		if (this.props.scroll.top < carouselHeight && status.showScrollInfomation) {
			status.showScrollInfomation = false;
			this.setState({ status });
		}
	}

	handleLovelistClick(e) {
		const { status } = this.state;

		// customer must be logged in first
		if (!this.isLogin) {
			status.forceLogin = true;
			this.setState({ status });
			return;
		}

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
			status.pendingAddProduct = false;
			break;
		case 'ovo-points':
			status.showOvoInfo = false;
			break;
		default:
			break;
		}

		this.setState({ status });
	}

	addToShoppingBag(variantId) {
		const { status } = this.state;
		const { dispatch, product } = this.props;

		const handler = new Promise((resolve, reject) => {
			resolve(dispatch(shopBagActions.updateAction(this.userCookies, variantId, this.defaultCount, 'add')));
		});

		handler.then((res) => {
			// updates carts badge
			dispatch(new sharedActions.totalCartAction(this.userCookies));
			status.pendingAddProduct = false;
			status.productAdded = true;
			status.showModalSelectSize = false;

			// get product data
			status.pdpDataHasLoaded = false;
			dispatch(new productActions.productDetailAction(this.userCookies, product.detail.id));
		}).catch((err) => {
			throw err;
		});

		this.setState({ status });
	}

	handleBtnBeliClicked(e) {
		const { selectedVariant, status } = this.state;

		// product variants not found
		if (!status.hasVariantSize && _.isEmpty(selectedVariant)) {
			status.btnBeliDisabled = true;
			this.setState({ status });
			throw new Error('Invalid variants data');
		}

		// Go to shopping back
		// if (status.productAdded) {
		// 	const { history } = this.props;
		// 	history.push('/cart');
		// 	return;
		// }

		if (status.hasVariantSize && _.isEmpty(selectedVariant)) {
			status.showModalSelectSize = true;
			status.pendingAddProduct = true;
			this.setState({ status });
		} else {
			this.addToShoppingBag(selectedVariant.id);
		}
	}

	handleImageItemClick() {
		const { status } = this.state;
		status.isZoomed = true;
		this.setState({ status });
	}

	handleSelectVariant(size) {
		if (!_.isUndefined(size) && size !== '') {
			const { status, pdpData } = this.state;
			const selectedVariant = pdpData.cardProduct.variantsData[size];
			pdpData.cardProduct.pricing = selectedVariant.pricing.formatted;
			this.setState({
				size,
				selectedVariant,
				pdpData
			});
			// Add product to cart automatically after product variant size selected
			if (status.pendingAddProduct) this.addToShoppingBag(selectedVariant.id);
		}
	}

	loginLater() {
		const { status } = this.state;
		status.forceLogin = false;
		this.setState({ status });
	}

	loginNow() {
		const { status } = this.state;
		status.forceLogin = false;
		this.setState({ status });
		this.redirectToPage('login');
	}

	redirectToPage(page = '') {
		const { history, location } = this.props;
		const { detail } = this.state;
		let destUri = null;

		switch (page) {
		case 'comments':
			destUri = `/product/comments/${detail.id}`;
			break;
		case 'reviews':
			destUri = `/product/reviews/${detail.id}`;
			break;
		case 'carts':
			destUri = '/cart';
			break;
		case 'login':
			destUri = `/login?redirect_uri=${location.pathname}`;
			break;
		default:
			break;
		}

		if (!_.isEmpty(destUri) && !_.isNull(destUri) && !_.isEmpty(page)) {
			history.push(destUri);
		}
	}

	/**
	 * Handles removes/adds item into/from Loved list.
	 * @param {*} e
	 */
	removeAddItem(e) {
		const { dispatch } = this.props;
		const { pdpData, status, detail } = this.state;
		const handler = new Promise((resolve, reject) => {
			if (!status.isLoved) resolve(dispatch(lovelistActions.addToLovelist(this.userCookies, detail.id)));
			else resolve(dispatch(lovelistActions.removeFromLovelist(this.userCookies, detail.id)));
		});

		handler.then((res) => {
			// Updating product lovelist state ...
			if (res.status === 200 && res.statusText === 'OK') {
				if (!status.isLoved) {
					status.isLoved = true;
					pdpData.cardProduct.totalLovelist += 1;
				} else {
					status.isLoved = false;
					pdpData.cardProduct.totalLovelist -= 1;
				}
			}
			status.showConfirmDelete = false;
			this.setState({ status, pdpData });

		}).catch((err) => {
			status.showConfirmDelete = false;
			this.setState({ status, pdpData });
			throw err;
		});
	}

	/**
	 * Rendering recommendation, similar and best seller items
	 * @param {*} type
	 */
	renderSimilarRecommendItems(type) {
		const { promo } = this.props.product;
		let fragment = [];
		let items = {};
		const itemsList = [];

		switch (type) {
		case 'recommendation':
			items = promo.recommended_items.products;
			break;
		case 'similar':
			items = promo.similar_items.products;
			break;
		case 'best_seller':
			items = promo.best_seller_items.products;
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
				<Header.Modal style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }} {...header} />
				<Carousel
					slideIndex={carousel.slideIndex}
					afterSlide={newSlideIndex => this.setCarouselSlideIndex(newSlideIndex)}
					wrapAround={this.slideWrapAround}
				>
					{
						pdpData.cardProduct.images.map((image, idx) => (
							<div tabIndex='0' role='button' onClick={this.closeZoomImage} key={idx} data-img={image.mobile}>
								<Image src={image.mobile} alt='product' />
							</div>
						))
					}
				</Carousel>
			</div>
		);
	}

	renderStoreProducts() {
		const { products } = this.props.product.store;
		const length = products.length;
		const storeProductListContent = products.map((product, idx) => {
			if (idx === (length - 1)) {
				return (
					<div key={`storePNH-${idx}`} className='padding--small-h'>
						<Image src={product.images[0].thumbnail} key={idx} />
						<div className={styles.seeAll}>SEE ALL</div>
					</div>
				);
			}
			return <div key={`storePNH-${idx}`} className='padding--small-h'><Image key={idx} src={product.images[0].thumbnail} /></div>;
		});
		return <Grid split={4} className={`${styles.gridList} padding--small-h`}>{storeProductListContent}</Grid>;
	}

	renderHeaderPage() {
		const url = `${process.env.MOBILE_URL}${this.props.location.pathname}`;
		const { pdpData, status } = this.state;
		const { title } = this.state.detail;
		const brandName = !_.isEmpty(pdpData.cardProduct) ? pdpData.cardProduct.brand.name : '';

		const shopBageContent = (
			<Button onClick={() => this.redirectToPage('carts')} className='margin--medium-l'>
				<Svg src={'ico_cart.svg'} />
				{(this.props.shared.totalCart > 0) &&
					<Badge circle attached size='small' className='bg--secondary-ext-1 font-color--white'>{this.props.shared.totalCart}</Badge>
				}
			</Button>
		);

		if (status.showScrollInfomation) {
			return {
				left: (
					<Button onClick={this.goBackPreviousPage} >
						<Svg src={'ico_arrow-back-left.svg'} />
					</Button>
				),
				center: <div style={{ width: '220px', margin: '0 auto' }} className='text-elipsis --disable-flex'>{brandName}</div>,
				right: (
					<div className='flex-row flex-middle'>
						<Share title={title} url={url} />
						{shopBageContent}
					</div>
				)
			};
		}
		return {
			left: (
				<Button onClick={this.goBackPreviousPage}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</Button>
			),
			center: <div style={{ width: '220px', margin: '0 auto' }} className='text-elipsis --disable-flex'>{brandName}</div>,
			right: (
				<div className='flex-row flex-middle'>
					<Share title={title} url={url} />
					{shopBageContent}
				</div>
			)
		};
	}

	renderStickyAction() {
		const { pdpData, status, btnBeliLabel } = this.state;
		if (status.pdpDataHasLoaded && !status.loading) {
			return (
				<div className={styles.stickyAction}>
					<div className='flex-row flex-spaceBetween padding--medium-h padding--medium-v border-top flex-middle'>
						<div className='flex-row'>
							<div>
								<div className='font-medium font--lato-bold'>{pdpData.cardProduct.pricing.effective_price}</div>
								<div className='font-small font-color--primary-ext-2'>{pdpData.cardProduct.pricing.effective_price}</div>
							</div>
							<div className='margin--medium-l'>
								<Badge rounded color='red'>
									<span className='font--lato-bold'>{pdpData.cardProduct.pricing.discount || '0%'}</span>
								</Badge>
							</div>
						</div>
						<div>
							<Button color='secondary' disabled={status.btnBeliDisabled} size='medium' onClick={this.handleBtnBeliClicked} >{btnBeliLabel}</Button>
						</div>
					</div>
				</div>
			);
		};
		return null;
	}

	renderViewAllReviews() {
		const { reviews } = this.props.product.socialSummary;
		const reviewsContent = reviews.summary.map((item, idx) => {
			return <Comment key={idx} type='review' data={item} />;
		});

		return (<Page color='white'>{reviewsContent}</Page>);
	}

	render() {
		const { detail, pdpData, status, carousel, selectedVariant } = this.state;
		const { match, product } = this.props;
		const { seller, comments, reviews } = product.socialSummary;
		const linkToPdpDisabled = true;
		if (status.isZoomed) {
			return this.renderZoomImage();
		}

		return (
			<div>
				<Page color='white'>
					<div style={{ marginTop: '-60px', marginBottom: '70px' }}>
						{status.pdpDataHasLoaded && (
							<div ref={(n) => { this.carouselEL = n; }}>
								<Card.Product
									setCarouselSlideIndex={this.setCarouselSlideIndex}
									slideIndex={carousel.slideIndex}
									onImageItemClick={this.handleImageItemClick}
									data={pdpData.cardProduct || {}}
									isLoved={status.isLoved}
									disabledLovelist={false}
									onBtnLovelistClick={this.handleLovelistClick}
									onBtnCommentClick={this.redirectToPage}
									onBtnBeliClick={this.handleBtnBeliClicked}
									linkToPdpDisabled={linkToPdpDisabled}
									totalComments={comments.total}
								/>
							</div>
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
											variant='rounded'
											style={{ marginTop: '10px', marginBottom: '10px' }}
											onChange={this.handleSelectVariant}
											data={pdpData.cardProduct.variants}
										/>
									</div>
									{(status.hasVariantSize && !_.isEmpty(selectedVariant) && (selectedVariant.warning_stock_text !== '')) && (
										<p className='font-color--red font-small'>{selectedVariant.warning_stock_text}</p>
									)}
								</div>
							</div>
						)}
						{(!_.isEmpty(product.promo.meta_data.ovo_reward)) && (
							<Level className='font-color--primary-ext-2 border-top border-bottom'>
								<Level.Item>
									<div className='padding--small-h'>{product.promo.meta_data.ovo_reward}</div>
								</Level.Item>
								<Level.Right>
									<Button onClick={this.onOvoInfoClick}>
										<Svg src='ico_warning.svg' />
									</Button>
								</Level.Right>
							</Level>
						)}
						<div className='font-medium margin--medium-v padding--medium-h'><strong>Details</strong></div>
						{
							status.pdpDataHasLoaded && <p className='padding--medium-h' dangerouslySetInnerHTML={{ __html: detail.description }} />
						}
						<div className='margin--medium-v --disable-flex padding--medium-h'>
							{this.isLogin && (
								<Link to={`/product/comments/${match.params.id}`} className='font--lato-normal font-color--primary-ext-2'>
									{(comments.total === 0) && 'Belum Ada Komentar'}
									{(comments.total > 0 && comments.total <= 2) && `${comments.total} Komentar`}
									{(comments.total > 2) && `Lihat Semua ${comments.total} Komentar`}
								</Link>
							)}

							{
								(!this.isLogin) &&
								<span>
									<a href={`/login?redirect_uri=${this.props.location.pathname}`}>Log in</a> /
									<a href={`/register?redirect_uri=${this.props.location.pathname}`}>Register</a> untuk memberikan komentar
								</span>
							}
							{(!_.isUndefined(comments) && !_.isUndefined(comments.summary) && !_.isEmpty(comments.summary)) && (
								<Comment type='lite-review' data={comments.summary} />
							)}
						</div>
						{status.recommendationSet && (
							<div>
								<div className='margin--small-v padding--medium-h font-medium'><strong>Anda Mungkin Suka</strong></div>
								<div className='flex'>{(!status.loading) ? this.renderSimilarRecommendItems('recommendation') : this.loadingContent}</div>
							</div>
						)}
						<div style={{ backgroundColor: '#F5F5F5' }}>
							<div className='padding--small-h' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
								<div className='margin--medium-v'>
									<div className='padding--small-h margin--small-v margin--none-t flex-row flex-spaceBetween'>
										<div className='font-medium'><strong>{reviews.total > 0 ? 'Ulasan' : 'Belum Ada Ulasan'}</strong></div>
										{reviews.total > 2 && (
											<Button onClick={() => this.redirectToPage('reviews')} className='font-small flex-middle d-flex flex-row font-color--primary-ext-2' ><span style={{ marginRight: '5px' }} >LIHAT SEMUA</span> <Svg src='ico_chevron-right.svg' /></Button>
										)}
									</div>
									{reviews.total > 0 && (
										<div className='border-bottom'>
											<div className='padding--small-h margin--medium-v margin--none-t flex-row flex-middle'>
												<Rating
													active={(reviews.rating < 5) ? Number.parseFloat(reviews.rating).toFixed(1) : reviews.rating}
													total={5}
												/>
												<div className='flex-row padding--small-h'>
													<strong>{(reviews.rating < 5) ? Number.parseFloat(reviews.rating).toFixed(1) : reviews.rating} / 5</strong>
													<span className='font-color--primary-ext-2 padding--small-h'>{`${reviews.total} Ulasan)`}</span>
												</div>
											</div>
										</div>
									)}
									{reviews.total > 0 && (
										<div>
											{status.loading && this.loadingContent}
											{!status.loading &&
											(reviews.summary.map((item, idx) => {
												return <Comment key={idx} type='review' data={item} />;
											})
										)}</div>
									)}
								</div>
							</div>
							<div className='padding--small-h' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
								{status.pdpDataHasLoaded && (
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

								{(status.sellerDataSet && !_.isEmpty(product.store.products)) && (
									<div className='margin--medium-v margin--none-t'>
										<Link to={urlBuilder.setId(detail.seller.seller_id).setName(detail.seller.seller).buildStore()} >
											{this.renderStoreProducts()}
										</Link>
									</div>
								)}
							</div>
							{status.similarSet && (
								<div className='padding--small-h' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
									<div className='margin--small-v padding--medium-h font-medium'><strong>Product Serupa</strong></div>
									<div className='flex'>{(!status.loading) ? this.renderSimilarRecommendItems('similar') : this.loadingContent}</div>
								</div>
							)}
							{!status.similarSet && !_.isEmpty(product.promo.best_seller_items.products) && (
								<div className='padding--small-h' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
									<div className='margin--small-v padding--medium-h font-medium'><strong>Product Terlaris</strong></div>
									<div className='flex'>{(!status.loading) ? this.renderSimilarRecommendItems('best_seller') : this.loadingContent}</div>
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

				<Modal position='bottom' show={status.showModalSelectSize} onCloseOverlay={(e) => this.handleCloseModalPopUp(e, 'select-size')}>
					<div className='padding--medium-v'>
						<div className='padding--medium-h'><strong>PILIH UKURAN</strong></div>
						<div className='margin--medium-v horizontal-scroll padding--medium-h  margin--medium-r'>
							<Radio
								name='size'
								checked={this.state.size}
								variant='rounded'
								className='margin--small-v'
								onChange={this.handleSelectVariant}
								data={pdpData.cardProduct.variants}
							/>
						</div>
					</div>
				</Modal>

				{status.forceLogin && (
					<Modal show>
						<div className='font-medium'>
							<h3 className='text-center'>Lovelist</h3>
							<Level style={{ padding: '0px' }} className='margin--medium-v'>
								<Level.Left />
								<Level.Item className='padding--medium-h'>
									<div className='font-small'>Silahkan login/register untuk menambahkan produk ke Lovelist</div>
								</Level.Item>
							</Level>
						</div>
						<Modal.Action
							closeButton={(
								<Button onClick={(e) => this.loginLater()}>
									<span className='font-color--primary-ext-2'>NANTI</span>
								</Button>)}
							confirmButton={(<Button onClick={(e) => this.loginNow()}>SEKARANG</Button>)}
						/>
					</Modal>
				)}

				{status.showOvoInfo && (
					<Modal show>
						<div className='font-medium'>
							<h3 className='text-center'>OVO Points</h3>
							<Level style={{ padding: '0px' }} className='margin--medium-v'>
								<Level.Left />
								<Level.Item className='padding--medium-h'>
									<center>{product.promo.meta_data.ovo_info}</center>
								</Level.Item>
							</Level>
						</div>
						<Modal.Action
							closeButton={(
								<Button onClick={(e) => this.handleCloseModalPopUp(e, 'ovo-points')}>
									<strong className='font-color--primary-ext-2'>TUTUP</strong>
								</Button>)}
						/>
					</Modal>
				)}
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
	dispatch(new productActions.productPromoAction(token, productId));
	dispatch(new productActions.productSocialSummaryAction(token, productId));
	dispatch(new lovelistActions.bulkieCountByProduct(token, productId));

};

export default withCookies(connect(mapStateToProps)(Shared(Products, doAfterAnonymous)));
