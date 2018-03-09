import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import queryString from 'query-string';
import to from 'await-to-js';

import Shared from '@/containers/Mobile/Shared';
import Scroller from '@/containers/Mobile/Shared/scroller';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import Filter from '@/containers/Mobile/Shared/Filter';
import Sort from '@/containers/Mobile/Shared/Sort';

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
	Spinner,
} from '@/components/mobile';

import { actions as pcpActions } from '@/state/v4/ProductCategory';
import { actions as searchActions } from '@/state/v4/SearchResults';
import { actions as lovelistActions } from '@/state/v4/Lovelist';

import { 
	urlBuilder,
	renderIf
} from '@/utils';
import stylesCatalog from '../Catalog/catalog.scss';
import Footer from '@/containers/Mobile/Shared/footer';

class Product extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		const propsObject = _.chain(props.productCategory);
		this.state = {
			mode: 1,
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
			isFooterShow: true
		};
		this.loadingView = <div style={{ margin: '20px auto 20px auto' }}><Spinner /></div>;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.query) {
			this.setState({
				query: nextProps.query
			});
		}
	}

	async onApply(e, fq) {
		const { query } = this.state;
		query.fq = fq;
		this.setState({
			query,
			showFilter: false
		});
		this.update({
			fq
		});
	}

	onClose(e) {
		this.setState({
			showFilter: false
		});
	}

	update = async (params) => {
		const { cookies, dispatch, location, history } = this.props;
		const { query } = this.state;

		const parsedUrl = queryString.parse(location.search);

		const url = queryString.stringify({
			sort: query.sort,
			per_page: query.per_page,
			page: query.page,
			...parsedUrl,
			...params
		}, {
			encode: false
		});
		
		history.replace(`?${url}`);

		const pcpParam = {
			...query,
			...params
		};

		const [err, response] = await to(dispatch(pcpActions.pcpAction({ token: cookies.get('user.token'), query: pcpParam })));
		if (err) {
			console.log(err);
			return err;
		}
		if (!_.isEmpty(response.pcpData.products)) {
			const productIdList = _.map(response.products, 'product_id') || null;
			dispatch(searchActions.bulkieCommentAction(cookies.get('user.token'), productIdList));
			dispatch(lovelistActions.bulkieCountByProduct(cookies.get('user.token'), productIdList));
		}
		return response;
	}

	sort(e, sort) {
		this.setState({
			sort,
			showSort: false
		});
		this.update({
			sort: sort.q
		});
	}

	handlePick(e) {
		const { showSort } = this.state;
		const { viewMode, dispatch } = this.props;
		if (e === 'view') {
			console.log('request');
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

	renderPage() {
		const { productCategory, isLoading } = this.props;
		const { showFilter } = this.state;
		if (showFilter) {
			return (
				<Filter
					shown={showFilter}
					filters={productCategory.pcpData}
					onApply={(e, fq) => {
						this.onApply(e, fq);
					}}
					onClose={(e) => this.onClose(e)}
				/>
			);
		}
		return (
			<div style={this.props.style}>
				{this.renderPcp()}
				{isLoading && (
					<Spinner />
				)}
				{this.renderHeader()}
				{this.renderTabs()}
				{this.renderForeverBanner()}
				<Navigation active='Categories' scroll={this.props.scroll} />
			</div>
		);
	}

	renderPcp() {
		const { comments, isLoading, productCategory, scroller, viewMode } = this.props;

		if (isLoading) {
			return this.loadingView;
		} 

		if (productCategory.pcpStatus !== '') {
			if (productCategory.pcpStatus === 'success') {
				let listView;
				switch (viewMode.mode) {
				case 1:
					listView = (
						<CatalogView comments={comments} loading={scroller.loading} forceLoginNow={() => this.forceLoginNow()} products={productCategory.pcpData.products} />
					);
					break;
				case 2:
					listView = (
						<GridView loading={scroller.loading} forceLoginNow={() => this.forceLoginNow()} products={productCategory.pcpData.products} />
					);
					break;
				case 3:
					listView = (
						<SmallGridView loading={scroller.loading} products={productCategory.pcpData.products} />
					);
					break;
				default:
					listView = null;
					break;
				}
				return (
					<Page>
						{listView}
						<Footer isShow={this.state.isFooterShow} />
					</Page>
				);
			} else if (productCategory.pcpStatus === 'failed') {
				window.location.href = '/not-found';
			}
		}

		return null;
	}

	renderHeader() {
		const { isLoading, productCategory } = this.props;
		const headerTitle = _.chain(productCategory).get('pcpData.info.title').value();
		const HeaderPage = {
			left: (
				<Link to='/sub-category'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: isLoading ? this.loadingView : headerTitle,
			right: null
		};

		return (
			<Header.Modal {...HeaderPage} />
		);
	}

	renderTabs() {
		const { productCategory, viewMode } = this.props;
		const { showSort } = this.state;
		let tabsView = null;
		if (!_.isEmpty(productCategory.pcpData.products)) {
			const sorts = _.chain(productCategory).get('pcpData.sorts').value() || [];
			tabsView = (
				<div className={'tabContainer'}>
					{renderIf(sorts)(
						<Sort shown={showSort} isSticky sorts={sorts} onSort={(e, value) => this.sort(e, value)} />
					)}
					<Tabs
						className={stylesCatalog.filterBlockContainer}
						type='segment'
						isSticky
						variants={[
							{
								id: 'sort',
								title: 'Urutkan',
								disabled: typeof productCategory.pcpData === 'undefined'
							},
							{
								id: 'filter',
								title: 'Filter',
								disabled: typeof productCategory.pcpData === 'undefined'	
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
		}
		return tabsView;
	}

	renderForeverBanner() {
		const { shared, dispatch } = this.props;

		return <ForeverBanner {...shared.foreverBanner} dispatch={dispatch} />;
	}

	render() {
		return this.renderPage();
	}
}

const mapStateToProps = (state) => {
	const { comments, lovelist, productCategory } = state;
	productCategory.pcpData.products = _.map(productCategory.pcpData.products, (product) => {
		const commentData = !_.isEmpty(comments.data) ? _.find(comments.data, { product_id: product.product_id }) : false;
		const lovelistData = !_.isEmpty(lovelist.bulkieCountProducts) ? _.find(lovelist.bulkieCountProducts, { product_id: product.product_id }) : false;
		if (lovelistData) {
			product.lovelistTotal = lovelistData.total;
			product.lovelistStatus = lovelistData.status;
		}
		if (commentData) {
			product.commentTotal = commentData.total;
		}
		return {
			...product,
			url: urlBuilder.buildPdp(product.product_title, product.product_id),
			commentUrl: `/${urlBuilder.buildPcpCommentUrl(product.product_id)}`
		};
	});

	return {
		...state,
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
	
	const response = await dispatch(pcpActions.pcpAction({ token: cookies.get('user.token'), query: pcpParam }));
	
	const productIdList = _.map(response.pcpData.products, 'product_id') || [];
	if (productIdList.length > 0) {
		await dispatch(searchActions.bulkieCommentAction(cookies.get('user.token'), productIdList));
		await dispatch(lovelistActions.bulkieCountByProduct(cookies.get('user.token'), productIdList));
	}
};

export default withCookies(connect(mapStateToProps)(Scroller(Shared(Product, doAfterAnonymous))));
