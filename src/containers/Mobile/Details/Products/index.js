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
import Promos from '@/containers/Mobile/Details/Products/Promos';
import Share from '@/components/mobile/Share';
import Shared from '@/containers/Mobile/Shared';
import styles from './products.scss';
import SellerProfile from '../../Discovery/Seller/components/SellerProfile';
import { Promise } from 'es6-promise';

const doAfterAnonymous = async (props) => {
	const { dispatch, match, cookies } = props;

	const productId = _.toInteger(match.params.id);
	const token = cookies.get('user.token');

	dispatch(new productActions.productDetailAction(token, productId));
	dispatch(new productActions.productPromoAction(token, productId));
	dispatch(new productActions.productSocialSummaryAction(token, productId));
	dispatch(new lovelistActions.bulkieCountByProduct(token, productId));

};

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
		this.linkToPdpDisabled = true;

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
				bulkieSet: false,
				btnBeliDisabled: false,
				forceLogin: false,
				hasVariantSize: false,
				isLoved: false,
				isZoomed: false,
				productAdded: false,
				pendingAddProduct: false,
				showOvoInfo: false,
				showConfirmDelete: false,
				showModalSelectSize: false,
				showScrollInfomation: false,
			},
			cardProduct: {},
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
		const { detail } = product;
		const { status } = this.state;
		let { cardProduct, selectedVariant, size } = this.state;

		status.loading = product.loading;
		// sets card product
		if (_.toInteger(this.props.match.params.id) !== _.toInteger(nextProps.match.params.id)) {
			console.log('reloading data ...');
			doAfterAnonymous(nextProps);
		}

		if (!_.isEmpty(detail) && (this.props.product.detail !== detail) &&
			(this.props.product.detail.id !== detail.id)) {
			console.log('updating data....');
			cardProduct = productActions.getProductCardData(detail);
			status.hasVariantSize = cardProduct.hasVariantSize;

			// Sets whether product has variants size or set defaults variant
			// if the product has one product variant only ...
			if (!_.isEmpty(cardProduct.variants) && _.isArray(cardProduct.variants)) {
				if (cardProduct.variants.length === 1 && cardProduct.hasVariantSize) {
					const variant = cardProduct.variants[0];
					selectedVariant = cardProduct.variantsData[variant.value];
					size = variant.value;
				} else if (cardProduct.variants.length === 1 && !cardProduct.hasVariantSize) {
					selectedVariant = cardProduct.variants[0];
				}
			}

			// disable enabled button BELI AJA
			if (_.isEmpty(cardProduct.variants) ||
				cardProduct.productStock === 0 || detail.is_product_available === 0) {
				status.btnBeliDisabled = true;
			} else {
				status.btnBeliDisabled = false;
			}

			if (typeof detail.seller !== 'undefined' && typeof detail.seller.seller_id !== 'undefined') {
				dispatch(new productActions.productStoreAction(this.userCookies, detail.seller.seller_id));
			}
		}

		// sets lovelist data
		if (!_.isEmpty(lovelist.bulkieCountProducts) && (this.props.lovelist.bulkieCountProducts !== nextProps.lovelist.bulkieCountProducts)) {
			const lovelistProduct = lovelistActions.getBulkItem(lovelist.bulkieCountProducts, detail.id);
			cardProduct.totalLovelist = lovelistProduct.total || 0;
			status.isLoved = (lovelistProduct.status === 1);
		}

		// updates states
		this.setState({ status, cardProduct, selectedVariant, size });
		this.handleScroll();
	}

	// shouldComponentUpdate(nextProps, nextState) {
	// 	const { detail, promo, socialSummary } = this.props.product;

	// 	if (detail.id !== nextProps.product.detail.id) {
	// 		console.log('updating detail.id');
	// 		return true;
	// 	}

	// 	if (promo !== nextProps.product.promo) {
	// 		console.log('updating promo');
	// 		return true;
	// 	}

	// 	if (socialSummary !== nextProps.product.socialSummary) {
	// 		console.log('updating socialSummary');
	// 		return true;
	// 	}

	// 	if (_.toInteger(this.props.match.params.id) !== _.toInteger(nextProps.match.params.id)) {
	// 		console.log('do after anonymous');
	// 		doAfterAnonymous(nextProps);
	// 		return true;
	// 	}
	// 	return false;
	// }

	onOvoInfoClick(e) {
		const { promo } = this.props.product;
		const { status } = this.state;
		status.showOvoInfo = false;
		console.log('promo: ', Promos);
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
		const { top } = this.props.scroll;
		const carouselHeight = this.carouselEL.getBoundingClientRect().height;
		if (top > carouselHeight && !status.showScrollInfomation) {
			status.showScrollInfomation = true;
			this.setState({ status });
		}

		if ((top === 0 || top < carouselHeight) && status.showScrollInfomation) {
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
			const { status, cardProduct } = this.state;
			const selectedVariant = cardProduct.variantsData[size];
			cardProduct.pricing = selectedVariant.pricing.formatted;
			this.setState({
				size,
				selectedVariant,
				cardProduct
			});
			// Add product to cart cardProduct after product variant size selected
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
		const { history, location, product } = this.props;
		let destUri = null;

		switch (page) {
		case 'comments':
			destUri = `/product/comments/${product.detail.id}`;
			break;
		case 'reviews':
			destUri = `/product/reviews/${product.detail.id}`;
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
		const { dispatch, product } = this.props;
		const { cardProduct, status } = this.state;
		const handler = new Promise((resolve, reject) => {
			if (!status.isLoved) resolve(dispatch(lovelistActions.addToLovelist(this.userCookies, product.detail.id)));
			else resolve(dispatch(lovelistActions.removeFromLovelist(this.userCookies, product.detail.id)));
		});

		handler.then((res) => {
			// Updating product lovelist state ...
			if (res.status === 200 && res.statusText === 'OK') {
				if (!status.isLoved) {
					status.isLoved = true;
					cardProduct.totalLovelist += 1;
				} else {
					status.isLoved = false;
					cardProduct.totalLovelist -= 1;
				}
			}
			status.showConfirmDelete = false;
			this.setState({ status, cardProduct });

		}).catch((err) => {
			status.showConfirmDelete = false;
			this.setState({ status, cardProduct });
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
				pricing: {
					discount: item.pricing.formatted.discount,
					...item.pricing
				},
				linkToPdp: urlBuilder.buildPdp(item.product_title, item.product_id)
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
		const { detail } = this.props.product;
		const { carousel } = this.state;
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
						detail.images.map((image, idx) => {
							console.log('rendering zoom image item....');
							return (
								<div tabIndex='0' role='button' onClick={this.closeZoomImage} key={idx}>
									<Image lazyload src={image.original} alt='product' />
								</div>
							);
						})
					}
				</Carousel>
			</div>
		);
	}

	renderStoreProducts() {
		const { products } = this.props.product.store;
		const length = products.length;
		const storeProductListContent = products.map((product, idx) => {
			console.log('rendering store product item: ', product);
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
		try {
			const url = `${process.env.MOBILE_URL}${this.props.location.pathname}`;
			const { detail } = this.props.product;

			if (!_.isEmpty(detail)) {
				const { status } = this.state;
				const brandName = !_.isEmpty(detail.brand.name) ? detail.brand.name : '';
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
								<Share title={detail.title} url={url} />
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
					center: '',
					right: (
						<div className='flex-row flex-middle'>
							<Share title={detail.title} url={url} />
							{shopBageContent}
						</div>
					)
				};
			}
			return { left: null, center: null, right: null };
		} catch (error) {
			console.log('header error: ', error);
			return 'header error';
		}
	}

	renderStickyAction() {
		const { cardProduct, status, btnBeliLabel } = this.state;

		if (!_.isEmpty(cardProduct) && _.has(cardProduct, 'pricing')) {
			return (
				<div className={styles.stickyAction}>
					<div className='flex-row flex-spaceBetween padding--medium-h padding--medium-v border-top flex-middle'>
						<div className='flex-row'>
							<div>
								<div className='font-medium font--lato-bold'>{cardProduct.pricing.effective_price}</div>
								{(!_.isEmpty(cardProduct.pricing.base_price) && cardProduct.pricing.base_price !== cardProduct.pricing.effective_price) && (
									<div className={styles.discount}>{cardProduct.pricing.base_price}</div>
								)}
							</div>
							<div className='margin--medium-l'>
								{(!_.isEmpty(cardProduct.pricing.discount) && cardProduct.pricing.discount !== '0%') && (
									<Badge rounded color='red'>
										<span className='font--lato-bold'>{cardProduct.pricing.discount}</span>
									</Badge>
								)}
							</div>
						</div>
						<div>
							<Button color='secondary' disabled={status.btnBeliDisabled} size='medium' onClick={this.handleBtnBeliClicked} >{btnBeliLabel}</Button>
						</div>
					</div>
				</div>
			);
		};
		return this.loadingContent;
	}

	renderViewAllReviews() {
		const { reviews } = this.props.product.socialSummary;
		const reviewsContent = reviews.summary.map((item, idx) => {
			return <Comment key={idx} type='review' data={item} />;
		});

		return (<Page color='white'>{reviewsContent}</Page>);
	}

	render() {
		try {

			const { match, product } = this.props;
			const { detail, socialSummary, promo, store } = product;
			const { seller, comments, reviews } = socialSummary;
			const { cardProduct, status, carousel, selectedVariant } = this.state;

			if (status.isZoomed) return this.renderZoomImage();
			if (status.loading) return this.loadingContent;

			return (
				<div>
					<Page color='white'>
						<div style={{ marginTop: '-60px', marginBottom: '70px' }}>
							{!_.isEmpty(cardProduct) && (
								<div ref={(n) => { this.carouselEL = n; }}>
									<Card.Product
										setCarouselSlideIndex={this.setCarouselSlideIndex}
										slideIndex={carousel.slideIndex}
										onImageItemClick={this.handleImageItemClick}
										data={cardProduct || {}}
										isLoved={status.isLoved}
										disabledLovelist={false}
										onBtnLovelistClick={this.handleLovelistClick}
										onBtnCommentClick={this.redirectToPage}
										onBtnBeliClick={this.handleBtnBeliClicked}
										linkToPdpDisabled={this.linkToPdpDisabled}
										totalComments={comments.total}
									/>
								</div>
							)}

							{status.loading && this.loadingContent}

							{!_.isEmpty(detail) && status.hasVariantSize && (
								<div className='flex-center padding--medium-h border-top'>
									<div className='margin--medium-v'>
										<div className='flex-row flex-spaceBetween'>
											<div className='font-medium'>Pilih Ukuran</div>
											<Link to='/product/guide' className='d-flex font-color--primary font--lato-bold font-color-primary flex-row flex-middle'>
												<Svg src='ico_sizeguide.svg' /> <span className='padding--small-h font--lato-bold font-color--primary padding--none-r'>PANDUAN UKURAN</span>
											</Link>
										</div>
										<div className='margin--medium-v horizontal-scroll margin--none-b'>
											<Radio
												name='size'
												checked={this.state.size}
												variant='rounded'
												style={{ marginTop: '10px', marginBottom: '10px' }}
												onChange={this.handleSelectVariant}
												data={cardProduct.variants}
											/>
										</div>
										{(status.hasVariantSize && !_.isEmpty(selectedVariant) && (selectedVariant.warning_stock_text !== '')) && (
											<p className='font-color--red font-small'>{selectedVariant.warning_stock_text}</p>
										)}
									</div>
								</div>
							)}
							{(!_.isEmpty(promo.meta_data.ovo_reward)) && (
								<Level className='font-color--primary-ext-2 border-top border-bottom'>
									<Level.Item>
										<div className='padding--small-h'>{promo.meta_data.ovo_reward}</div>
									</Level.Item>
									<Level.Right>
										<Button onClick={this.onOvoInfoClick}>
											<Svg src='ico_warning.svg' />
										</Button>
									</Level.Right>
								</Level>
							)}
							<div className='font-medium margin--medium-v padding--medium-h'><strong>Details</strong></div>
							{!_.isEmpty(detail.description) && <div className='padding--medium-h' dangerouslySetInnerHTML={{ __html: detail.description.replace(/(?:\n)/g, '<br />') }} />}
							{!_.isEmpty(detail.spec) && (
								<div className='margin--medium-v --disable-flex padding--medium-h'>
									{(detail.spec.map((item, idx) => {
										item.value = item.value.replace(/(?:\r\n|\r|\n)/g, '<br />');
										if (/^/.test(item.value)) return <div key={idx} className='margin--small-v font-medium font-color--primary' dangerouslySetInnerHTML={{ __html: item.value }} />;
										return <div key={idx} className='margin--small-v font-medium font-color--primary'>{`${item.key}: ${item.value}`}</div>;
									}))}
								</div>
							)}
							<div className='margin--medium-v --disable-flex padding--medium-h'>
								{this.isLogin && (
									<Link to={`/product/comments/${match.params.id}`} className='font--lato-normal font-color--primary-ext-2'>
										{(comments.total === 0) && 'Tulis Komentar'}
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
							{/* ----------------------------	END OF PDP MAIN CONTENT (CARD PRODUCT) ---------------------------- */}

							<div style={{ backgroundColor: '#F5F5F5' }}>
								{/* ----------------------------	PRODUCT REVIEWS ---------------------------- */}
								{reviews.total > 0 && (
									<div className='padding--small-h' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
										<div className='margin--medium-v'>
											<div className='padding--small-h margin--small-v margin--none-t flex-row flex-spaceBetween'>
												<div className='font-medium'><strong>Ulasan Produk</strong></div>
												{reviews.total > 2 && (
													<Button onClick={() => this.redirectToPage('reviews')} className='font-small flex-middle d-flex flex-row font-color--primary-ext-2' >
														<span style={{ marginRight: '5px' }} >LIHAT SEMUA</span> <Svg src='ico_chevron-right.svg' />
													</Button>
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
															<span className='font-color--primary-ext-2 padding--small-h'>{`(${reviews.total} Ulasan)`}</span>
														</div>
													</div>
												</div>
											)}
											{reviews.total > 0 && (
												<div>
													{status.loading && this.loadingContent}
													{!status.loading &&
														(reviews.summary.map((item, idx) => {
															return (
																<div key={`pdp-rvd-${idx + 1}`}>
																	<Comment key={idx} type='review' data={item} />
																	{!_.isEmpty(item.reply.reply) &&
																		<div className='comment-reply' key={`pdp-rvd-${idx + 2}`} >
																			<div><Svg src='ico_review_reply.svg' /></div>
																			<Comment key={idx} type='review-reply' replyData={item.reply} sellerData={seller} />
																		</div>
																	}
																</div>
															);
														})
														)}</div>
											)}
										</div>
									</div>
								)}
								{/* ----------------------------	END OF REVIEW ---------------------------- */}


								{/* ----------------------------	SELLER PROFILE ---------------------------- */}							
								<div className='padding--small-h' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
									{!_.isEmpty(detail) && (
										<SellerProfile
											image={detail.seller.seller_logo}
											status='gold'
											isNewStore={seller.is_new_seller}
											successOrder={(!_.isUndefined(seller.success_order.rate)) ? (seller.success_order.rate || 0) : 0}
											rating={seller.rating}
											totalProduct={(!_.isUndefined(seller.success_order.total)) ? (seller.success_order.total || 0) : 0}
											name={detail.seller.seller}
											location={detail.seller.seller_location}
											description=''
											storeAddress={urlBuilder.setId(detail.seller.seller_id).setName(detail.seller.seller).buildStore()}
										/>
										)
									}

									{(!_.isEmpty(store.products)) && (
										<div className='margin--medium-v margin--none-t'>
											<Link to={urlBuilder.setId(detail.seller.seller_id).setName(detail.seller.seller).buildStore()} >
												{this.renderStoreProducts()}
											</Link>
										</div>
									)}
								</div>
								{/* ----------------------------	END OF SELLER PROFILE ---------------------------- */}

								<Promos promo={promo} loading={status.loading} />

							</div>
						</div>
						{this.renderStickyAction()}
					</Page>
					<Header.Modal style={!status.showScrollInfomation ? { backgroundColor: 'transparent', border: 'none', boxShadow: 'none' } : {}} {...this.renderHeaderPage()} />

					{/* MODALS */}
					<Modal show={status.showConfirmDelete}>
						<div className='font-medium'>
							<h3>Hapus Lovelist</h3>
							<Level style={{ padding: '0px' }} className='margin--medium-v'>
								<Level.Left />
								<Level.Item className='padding--medium-h margin--medium-h'>
									<div className='font-medium'>Kamu yakin mau hapus produk ini dari Lovelist kamu?</div>
								</Level.Item>
							</Level>
						</div>
						<Modal.Action
							closeButton={(
								<Button onClick={(e) => this.handleCloseModalPopUp(e, 'lovelist')}>
									<strong className='font-color--primary-ext-2'>BATALKAN</strong>
								</Button>)}
							confirmButton={(<Button onClick={this.removeAddItem}><strong className='font-color--primary'>YA, HAPUS</strong></Button>)}
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
									data={cardProduct.variants}
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
									<Level.Item className='padding--medium-h margin--medium-h'>
										<center className='font-medium'>Silahkan login/register untuk menambahkan produk ke Lovelist</center>
									</Level.Item>
								</Level>
							</div>
							<Modal.Action
								closeButton={(
									<Button onClick={(e) => this.loginLater()}>
										<strong className='font-color--primary-ext-2'>NANTI</strong>
									</Button>)}
								confirmButton={(<Button onClick={(e) => this.loginNow()}><strong className='font-color--primary'>SEKARANG</strong></Button>)}
							/>
						</Modal>
					)}

					{status.showOvoInfo && (
						<Modal show>
							<div className='font-medium padding--medium-h margin--medium-h'>
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
										<strong className='font-color--primary'>TUTUP</strong>
									</Button>)}
							/>
						</Modal>
					)}
				</div>);
		} catch (error) {
			console.log('PDP ERROR: ', error);
			return 'ERROR';
		}
	}
}

const mapStateToProps = (state) => {
	return {
		product: state.product,
		shared: state.shared,
		lovelist: state.lovelist
	};
};

export default withCookies(connect(mapStateToProps)(Shared(Products, doAfterAnonymous)));
