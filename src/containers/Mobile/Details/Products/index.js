import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Lightbox from 'react-image-lightbox';
import to from 'await-to-js';
import { urlBuilder, uniqid, hastagLinkCreator } from '@/utils';
import { actions as productActions } from '@/state/v4/Product';
import { actions as sharedActions } from '@/state/v4/Shared';
import { actions as lovelistActions } from '@/state/v4/Lovelist';
import { actions as shopBagActions } from '@/state/v4/ShopBag';
import { actions as usersActions } from '@/state/v4/User';
import { Page, Header, Level, Button, Svg, Card, Comment, Image, Radio, Grid, Spinner, Badge, AnimationLovelist, AnimationAddToCart } from '@/components/mobile';
import { Promos, ProductModal, ReviewSummary } from './Partials';
import Share from '@/components/mobile/Share';
import Shared from '@/containers/Mobile/Shared';
import styles from './products.scss';
import SellerProfile from '../../Discovery/Seller/components/SellerProfile';
import { Promise } from 'es6-promise';
import classNames from 'classnames';
import cookiesLabel from '@/data/cookiesLabel';
import xhandler from '@/containers/Mobile/Shared/handler';
import Discovery from '@/containers/Mobile/Discovery/Utils';
import { toastSytle } from '@/containers/Mobile/Shared/styleSnackbar';

import { Payload } from '@/utils/tracking/lucidworks';
import { Collector } from '@/utils/tracking/emarsys';
import { trackAddToCart, trackPdpView } from './Gtm';

const fusion = new Payload(_);

const doAfterAnonymous = async (props) => {
	const { dispatch, match, cookies, history } = props;

	const productId = _.toInteger(match.params.id);
	const token = cookies.get(cookiesLabel.userToken);

	let callProductAction = null;

	if (match.path === '/([^/]+)-:id([0-9]+).html') {
		callProductAction = await to(dispatch(productActions.productDetailAction(token, productId, true)));
	} else {
		callProductAction = await to(dispatch(productActions.productDetailAction(token, productId)));
	}

	const [err, response] = callProductAction;
	
	if (err) {
		history.push('/not-found');
	} else if (response) {
		const { detail } = response;

		// check product mds or not
		const { seller, title, variants } = detail;
		if (typeof seller !== 'undefined' && process.env.MDS_STORE_IDS.includes(seller.seller_id) && variants.length > 0) {
			window.location.replace(urlBuilder.buildPdp(title, variants[0].id, true));
		}

		trackPdpView(response, props);
		dispatch(productActions.productSocialSummaryAction(token, productId));
		fusion.trackPdp(response);
		Collector.push(Collector.PRODUCT_PAGE, variants[0].variant_sku);
	}

	const res = await dispatch(productActions.productPromoAction(token, productId));
	if (res.status === 200 && res.statusText === 'OK') {
		const ids = [productId];
		const { recommended_items, similar_items, best_seller_items } = res.data.data;
		recommended_items.products.forEach((item) => ids.push(item.product_id));
		if (!_.isEmpty(similar_items.products)) {
			similar_items.products.forEach((item) => ids.push(item.product_id));
		} else if (_.isEmpty(similar_items.products) && !_.isEmpty(best_seller_items.products)) {
			best_seller_items.products.forEach((item) => ids.push(item.product_id));
		}
		await dispatch(lovelistActions.bulkieCountByProduct(token, ids));
	}
};

@xhandler
class Products extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.source = this.props.cookies.get(cookiesLabel.userSource);
		this.isLogin = (typeof this.props.cookies.get(cookiesLabel.isLogin) === 'string' && this.props.cookies.get(cookiesLabel.isLogin) === 'true');
		this.defaultCount = 1;
		this.slideWrapAround = true;
		this.linkToPdpDisabled = true;
		this.updateCard = false;
		this.botBarUp = false;

		this.closeZoomImage = this.closeZoomImage.bind(this);
		this.goBackPreviousPage = this.goBackPreviousPage.bind(this);
		this.handleLovelistClick = this.handleLovelistClick.bind(this);
		this.handleImageItemClick = this.handleImageItemClick.bind(this);
		this.handleCloseModalPopUp = this.handleCloseModalPopUp.bind(this);
		this.handleBtnBeliClicked = this.handleBtnBeliClicked.bind(this);
		this.handleSelectVariant = this.handleSelectVariant.bind(this);
		this.loginNow = this.loginNow.bind(this);
		this.onOvoInfoClick = this.onOvoInfoClick.bind(this);
		this.redirectToPage = this.redirectToPage.bind(this);
		this.removeAddItem = this.removeAddItem.bind(this);
		this.setCarouselSlideIndex = this.setCarouselSlideIndex.bind(this);
		this.handleShowMoreProductDescription = this.handleShowMoreProductDescription.bind(this);
		this.handleShowLessProductDescription = this.handleShowLessProductDescription.bind(this);
		this.renderZoom = this.renderZoom.bind(this);
		this.getZoomNextImage = this.getZoomNextImage.bind(this);
		this.getZoomPrevImage = this.getZoomPrevImage.bind(this);

		this.state = {
			size: '',
			animation: {
				lovelist: false,
				addToCart: false
			},
			showAnimationLovelist: false,
			status: {
				loading: false,
				btnBeliDisabled: false,
				btnBeliLoading: false,
				forceLogin: false,
				hasVariantSize: false,
				isLoved: false,
				isZoomed: false,
				pendingAddProduct: false,
				showOvoInfo: false,
				showConfirmDelete: false,
				showModalSelectSize: false,
				showScrollInfomation: false,
				showFullProductDescription: false
			},
			cardProduct: {},
			carousel: {
				slideIndex: 0
			},
			selectedVariant: {},
			outOfStock: false
		};

		this.loadingContent = (
			<div style={{ margin: '20% auto 20% auto' }}>
				<Spinner size='large' />
			</div>
		);
	}

	componentWillMount() {
		const { status } = this.state;
		status.showScrollInfomation = false;
		this.setState({ status });
		window.scroll(0, 0);
	}

	componentWillReceiveProps(nextProps) {
		const { cookies, product, lovelist, dispatch } = nextProps;
		const { detail } = product;
		const { status } = this.state;
		let { cardProduct, selectedVariant, size, outOfStock } = this.state;

		status.loading = product.loading;
		if ((_.toInteger(this.props.match.params.id) !== _.toInteger(nextProps.match.params.id)) ||
			(this.props.match.url !== nextProps.match.url)) {
			this.resetState();
			this.updateCard = true;
			doAfterAnonymous(nextProps);
		}

		// sets card product
		if ((!_.isEmpty(detail) && (this.props.product.detail !== detail)) || this.updateCard) {
			this.updateCard = false;
			cardProduct = productActions.getProductCardData(detail);
			status.hasVariantSize = cardProduct.hasVariantSize;

			if (_.has(detail, 'description') && !_.isEmpty(detail.description)) {
				cardProduct.formattedDescription = hastagLinkCreator(detail.description);
			}

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
			outOfStock = cardProduct.productStock === 0;
			if (_.isEmpty(cardProduct.variants) || outOfStock ||
				cardProduct.productStock === 0 || detail.is_product_available === 0) {
				status.btnBeliDisabled = true;
			} else {
				status.btnBeliDisabled = false;
			}

			if (typeof detail.seller !== 'undefined' && typeof detail.seller.seller_id !== 'undefined') {
				dispatch(productActions.productStoreAction(cookies.get(cookiesLabel.userToken), detail.seller.seller_id));
			}
		}

		// sets lovelist data
		if (!_.isEmpty(lovelist.bulkieCountProducts) && (this.props.lovelist.bulkieCountProducts !== nextProps.lovelist.bulkieCountProducts)) {
			const lovelistProduct = lovelistActions.getBulkItem(lovelist.bulkieCountProducts, detail.id);
			cardProduct.totalLovelist = lovelistProduct.total || 0;
			status.isLoved = (lovelistProduct.status === 1);
		}

		// updates states
		this.setState({ status, cardProduct, selectedVariant, size, outOfStock });
		this.handleScroll();
	}

	componentDidUpdate() {
		if (this.props.botBar && this.botBar) {
			if (!this.botBarUp) {
				this.props.botBar(this.botBar);
				this.botBarUp = true;
			}
		}
	}

	componentWillUnmount() {
		const { dispatch } = this.props;

		if (this.props.botBar) this.props.botBar(false);
		dispatch(productActions.productLoadingAction(true));
	}

	onOvoInfoClick(e) {
		const { promo } = this.props.product;
		const { status } = this.state;
		status.showOvoInfo = false;
		if (!_.isEmpty(promo.meta_data.ovo_info)) status.showOvoInfo = true;

		this.setState({ status });
	}

	setBtnBeliStatus(stat) {
		const { status } = this.state;
		const btnState = (!_.isUndefined(stat) && _.isBoolean(stat)) ? stat : false;
		status.btnBeliDisabled = btnState;
		status.btnBeliLoading = btnState;
		this.setState({ status });
	}

	setCarouselSlideIndex(index) {
		this.setState({
			carousel: {
				slideIndex: index || 0
			}
		});
	}

	getZoomNextImage() {
		const { slideIndex } = this.state.carousel;
		const { images } = this.props.product.detail;

		if (slideIndex === (images.length - 1)) return 0;
		return (slideIndex + 1);
	}

	getZoomPrevImage() {
		const { slideIndex } = this.state.carousel;
		const { images } = this.props.product.detail;

		if (slideIndex === 0) return (images.length - 1);
		return (slideIndex - 1);
	}

	resetState() {
		const { status, carousel } = this.state;
		status.showFullProductDescription = false;
		status.showScrollInfomation = false;
		status.hasVariantSize = false;
		status.isLoved = false;
		carousel.slideIndex = 0;
		this.setState({ status, selectedVariant: {}, size: '', outOfStock: false, cardProduct: {}, carousel });
		window.scroll(0, 0);
	}

	closeZoomImage(e) {
		const { status } = this.state;
		status.isZoomed = false;
		this.setState({ status });
	}

	goBackPreviousPage(e) {
		const { history } = this.props;
		// There is no state then push to homepage.
		if (window.history.state === null) {
			history.push('/');
		
		} else {
			history.goBack();
		}
	}

	handleScroll(e) {
		if (!this.carouselEL) return;
		const { status } = this.state;
		const { top } = this.props.scroll;
		const carouselHeight = this.carouselEL.getBoundingClientRect().height;

		status.showScrollInfomation = ((top !== 0) && top > (carouselHeight / 2));
		this.setState({ status });
	}

	animateLovelist() {
		this.setState({ animation: { ...this.state.animation, lovelist: true } });
		setTimeout(() => {
			this.setState({ animation: { ...this.state.animation, lovelist: false } });
		}, 2000);
	}

	animateAddtoCart() {
		this.setState({ animation: { ...this.state.animation, addToCart: true } });
		setTimeout(() => {
			this.setState({ animation: { ...this.state.animation, addToCart: false } });
		}, 2000);
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

	handleCloseModalPopUp(e, modalName = null) {
		const { status } = this.state;
		let modal = '';

		if (typeof modalName !== 'undefined' && modalName !== null) modal = modalName;
		else modal = e.currentTarget.dataset.modal;

		switch (modal) {
		case 'lovelist':
			status.showConfirmDelete = false;
			break;
		case 'select-size':
			status.showModalSelectSize = false;
			status.pendingAddProduct = false;
			break;
		case 'login-later':
			status.forceLogin = false;
			break;
		case 'ovo-points':
			status.showOvoInfo = false;
			break;
		default:
			break;
		}

		this.setState({ status });
	}

	addToShoppingBag(variant) {
		const { status, cardProduct } = this.state;
		const { cookies, dispatch, product } = this.props;

		// disabled button beli
		this.setBtnBeliStatus(true);
		status.showModalSelectSize = false;
		this.setState({ status });

		const handler = new Promise((resolve, reject) => {
			resolve(dispatch(shopBagActions.updateAction(cookies.get(cookiesLabel.userToken), variant.id, this.defaultCount, 'add', 'pdp')));
		});

		handler.then((res) => {
			status.pendingAddProduct = false;
			status.showModalSelectSize = false;
			this.setState({ status });
			// enabled button beli after 2 seconds
			// prevents multiple button beli hits...
			setTimeout(() => {
				this.setBtnBeliStatus(false);
			}, 2000);

			// updates carts badge
			dispatch(sharedActions.totalCartAction(cookies.get(cookiesLabel.userToken)));
			dispatch(sharedActions.showSnack(uniqid('err-'), { label: 'Produk berhasil ditambahkan', timeout: 3000 }, toastSytle()));

			// Add to Cart tracking...
			trackAddToCart(product, this.props, variant, cardProduct.hasVariantSize);
			const pricing = product.detail.variants[0].pricing.original;
			fusion.trackAddToCart({
				product_id: product.detail.id,
				item_id: variant.id,
				item_price: pricing.effective_price,
				item_disc: pricing.discount,
				qty: this.defaultCount
			});

			// get product data
			// dispatch(productActions.productDetailAction(cookies.get(cookiesLabel.userToken), product.detail.id));
		}).catch((err) => {
			status.showModalSelectSize = false;
			status.btnBeliDisabled = true;
			status.btnBeliLoading = false;
			this.setState({ status });

			dispatch(sharedActions.showSnack(uniqid('err-'),
				{
					label: 'Produk gagal ditambahkan',
					timeout: 3000
				},
				toastSytle(),
			));
			throw err;
		});
	}

	handleBtnBeliClicked(e) {
		const { selectedVariant, status } = this.state;

		// product variants not found
		if (!status.hasVariantSize && _.isEmpty(selectedVariant)) {
			status.btnBeliDisabled = true;
			this.setState({ status });
			throw new Error('Invalid variants data');
		}

		if (status.hasVariantSize && _.isEmpty(selectedVariant)) {
			status.showModalSelectSize = true;
			status.pendingAddProduct = true;
			this.setState({ status });
		} else {
			this.addToShoppingBag(selectedVariant);
		}
	}

	handleImageItemClick() {
		const { status, outOfStock } = this.state;
		if (!outOfStock) status.isZoomed = true;
		this.setState({ status });
	}

	handleSelectVariant(size) {
		if (!_.isUndefined(size) && !_.isEmpty(size)) {
			const { cardProduct, status } = this.state;
			const selectedVariant = cardProduct.variantsData[size];
			cardProduct.pricing = selectedVariant.pricing.formatted;

			this.setState({
				size,
				selectedVariant,
				cardProduct
			});

			// Add product to cart cardProduct after product variant size selected
			if (status.pendingAddProduct) this.addToShoppingBag(selectedVariant);
		}
	}

	toggleDescription(toggle = true) {
		const { status } = this.state;
		status.showFullProductDescription = toggle;
		this.setState({ status });
	}

	handleShowLessProductDescription = () => {
		this.toggleDescription(false);
	}

	handleShowMoreProductDescription = () => {
		this.toggleDescription();
	}

	loginNow(pid) {
		const { status } = this.state;
		const { dispatch } = this.props;
		dispatch(new usersActions.addAfterLogin('Lovelist', 'addToLovelist', [pid]));
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
		const { cookies, dispatch, product } = this.props;
		const { cardProduct, status } = this.state;
		const handler = new Promise((resolve, reject) => {
			if (!status.isLoved) resolve(dispatch(lovelistActions.addToLovelist(cookies.get(cookiesLabel.userToken), product.detail.id)));
			else resolve(dispatch(lovelistActions.removeFromLovelist(cookies.get(cookiesLabel.userToken), product.detail.id)));
		});

		status.showConfirmDelete = false;
		this.setState({ status });
		let message = '';
		handler.then((res) => {
			// Updating product lovelist state ...
			if (res.status === 200 && res.statusText === 'OK') {
				if (!status.isLoved) {
					this.animateLovelist();
					message = 'Lovelist ditambahkan';
					status.isLoved = true;
					cardProduct.totalLovelist += 1;
				} else {
					message = 'Produk dihapus dari Lovelist';
					status.isLoved = false;
					cardProduct.totalLovelist -= 1;
				}
			}

			dispatch(sharedActions.showSnack(uniqid('err-'),
				{
					label: message,
					timeout: 3000
				},
				toastSytle(),
			));

			dispatch(sharedActions.totalLovelistAction(cookies.get(cookiesLabel.userToken)));
		}).catch((err) => {
			status.showConfirmDelete = false;
			dispatch(sharedActions.showSnack(uniqid('err-'),
				{
					label: message,
					timeout: 3000
				},
				toastSytle(),
			));
			throw err;
		});
	}

	renderStoreProducts() {
		const { products } = this.props.product.store;
		const length = products.length;
		return (
			<Grid split={4}>
				{
					products.map((product, idx) => {
						if (idx === (length - 1)) {
							return (
								<div key={`storePNH-${idx}`} className='padding--small-h'>
									<Image lazyload shape='square' alt='thumbnail' src={product.images[0].thumbnail} key={idx} />
									<div className={styles.seeAll}>SEE ALL</div>
								</div>
							);
						}
						return (
							<div key={`storePNH-${idx}`} className='padding--small-h'>
								<Image lazyload shape='square' alt='thumbnail' src={product.images[0].thumbnail} key={idx} />
							</div>
						);
					})
				}
			</Grid>
		);
	}

	renderHeaderPage() {
		const url = `${process.env.MOBILE_URL}${this.props.location.pathname}`;
		const { detail } = this.props.product;

		if (!_.isEmpty(detail)) {
			const { status, outOfStock } = this.state;
			const shopBageContent = (
				<Button onClick={() => this.redirectToPage('carts')} className='margin--medium-l'>
					<Svg src={'ico_cart.svg'} />
					{(this.props.shared.totalCart > 0) &&
						<Badge circle attached size='small' className='bg--secondary-ext-1 font-color--white'>{this.props.shared.totalCart}</Badge>
					}
				</Button>
			);
			let brandName = !_.isEmpty(detail.brand.name) ? detail.brand.name : '';
			brandName = (outOfStock) ? 'PRODUK TIDAK TERSEDIA' : brandName;

			if (status.showScrollInfomation || outOfStock) {
				return {
					left: (
						<Button onClick={this.goBackPreviousPage} >
							<Svg src={'ico_arrow-back-left.svg'} />
						</Button>
					),
					center: (
						<div style={{ width: '180px', margin: '0 auto', paddingLeft: '50px' }} className='text-elipsis --disable-flex'>
							{
								_.chain(brandName).split(' ').size().value() > 5 ? (
									<div className='marguee'>
										<span>{brandName}</span>
									</div>
								) : <span>{brandName}</span>
							}
						</div>
					),
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
	}

	renderStickyAction() {
		const { cardProduct, status, outOfStock } = this.state;
		const btnDisabled = (status.btnBeliDisabled || status.loading || status.btnBeliLoading || outOfStock);

		if (!_.isEmpty(cardProduct) && _.has(cardProduct, 'pricing')) {
			return (
				<div className={styles.stickyAction} ref={(r) => { this.botBar = r; }}>
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
							<Button id='btnBeliAjaPdp' color='secondary' disabled={btnDisabled} loading={status.btnBeliLoading} size='medium' onClick={this.handleBtnBeliClicked} >BELI AJA</Button>
						</div>
					</div>
				</div>
			);
		};
		return this.loadingContent;
	}

	renderZoom() {
		const { detail } = this.props.product;
		const { carousel } = this.state;
		if (_.has(detail, 'images')) {
			const { slideIndex } = carousel;

			return (
				<div>
					<Lightbox
						mainSrc={detail.images[slideIndex].original}
						nextSrc={detail.images[this.getZoomNextImage()].original}
						prevSrc={detail.images[this.getZoomPrevImage()].original}
						onCloseRequest={(e) => this.closeZoomImage(e)}
						onMovePrevRequest={() => this.setCarouselSlideIndex(this.getZoomPrevImage())}
						onMoveNextRequest={() => this.setCarouselSlideIndex(this.getZoomNextImage())}
					/>
				</div>
			);
		}
		return '';
	}

	render() {
		try {

			const { match, product } = this.props;
			const { detail, socialSummary, promo, loading, store } = product;
			const { seller, comments, reviews } = socialSummary;
			const { cardProduct, status, carousel, selectedVariant, outOfStock, size } = this.state;
			const { id, brand } = detail;

			const buttonProductDescriptionAttribute = {
				onClick: this.handleShowMoreProductDescription
			};

			let fullProductDescriptionButtonText = 'more';
			let classNameProductDescription = classNames('padding--medium-h', styles.textOnlyShowTwoLines);

			if (status.showFullProductDescription === true) {
				classNameProductDescription = classNames('padding--medium-h');
				buttonProductDescriptionAttribute.onClick = this.handleShowLessProductDescription;
				fullProductDescriptionButtonText = 'Hide';
			}

			const productDetailView = (!_.isEmpty(cardProduct.formattedDescription)) && (
				<div>
					<div className='font-medium margin--medium-v padding--medium-h'><strong>Details</strong></div>
					<div className='wysiwyg-content can-copy'>
						<div className={classNameProductDescription} style={{ wordWrap: 'break-word' }}>
							{<div dangerouslySetInnerHTML={{ __html: cardProduct.formattedDescription }} />}
							{!_.isEmpty(cardProduct.specs) && (
								<div className='margin--medium-v --disable-flex'>
									{(cardProduct.specs.map((item, idx) => {
										item.value = item.value.replace(/(?:\r\n|\r|\n)/g, '<br />');
										if (/^/.test(item.value)) return <div key={idx} className='margin--small-v font-medium font-color--primary'>{`${item.key}: ${item.value}`}</div>;
										return <div key={idx} className='margin--small-v font-medium font-color--primary'>{`${item.key}: ${item.value}`}</div>;
									}))}
								</div>
							)}
						</div>
						<span className='padding--medium-h font-color--grey' {...buttonProductDescriptionAttribute}>{fullProductDescriptionButtonText}</span>
					</div>
				</div>
			);

			const commentsView = this.isLogin ? (
				<Link to={`/product/comments/${match.params.id}`} className='font--lato-normal font-color--primary-ext-2'>
					{(comments.total === 0) && 'Tulis Komentar'}
					{(comments.total > 0) && `Lihat Semua ${comments.total} Komentar`}
				</Link>
			) : (
				<span>
					<a href={`/login?redirect_uri=${this.props.location.pathname}`}>Log in</a> /
					<a href={`/register?redirect_uri=${this.props.location.pathname}`}>Register</a> untuk memberikan komentar
				</span>
				);

			const commentsBlockView = (
				<div className='margin--medium-v --disable-flex padding--medium-h'>
					{commentsView}
					{(!_.isUndefined(comments) && !_.isUndefined(comments.summary) && !_.isEmpty(comments.summary)) && (
						<Comment type='lite-review' data={comments.summary} />
					)}
				</div>
			);

			return (
				<div className='can-copy'>
					<Page color='white'>
						{status.isZoomed && this.renderZoom()}
						<div style={{ marginTop: '-60px', marginBottom: '70px' }}>
							{(_.isEmpty(cardProduct) || !_.has(cardProduct, 'images')) &&
								<div style={{ height: (screen.height * 0.5) }}>
									{this.loadingContent}
								</div>
							}

							{!_.isEmpty(cardProduct) && _.has(cardProduct, 'images') && (
								<div ref={(n) => { this.carouselEL = n; }} >
									<Card.Product
										pdp
										setCarouselSlideIndex={this.setCarouselSlideIndex}
										slideIndex={carousel.slideIndex}
										onImageItemClick={this.handleImageItemClick}
										data={cardProduct || {}}
										isLoved={status.isLoved}
										disabledLovelist={loading}
										onBtnLovelistClick={this.handleLovelistClick}
										onBtnCommentClick={this.redirectToPage}
										onBtnBeliClick={this.handleBtnBeliClicked}
										linkToPdpDisabled={this.linkToPdpDisabled}
										totalComments={comments.total}
										totalLovelist={cardProduct.totalLovelist}
										outOfStock={outOfStock}
										linkToBrand={urlBuilder.setId(brand.id).setName(brand.name).buildBrand()}
									/>
								</div>
							)}

							{!_.isEmpty(detail) && status.hasVariantSize && (
								<div className='flex-center padding--medium-h border-top'>
									<div className='margin--medium-v'>
										<div className='flex-row flex-spaceBetween'>
											<div className='font-medium'>Pilih Ukuran</div>
											{(!_.isEmpty(cardProduct) && _.has(cardProduct, 'hasSizeGuide') && cardProduct.hasSizeGuide) &&
												<Link to='/product/guide' className='d-flex font-color--primary font--lato-bold font-color-primary flex-row flex-middle'>
													<Svg src='ico_sizeguide.svg' /> <span className='padding--small-h font--lato-bold font-color--primary padding--none-r'>PANDUAN UKURAN</span>
												</Link>
											}
										</div>
										<div className='margin--medium-v horizontal-scroll margin--none-b' style={{ overflow: 'hidden' }}>
											<Radio
												name='size'
												checked={this.state.size}
												variant='rounded'
												style={{ marginTop: '10px', marginBottom: '10px' }}
												onChange={this.handleSelectVariant}
												data={cardProduct.variants}
											/>
										</div>
										{(detail.is_product_available !== 0 && !_.isEmpty(selectedVariant) && (selectedVariant.warning_stock_text !== '')) && (
											<p className='font-color--red font-small'>{selectedVariant.warning_stock_text}</p>
										)}
										{detail.is_product_available === 0 && <p className='font-color--red font-small'>Produk Tidak Tersedia</p>}
									</div>
								</div>
							)}
							{!_.isEmpty(promo.meta_data.ovo_reward) && (
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
							{(!_.isEmpty(detail) && !status.hasVariantSize && detail.is_product_available === 0) && (
								<div className='flex-center padding--medium-h border-top'>
									<div className='margin--medium-v'>{detail.is_product_available === 0 && <p className='font-color--red font-small'>Produk Tidak Tersedia</p>}</div>
								</div>
							)}

							{product.loading ? this.loadingContent : (
								<div>
									{productDetailView}
									{commentsBlockView}
								</div>
							)}
							{/* ----------------------------	END OF PDP MAIN CONTENT (CARD PRODUCT) ---------------------------- */}

							<div style={{ backgroundColor: '#F5F5F5' }}>
								{/* ----------------------------	PRODUCT REVIEWS ---------------------------- */}
								<ReviewSummary
									productId={id}
									reviews={reviews}
									seller={seller}
									loading={product.loading}
									onBtnSeeAllReviewClick={() => this.redirectToPage('reviews')}
								/>
								{/* ----------------------------	END OF REVIEW ---------------------------- */}

								{/* ----------------------------	SELLER PROFILE ---------------------------- */}
								{product.loading ? this.loadingContent : (
									<div className='padding--small-h' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
										{!_.isEmpty(detail) && (
											<SellerProfile
												image={detail.seller.seller_logo}
												status='gold'
												isNewStore={seller.is_new_seller}
												successOrder={(!_.isUndefined(seller.success_order.rate)) ? (seller.success_order.rate || 0) : 0}
												rating={seller.rating}
												totalProduct={(!_.isUndefined(store.info.product_count)) ? (store.info.product_count || 0) : 0}
												name={detail.seller.seller}
												location={detail.seller.seller_location}
												description=''
												storeAddress={urlBuilder.setId(detail.seller.seller_id).setName(detail.seller.seller).buildStore()}
												badgeImage={seller.seller_badge_image}
											/>
										)
										}

										{(!_.isEmpty(product.store.products)) && (
											<div className='margin--medium-v margin--none-t'>
												<Link to={urlBuilder.setId(detail.seller.seller_id).setName(detail.seller.seller).buildStore()} >
													{this.renderStoreProducts()}
												</Link>
											</div>
										)}
									</div>
								)}
								{/* ----------------------------	END OF SELLER PROFILE ---------------------------- */}

								{/* ----------------------------	PROMOS PRODUCTs ---------------------------- */}
								<Promos
									promo={promo}
									loading={loading}
									loginNow={this.handleLovelistClick}
									productId={detail.id}
								/>
							</div>
						</div>
						{this.renderStickyAction()}
						{
							this.state.animation.lovelist && <AnimationLovelist />
						}
						{
							this.state.animation.addToCart && (
								<AnimationAddToCart
									style={{
										top: '-32%',
										left: '50%',
										opacity: '1',
										transform: 'scale(0.1)'
									}}
									image={detail.images[0].thumbnail}
								/>
							)
						}
					</Page>
					<Header.Modal style={(!status.showScrollInfomation && !outOfStock) ? { backgroundColor: 'transparent', border: 'none', boxShadow: 'none' } : {}} {...this.renderHeaderPage()} />

					<ProductModal
						onBtnCloseModalClick={this.handleCloseModalPopUp}
						showConfirmDelete={status.showConfirmDelete}
						onRemoveLovelist={this.removeAddItem}
						showModalSelectSize={status.showModalSelectSize}
						variants={cardProduct.variants}
						onVariantSizeChange={this.handleSelectVariant}
						forceLogin={status.forceLogin}
						onLoginNow={() => this.loginNow(id)}
						showOvoInfo={status.showOvoInfo}
						ovoInfo={promo.meta_data.ovo_info}
						selectedSize={size}
					/>

				</div>);
		} catch (error) {
			// console.log('PDP ERROR: ', error);
			return 'ERROR';
		}
	}
}

const mapStateToProps = (state) => {
	const { promo } = state.product;
	const { recommended_items, similar_items, best_seller_items } = promo;
	promo.recommended_items.products = Discovery.mapPromoProducts(recommended_items.products, state.lovelist);
	promo.similar_items.products = Discovery.mapPromoProducts(similar_items.products, state.lovelist);
	promo.best_seller_items.products = Discovery.mapPromoProducts(best_seller_items.products, state.lovelist);

	return {
		product: state.product,
		shared: state.shared,
		lovelist: state.lovelist,
		users: state.users
	};
};

export default withCookies(connect(mapStateToProps)(Shared(Products, doAfterAnonymous)));
