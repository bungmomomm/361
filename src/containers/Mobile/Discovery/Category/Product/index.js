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
import { userToken } from '@/data/cookiesLabel';

import Discovery from '../../Utils';

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
			list: 'mm'
		};
	}) || [];
	const request = new TrackingRequest();
	request.setEmailHash('').setUserId('').setUserIdEncrypted('').setCurrentUrl(props.location.pathname);
	request.setFusionSessionId('').setIpAddress('').setImpressions(impressions).setCategoryInfo(categoryInfo);
	request.setListProductId(productId.join('|'));
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

class Product extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		const propsObject = _.chain(props.productCategory);
		this.state = {
			showFilter: false,
			showSort: false,
			query: {
				category_id: '',
				page: 0,
				per_page: 0,
				fq: '',
				sort: '',
				...propsObject.get('query').value()
			},
			isFooterShow: true,
			focusedProductId: ''
		};
		this.loadingView = <Spinner />;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.query) {
			this.setState({
				query: nextProps.query
			});
		}

		if (nextProps.productCategory.pcpData !== this.props.productCategory.pcpData) {
			const pcpData = nextProps.productCategory.pcpData;
			trackCategoryPageView(pcpData.products, pcpData.info, nextProps);
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
			page: 0
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
			page: 0
		});
	}

	handlePick(e) {
		const { showSort } = this.state;
		const { viewMode, dispatch } = this.props;
		if (e === 'view') {
			const mode = viewMode.mode === 3 ? 1 : viewMode.mode + 1;
			dispatch(pcpActions.viewModeAction(mode));
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
		const { shared, dispatch } = this.props;

		return <ForeverBanner {...shared.foreverBanner} dispatch={dispatch} />;
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
		const { isLoading, comments, productCategory, scroller, viewMode, location } = this.props;
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

				return (
					<Page color='white'>
						<SEO
							paramCanonical={process.env.MOBILE_UR}
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
		const { productCategory, cookies } = this.props;
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
			scroll: this.props.scroll
		};
		
		if (cookies.get('page.referrer') === 'HOME') {
			navigationAttribute.active = 'Home';
		} else {
			navigationAttribute.active = 'Categories';
		}

		return (
			<div style={this.props.style}>
				{this.productsBlock()}
				{this.headerBlock()}
				<Navigation
					{...navigationAttribute}
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
		viewMode: state.productCategory.viewMode,
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, match, location } = props;

	const categoryId = _.chain(match).get('params.categoryId').value() || '';
	const parsedUrl = queryString.parse(location.search);
	const pcpParam = {
		category_id: parseInt(categoryId, 10),
		page: parsedUrl.page !== undefined ? parseInt(parsedUrl.page, 10) : 1,
		per_page: parsedUrl.per_page !== undefined ? parseInt(parsedUrl.per_page, 10) : 36,
		fq: parsedUrl.fq !== undefined ? parsedUrl.fq : '',
		sort: parsedUrl.sort !== undefined ? parsedUrl.sort : 'energy DESC',
	};

	const response = await dispatch(pcpActions.pcpAction({ token: cookies.get(userToken), query: pcpParam }));

	const productIdList = _.map(response.pcpData.products, 'product_id') || [];
	if (productIdList.length > 0) {
		await dispatch(commentActions.bulkieCommentAction(cookies.get(userToken), productIdList));
		await dispatch(lovelistActions.bulkieCountByProduct(cookies.get(userToken), productIdList));
	}
};

export default withCookies(connect(mapStateToProps)(Scroller(Shared(Product, doAfterAnonymous))));
