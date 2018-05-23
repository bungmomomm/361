import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import {
	Page,
	Navigation,
	Svg,
	Header,
	Tabs,
	SEO
} from '@/components/mobile';
import styles from './brands.scss';
import _ from 'lodash';
import { Filter, Sort } from '@/containers/Mobile/Widget';
import { actions as brandAction } from '@/state/v4/Brand';
import Shared from '@/containers/Mobile/Shared';
import EmptyState from '@/containers/Mobile/Shared/emptyState';
import queryString from 'query-string';
import { renderIf, urlBuilder } from '@/utils';
import Scroller from '@/containers/Mobile/Shared/scroller';
import Share from '@/components/mobile/Share';
import Footer from '@/containers/Mobile/Shared/footer';
import { actions as commentActions } from '@/state/v4/Comment';
import { actions as lovelistActions } from '@/state/v4/Lovelist';
import Spinner from '@/components/mobile/Spinner';
import Discovery from '../Utils';
import {
	CatalogView,
	GridView,
	SmallGridView,
} from '@/containers/Mobile/Discovery/View';
import { Utils } from '@/utils/tracking/lucidworks';
import {
	TrackingRequest,
	sendGtm,
	categoryViewBuilder,
	productClickBuilder
} from '@/utils/tracking';
import { Collector } from '@/utils/tracking/emarsys';
import { userToken, pageReferrer, isLogin } from '@/data/cookiesLabel';

const trackBrandPageView = (products, info, props) => {
	const productId = _.map(products, 'product_id') || [];
	const categoryInfo = {
		id: props.match.params.brandId,
		name: info.title,
		url_path: props.location.pathname
	};
	const impressions = _.map(products, (product, key) => {
		return {
			name: product.product_title,
			id: product.product_id,
			price: product.pricing.original.effective_price,
			brand: product.brand.name,
			category: product.product_category_names.join('/'),
			position: key + 1,
			list: product.source
		};
	}) || [];
	const { users, shared } = props;
	const { userProfile } = users;
	const layerData = {
		emailHash: _.defaultTo(userProfile.enc_email, ''),
		userIdEncrypted: userProfile.enc_userid,
		userId: userProfile.id,
		ipAddress: shared.ipAddress || userProfile.ip_address,
		currentUrl: props.location.pathname,
		impressions,
		categoryInfo,
		listProductId: productId.join('|'),
		fusionSessionId: Utils.getSessionID()
	};
	const request = new TrackingRequest(layerData);
	const requestPayload = request.getPayload(categoryViewBuilder);
	if (requestPayload) sendGtm(requestPayload);
};

const trackProductOnClick = (product, position, source = 'mm') => {
	const productData = {
		name: product.product_title,
		id: product.product_id,
		price: product.pricing.original.effective_price,
		brand: product.brand.name,
		category: product.product_category_names.join('/'),
		position
	};
	const request = new TrackingRequest();
	request.setFusionSessionId('').setProducts([productData]).setSourceName(source);
	const requestPayload = request.getPayload(productClickBuilder);
	if (requestPayload) sendGtm(requestPayload);
};
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Detail extends Component {
	static queryObject(props) {
		const brandId = props.match.params.brandId;
		const parsedUrl = queryString.parse(props.location.search);
		return {
			q: parsedUrl.query !== undefined ? parsedUrl.query : '',
			brand_id: Number(brandId),
			store_id: parsedUrl.store_id !== undefined ? parseInt(parsedUrl.store_id, 10) : '',
			category_id: parsedUrl.category_id !== undefined ? parseInt(parsedUrl.category_id, 10) : '',
			page: parsedUrl.page !== undefined ? parseInt(parsedUrl.page, 10) : 1,
			per_page: parsedUrl.per_page !== undefined ? parseInt(parsedUrl.per_page, 10) : process.env.PCP_PER_PAGE,
			fq: parsedUrl.fq !== undefined ? parsedUrl.fq : '',
			sort: parsedUrl.sort !== undefined ? parsedUrl.sort : ''
		};
	}

	constructor(props) {
		super(props);
		this.props = props;
		this.isLogin = this.props.cookies.get(isLogin) === 'true';
		const propsObject = _.chain(props.searchResults);
		this.state = {
			styleHeader: true,
			showFilter: false,
			showSort: false,
			query: {
				per_page: process.env.PCP_PER_PAGE,
				page: 1,
				q: '',
				brand_id: '',
				store_id: '',
				category_id: '',
				fq: '',
				sort: '',
				...propsObject.get('query').value()
			},
			isFooterShow: true,
			newComment: { product_id: '', comment: '' },
			lovelistProductId: null,
			focusedProductId: ''
		};
		this.loadingView = (
			<div style={{ margin: '20px auto 20px auto' }}>
				<Spinner />
			</div>
		);
	}
	componentWillMount() {
		window.scroll(0, 0);

		if ('serviceUrl' in this.props.shared) {
			const { dispatch, match: { params }, cookies } = this.props;
			const qs = queryString.parse(location.search);
			const data = {
				token: cookies.get(userToken),
				query: {
					brand_id: params.brandId || 0,
					...qs
				},
				type: 'init'
			};
			this.setState({
				query: data.query
			});
			dispatch(brandAction.brandProductAction(data));
			dispatch(brandAction.brandBannerAction(cookies.get(userToken), this.props.match.params.brandId));
		}

		const { brands } = this.props;
		const productData = brands.searchData.products || '';

		if (brands && !_.isEmpty(productData)) {
			const { dispatch, cookies } = this.props;

			const productIdList = _.map(productData, 'product_id') || [];
			if (productIdList.length > 0) {
				dispatch(commentActions.bulkieCommentAction(cookies.get(userToken), productIdList));
				dispatch(lovelistActions.bulkieCountByProduct(cookies.get(userToken), productIdList));
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		const { cookies } = this.props;
		if (!('serviceUrl' in this.props.shared) && 'serviceUrl' in nextProps.shared) {
			const { dispatch, match: { params } } = this.props;
			const qs = queryString.parse(location.search);
			const data = {
				token: cookies.get(userToken),
				query: {
					brand_id: params.brandId || 0,
					...qs
				},
				type: 'init'
			};
			this.setState({
				query: data.query
			});
			dispatch(brandAction.brandProductAction(data));
			dispatch(brandAction.brandBannerAction(cookies.get(userToken), nextProps.match.params.brandId));
		}

		if (this.props.brands.searchData.products !== nextProps.brands.searchData.products) {
			const { dispatch } = this.props;
			const productIdList = _.map(nextProps.brands.searchData.products, 'product_id') || [];
			if (productIdList.length > 0) {
				dispatch(commentActions.bulkieCommentAction(cookies.get(userToken), productIdList));
				dispatch(lovelistActions.bulkieCountByProduct(cookies.get(userToken), productIdList));
			}
		}

		if (nextProps.brands.products_lovelist !== this.props.brands.products_lovelist) {
			this.setState({ lovelistProductId: '' });
		}
		if (nextProps.brands.products_comments !== this.props.brands.products_comments) {
			this.setState({ newComment: { product_id: '', comment: '' } });
		}

		if (nextProps.brands.searchData !== this.props.brands.searchData) {
			const data = nextProps.brands.searchData;
			trackBrandPageView(data.products, data.info, nextProps);
		}

		this.handleScroll();

	}

	async componentWillUnmount() {
		const { dispatch } = this.props;
		await dispatch(brandAction.brandProductCleanUp());
	}

	async onApply(e, fq, closeFilter) {
		const { query } = this.state;
		query.fq = fq;
		this.setState({
			query,
			showFilter: !closeFilter
		});
		this.update({
			fq,
			page: 1
		});
	}

	onClose(e) {
		this.setState({
			showFilter: false
		});
	}

	onItemLoved(productId) {
		const { cookies, dispatch } = this.props;
		dispatch(commentActions.bulkieCommentAction(cookies.get(userToken), [productId]));
		dispatch(lovelistActions.bulkieCountByProduct(cookies.get(userToken), [productId]));
	}

	setFocusedProduct(id) {
		this.setState({ focusedProductId: id });
	}

	update = (filters) => {
		const { cookies, dispatch, location, history } = this.props;
		const { query } = this.state;

		const parsedUrl = queryString.parse(location.search);

		urlBuilder.replace(history, {
			query: query.q,
			page: query.page,
			per_page: query.per_page,
			sort: query.sort,
			...parsedUrl,
			...filters
		});

		const data = {
			token: cookies.get(userToken),
			query: {
				...query,
				...filters
			},
			type: 'init'
		};
		dispatch(brandAction.brandProductAction(data));
	}

	handlePick(e) {
		const { showSort } = this.state;
		const { viewMode, dispatch } = this.props;
		if (e === 'view') {
			const mode = viewMode.mode === 3 ? 1 : viewMode.mode + 1;
			dispatch(brandAction.brandViewModeAction(mode));
		} else {
			this.setState({
				showFilter: e === 'filter',
				showSort: showSort ? false : (e === 'sort')
			});
		}
	}

	handleScroll() {
		const { styleHeader } = this.state;
		if (!this.headerEl) return;
		const headerHeight = this.headerEl.getBoundingClientRect().height;
		if (window.scrollY > headerHeight && styleHeader) {
			this.setState({ styleHeader: false });
		}
		if (window.scrollY < headerHeight && !styleHeader) {
			this.setState({ styleHeader: true });
		}
	}

	sort(e, sort) {
		this.setState({
			sort,
			showSort: false
		});
		this.update({
			sort: sort.q,
			page: 1
		});
	}

	forceLoginNow() {
		const { history, location } = this.props;
		history.push(`/login?redirect_uri=${location.pathname}`);
	}

	renderBenner() {
		const { brands } = this.props;
		const brand = _.chain(brands);
		const bannerImages = brand.get('banner.images.original');
		const brandTitle = brand.get('searchData.info.title');
		const imgBg = !bannerImages.isEmpty().value() ? { backgroundImage: `url(${bannerImages.value()})` }
			: { backgroundImage: '' };
		return (
			<div
				className={`${styles.backgroundCover} border-bottom flex-center`}
			>
				<div className={styles.coverImage} style={imgBg} />
				<div>
					<div className='text-uppercase font--lato-bold font-large'>{brandTitle.value() || ''}</div>
				</div>
			</div>
		);
	}

	renderFilter() {
		const { brands, isFiltered, viewMode } = this.props;
		const { showSort } = this.state;
		const sorts = _.chain(this.props.brands).get('searchData.sorts').value() || [];
		return (
			<div className='padding--medium-t'>
				<Tabs
					type='segment'
					variants={[
						{
							id: 'sort',
							title: 'Urutkan',
							disabled: brands.loading_products
						},
						{
							id: 'filter',
							title: 'Filter',
							disabled: brands.loading_products,
							checked: isFiltered
						},
						{
							id: 'view',
							title: <Svg src={viewMode.icon} />,
							disabled: brands.loading_products
						}
					]}
					onPick={e => this.handlePick(e)}
				/>
				{renderIf(sorts)(
					<Sort onCloseOverlay={() => this.setState({ showSort: false })} overlayFixed shown={showSort} sorts={sorts} onSort={(e, value) => this.sort(e, value)} />
				)}
			</div>
		);
	}

	renderProduct() {
		const { brands, comments, scroller, location, viewMode } = this.props;
		const { focusedProductId } = this.state;
		const products = _.chain(brands).get('searchData.products').value() || [];
		const redirectPath = location.pathname !== '' ? location.pathname : '';

		switch (viewMode.mode) {
		case 2:
			return (
				<GridView
					loading={scroller.loading}
					forceLoginNow={() => this.forceLoginNow()}
					productOnClick={trackProductOnClick}
					products={products}
				/>
			);
		case 3:
			return (
				<SmallGridView
					loading={scroller.loading}
					products={products}
					productOnClick={trackProductOnClick}
				/>
			);
		default:
			return (
				<CatalogView
					comments={comments}
					loading={scroller.loading}
					forceLoginNow={() => this.forceLoginNow()}
					products={products}
					productOnClick={trackProductOnClick}
					focusedProductId={focusedProductId}
					setFocusedProduct={(id) => this.setFocusedProduct(id)}
					redirectPath={redirectPath}
				/>
			);
		}
	}

	renderHeader() {
		const { searchData } = this.props.brands;
		const title = (searchData.info) ? searchData.info.title : '';
		const url = `${process.env.MOBILE_URL}${this.props.location.pathname}`;
		const headerComponent = {
			left: (
				<span
					onClick={() => this.props.history.goBack()}
					role='button'
					tabIndex='0'
				>
					<Svg src='ico_arrow-back-left.svg' />
				</span>
			),
			center: !this.state.styleHeader && _.chain(searchData).get('info.title').value(),
			right: <Share title={title} url={url} subHeaderWrapper={this.subHeaderWrapper} />,
			rows: !this.state.styleHeader && this.renderFilter(),
			subHeaderWrapper: (r) => { this.subHeaderWrapper = r; }
		};
		return <Header.Modal className={this.state.styleHeader ? styles.headerClear : ''} {...headerComponent} />;
	}

	renderTotalProduct() {
		const productCount = this.props.brands.searchData.info && this.props.brands.searchData.info.product_count;

		if (productCount === 0) {
			return <EmptyState />;
		}

		return productCount && (<div className='margin--medium-v text-center'>{productCount} Total Produk</div>);
	}

	render() {
		const { cookies, shared, loading } = this.props;
		const { showFilter } = this.state;

		const navigationAttribute = {
			scroll: this.props.scroll
		};
		navigationAttribute.active = cookies.get(pageReferrer);

		return (
			<div style={this.props.style}>
				<SEO
					paramCanonical={`${process.env.MOBILE_URL}${location.pathname}`}
				/>
				{(showFilter) ? (
					<Filter
						shown={showFilter}
						filters={this.props.brands.searchData}
						onApply={(e, fq, closeFilter) => {
							this.onApply(e, fq, closeFilter);
						}}
						onClose={(e) => this.onClose(e)}
					/>
				) : (
					<Page color='white'>
						<div style={{ marginTop: '-112px', marginBottom: '30px' }}>
							<div>
								<div ref={(n) => { this.headerEl = n; }}>
									{this.renderBenner()}
									{this.state.styleHeader && this.renderFilter()}
								</div>
								{loading ? this.loadingView : (
									<div>
										{this.renderTotalProduct()}
										{this.renderProduct()}
									</div>
								)}
								{this.props.scroller.loading && (<div style={{ paddingTop: '20px' }}> <Spinner /></div>)}
							</div>
						</div>
						<Footer isShow={this.state.isFooterShow} />
					</Page>
				)}
				{(!showFilter) && (
					<div>
						{this.renderHeader()}
						<Navigation {...navigationAttribute} botNav={this.props.botNav} isLogin={this.isLogin} totalCartItems={shared.totalCart} />
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { comments, lovelist, brands } = state;
	const { products, facets } = _.chain(brands).get('searchData').value() || { products: [], facets: [] };
	brands.searchData.products = Discovery.mapProducts(products, comments, lovelist);
	const isFiltered = Filter.utils.isFiltered(facets);
	return {
		...state,
		isFiltered,
		brands,
		viewMode: state.brands.viewMode,
		loading: state.brands.loading_products
	};
};

const doAfterAnonymous = async (props) => {
	Collector.push();
};

export default withCookies(connect(mapStateToProps)(Scroller(Shared(Detail, doAfterAnonymous))));
