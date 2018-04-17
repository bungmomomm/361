import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import _ from 'lodash';
import queryString from 'query-string';
import to from 'await-to-js';

import Shared from '@/containers/Mobile/Shared';
import EmptyState from '@/containers/Mobile/Shared/emptyState';
import Scroller from '@/containers/Mobile/Shared/scroller';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import Footer from '@/containers/Mobile/Shared/footer';
import { Filter, Sort } from '@/containers/Mobile/Widget';
import {
	CatalogView,
	GridView,
	SmallGridView
} from '@/containers/Mobile/Discovery/View';

import {
	Header,
	Page,
	Svg,
	Tabs,
	Navigation,
	Button,
	Spinner,
	SEO
} from '@/components/mobile';

import { actions as pcpActions } from '@/state/v4/ProductCategory';
import { actions as commentActions } from '@/state/v4/Comment';
import { actions as lovelistActions } from '@/state/v4/Lovelist';

import {
	renderIf,
	urlBuilder
} from '@/utils';
import { userToken, pageReferrer, isLogin } from '@/data/cookiesLabel';

import Discovery from '../../Utils';
import { Utils } from '@/utils/tracking/lucidworks';

import {
	TrackingRequest,
	sendGtm,
	categoryViewBuilder,
	productClickBuilder
} from '@/utils/tracking';

const trackCategoryPageView = (products, info, props) => {
	const productId = _.map(products, 'product_id') || [];
	const categoryInfo = {
		id: props.match.params.categoryId,
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
	const layerData = {
		products: [productData],
		sourceName: source,
		fusionSessionId: Utils.getSessionID()
	};
	const request = new TrackingRequest(layerData);
	const requestPayload = request.getPayload(productClickBuilder);
	if (requestPayload) sendGtm(requestPayload);
};
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Product extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		const propsObject = _.chain(props.productCategory);
		this.isLogin = this.props.cookies.get(isLogin) === 'true';
		this.state = {
			showFilter: false,
			showSort: false,
			query: {
				category_id: '',
				page: 1,
				per_page: process.env.PCP_PER_PAGE,
				fq: '',
				sort: '',
				...propsObject.get('query').value()
			},
			isFooterShow: true,
			focusedProductId: ''
		};
		this.loadingView = (
			<div style={{ margin: '20px auto 20px auto' }}>
				<Spinner />
			</div>
		);
	}

	componentWillMount = async () => {
		window.scroll(0, 0);

		const { productCategory } = this.props;
		const productData = productCategory.pcpData.products || '';

		if (!_.isEmpty(productData)) {
			const { dispatch, cookies } = this.props;

			const productIdList = _.map(productData, 'product_id') || [];
			if (productIdList.length > 0) {
				await dispatch(commentActions.bulkieCommentAction(cookies.get(userToken), productIdList));
				await dispatch(lovelistActions.bulkieCountByProduct(cookies.get(userToken), productIdList));
			}
		}
	}

	componentWillReceiveProps = async (nextProps) => {
		if (nextProps.query !== this.props.query) {
			this.setState({
				query: nextProps.query
			});
		}

		if (nextProps.productCategory.pcpData !== this.props.productCategory.pcpData) {
			const pcpData = nextProps.productCategory.pcpData;
			trackCategoryPageView(pcpData.products, pcpData.info, nextProps);
		}

		if (nextProps.match.params.categoryId !== this.props.match.params.categoryId) {
			const { dispatch, cookies } = this.props;

			const categoryId = nextProps.match.params.categoryId || '';
			const parsedUrl = queryString.parse(nextProps.location.search);
			const pcpNewParam = {
				category_id: parseInt(categoryId, 10),
				page: parsedUrl.page !== undefined ? parseInt(parsedUrl.page, 10) : 1,
				per_page: parsedUrl.per_page !== undefined ? parseInt(parsedUrl.per_page, 10) : process.env.PCP_PER_PAGE,
				fq: parsedUrl.fq !== undefined ? parsedUrl.fq : '',
				sort: parsedUrl.sort !== undefined ? parsedUrl.sort : ''
			};

			const response = await dispatch(pcpActions.pcpAction({ token: cookies.get(userToken), query: pcpNewParam }));

			const productIdList = _.map(response.pcpData.products, 'product_id') || [];
			if (productIdList.length > 0) {
				await dispatch(commentActions.bulkieCommentAction(cookies.get(userToken), productIdList));
				await dispatch(lovelistActions.bulkieCountByProduct(cookies.get(userToken), productIdList));
			}
		}
	}

	componentWillUnmount() {
		const { dispatch } = this.props;
		dispatch(pcpActions.loadingAction(true));
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

	setFocusedProduct(id) {
		this.setState({ focusedProductId: id });
	}

	update = async (params) => {
		const { cookies, dispatch, location, history } = this.props;
		const { query } = this.state;

		const parsedUrl = queryString.parse(location.search);

		urlBuilder.replace(history, {
			query: query.q,
			page: query.page,
			per_page: query.per_page,
			sort: query.sort,
			...parsedUrl,
			...params
		});

		const pcpParam = {
			...query,
			...params
		};

		const [err, response] = await to(dispatch(pcpActions.pcpAction({ token: cookies.get(userToken), query: pcpParam })));
		if (err) {
			return err;
		}

		const productIdList = _.map(response.pcpData.products, 'product_id') || [];
		if (!_.isEmpty(productIdList)) {
			dispatch(commentActions.bulkieCommentAction(cookies.get(userToken), productIdList));
			await dispatch(lovelistActions.bulkieCountByProduct(cookies.get(userToken), productIdList));
			trackCategoryPageView(response.pcpData.products, response.pcpData.info, this.props);
		}

		return response;
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

	handlePick(e) {
		const { showSort } = this.state;
		const { viewMode, dispatch, cookies, productCategory } = this.props;
		if (e === 'view') {
			const mode = viewMode.mode === 3 ? 1 : viewMode.mode + 1;

			dispatch(pcpActions.viewModeAction(mode));

			const productData = productCategory.pcpData.products || '';

			if (!_.isEmpty(productData)) {
				const productIdList = _.map(productData, 'product_id') || [];
				if (productIdList.length > 0) {
					dispatch(commentActions.bulkieCommentAction(cookies.get(userToken), productIdList));
					dispatch(lovelistActions.bulkieCountByProduct(cookies.get(userToken), productIdList));
				}
			}
		} else {
			this.setState({
				showFilter: e === 'filter',
				showSort: showSort ? false : (e === 'sort')
			});
		}
	}

	forceLoginNow() {
		const { history } = this.props;
		history.push(`/login?redirect_uri=${encodeURIComponent(location.pathname + location.search)}`);
	}

	foreverBannerBlock() {
		const { shared, dispatch, productCategory: { pcpData: { banner } } } = this.props;
		const foreverBanner = {
			...shared.foreverBanner,
			banner
		};

		return <ForeverBanner {...foreverBanner} dispatch={dispatch} />;
	}

	tabBlock() {
		const { isFiltered, productCategory, viewMode } = this.props;
		const { showSort } = this.state;
		const productChain = _.chain(productCategory);
		let tabsView = null;
		const sorts = productChain.get('pcpData.sorts').value() || [];
		tabsView = (
			<div className={'tabContainer'}>
				{renderIf(sorts)(
					<Sort shown={showSort} onCloseOverlay={() => this.setState({ showSort: false })} isSticky sorts={sorts} onSort={(e, value) => this.sort(e, value)} />
				)}
				<Tabs
					type='segment'
					variants={[
						{
							id: 'sort',
							title: 'Urutkan',
							disabled: typeof productCategory.pcpData === 'undefined'
						},
						{
							id: 'filter',
							title: 'Filter',
							disabled: typeof productCategory.pcpData === 'undefined',
							checked: isFiltered
						},
						{
							id: 'view',
							title: <Svg src={viewMode.icon} />,
							disabled: productCategory.isLoading
						}
					]}
					onPick={e => this.handlePick(e)}
				/>
			</div>
		);
		return tabsView;
	}

	productsBlock() {
		const { isLoading, comments, productCategory, scroller, viewMode, location, match } = this.props;
		const { focusedProductId } = this.state;
		if (productCategory.pcpStatus !== '') {
			if (productCategory.pcpStatus === 'success') {
				const products = productCategory.pcpData.products;

				let productsView;
				if (!_.isEmpty(products)) {
					const info = productCategory.pcpData.info;
					const redirectPath = location.pathname !== '' ? location.pathname : '';

					let listView;
					switch (viewMode.mode) {
					case 1:
						listView = (
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
						break;
					case 2:
						listView = (
							<GridView
								loading={scroller.loading}
								forceLoginNow={() => this.forceLoginNow()}
								products={products}
								productOnClick={trackProductOnClick}
							/>
						);
						break;
					case 3:
						listView = (
							<SmallGridView
								loading={scroller.loading}
								products={products}
								productOnClick={trackProductOnClick}
							/>
						);
						break;
					default:
						listView = null;
						break;
					}

					productsView = (
						<div>
							<div className='text-center margin--medium-v'>{info.product_count} Total Produk</div>
							{listView}
						</div>
					);
				} else {
					productsView = <EmptyState />;
				}

				const categoryId = _.chain(match).get('params.categoryId').value() || '';

				return (
					<Page color='white'>
						<SEO
							paramCanonical={`${process.env.MOBILE_URL}${location.pathname}`}
							paramAlternate={`android-app://com.mataharimall.mmandroid/mataharimall/category/${categoryId}?utm_source=app_indexing`}
						/>
						{this.foreverBannerBlock()}
						{isLoading ? this.loadingView : productsView}
						<Footer isShow={this.state.isFooterShow} />
					</Page>
				);
			} else if (productCategory.pcpStatus === 'failed') {
				window.location.href = '/not-found';
			}
		}

		return null;
	}

	headerBlock() {
		const { history, isLoading, productCategory } = this.props;

		let back = () => {
			history.goBack();
		};
		if (history.length === 0) {
			back = () => {
				history.push('/');
			};
		}

		const headerTitle = _.chain(productCategory).get('pcpData.info.title').value();
		const HeaderPage = {
			left: (
				<Button onClick={back}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: isLoading ? this.loadingView : headerTitle,
			right: null,
			rows: this.tabBlock()
		};

		return (
			<Header.Modal {...HeaderPage} />
		);
	}

	renderPage() {
		const { shared, productCategory, cookies } = this.props;
		const { showFilter } = this.state;
		if (showFilter) {
			return (
				<Filter
					shown={showFilter}
					filters={productCategory.pcpData}
					onApply={(e, fq, closeFilter) => {
						this.onApply(e, fq, closeFilter);
					}}
					onClose={(e) => this.onClose(e)}
				/>
			);
		}

		const navigationAttribute = {
			scroll: this.props.scroll,
			totalCartItems: shared.totalCart
		};
		navigationAttribute.active = cookies.get(pageReferrer);
		navigationAttribute.isLogin = this.isLogin;

		return (
			<div style={this.props.style}>
				{this.productsBlock()}
				{this.headerBlock()}
				<Navigation
					{...navigationAttribute}
					botNav={this.props.botNav}
				/>
			</div>
		);
	}

	render() {
		return this.renderPage();
	}
}

const mapStateToProps = (state) => {
	const { comments, lovelist, productCategory } = state;
	const { products, facets } = _.chain(productCategory).get('pcpData').value() || { products: [], facets: [] };
	productCategory.pcpData.products = Discovery.mapProducts(products, comments, lovelist);
	const isFiltered = Filter.utils.isFiltered(facets);

	return {
		...state,
		isFiltered,
		productCategory,
		query: state.productCategory.query,
		isLoading: state.productCategory.isLoading,
		viewMode: state.productCategory.viewMode
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, match, location, history } = props;

	const categoryId = _.chain(match).get('params.categoryId').value() || '';
	const categoryTitle = _.chain(match).get('params.categoryTitle').value() || '';
	const brandTitle = _.chain(match).get('params.brandTitle').value() || '';

	const parsedUrl = queryString.parse(location.search);
	const pcpParam = {
		category_id: parseInt(categoryId, 10),
		page: parsedUrl.page !== undefined ? parseInt(parsedUrl.page, 10) : 1,
		per_page: parsedUrl.per_page !== undefined ? parseInt(parsedUrl.per_page, 10) : process.env.PCP_PER_PAGE,
		fq: parsedUrl.fq !== undefined ? parsedUrl.fq : '',
		sort: parsedUrl.sort !== undefined ? parsedUrl.sort : ''
	};

	if (!_.isEmpty(brandTitle)) {
		pcpParam.fq = `brand_name:${brandTitle},${pcpParam.fq}`;
	}

	const response = await dispatch(pcpActions.pcpAction({ token: cookies.get(userToken), query: pcpParam }));

	if (!_.isEmpty(categoryTitle)) {
		const realCategoryTitle = _.chain(response).get('pcpData.info.title').value() || '';
		const realCategoryTitleSlug = urlBuilder.setName(realCategoryTitle).name;

		if (!_.isEmpty(realCategoryTitle) && categoryTitle !== realCategoryTitleSlug) {
			const newUrl = urlBuilder.setId(categoryId).setName(realCategoryTitle).buildPcp();
			history.replace(newUrl);
		}
	}

	const productIdList = _.map(response.pcpData.products, 'product_id') || [];
	if (productIdList.length > 0) {
		await dispatch(commentActions.bulkieCommentAction(cookies.get(userToken), productIdList));
		await dispatch(lovelistActions.bulkieCountByProduct(cookies.get(userToken), productIdList));
	}
};

export default withCookies(connect(mapStateToProps)(Shared(Scroller(Product), doAfterAnonymous)));
