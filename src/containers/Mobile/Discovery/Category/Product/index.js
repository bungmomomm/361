import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import queryString from 'query-string';
import { to } from 'await-to-js';

import Shared from '@/containers/Mobile/Shared';
import Scroller from '@/containers/Mobile/Shared/scroller';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import Filter from '@/containers/Mobile/Shared/Filter';
import Sort from '@/containers/Mobile/Shared/Sort';

import { 
	Header, 
	Page, 
	Card, 
	Svg, 
	Tabs, 
	Button, 
	Level, 
	Input, 
	Navigation,
	Spinner,
	Comment
} from '@/components/mobile';

import { actions as pcpActions } from '@/state/v4/ProductCategory';
import { actions as commentActions } from '@/state/v4/Comment';
import { actions as lovelistActions } from '@/state/v4/Lovelist';

import { hyperlink, renderIf } from '@/utils';
import stylesCatalog from '../Catalog/catalog.scss';

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
			}
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
		const urlParam = {
			sort: query.sort,
			per_page: query.per_page,
			page: query.page,
			...parsedUrl,
			...params
		};

		const url = queryString.stringify(urlParam, {
			encode: false
		});
		history.push(`?${url}`);

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
			dispatch(commentActions.bulkieCommentAction(cookies.get('user.token'), productIdList));
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
		if (e === 'view') {
			const { viewMode, dispatch } = this.props;
			const mode = viewMode.mode === 3 ? 1 : viewMode.mode + 1;
			dispatch(pcpActions.viewModeAction(mode));
		} else {
			this.setState({
				showFilter: e === 'filter',
				showSort: e === 'sort'
			});
		}
	}

	renderPage() {
		const { productCategory } = this.props;
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
				{this.renderHeader()}
				{this.renderTabs()}
				{this.renderForeverBanner()}
				<Navigation active='Categories' />
			</div>
		);
	}

	renderPcp() {
		let pcpView = null;
		const { isLoading, productCategory } = this.props;

		if (isLoading) {
			pcpView = this.loadingView;
		} 

		if (productCategory.pcpStatus !== '') {
			if (productCategory.pcpStatus === 'success') {
				pcpView = (
					<Page>
						<div className={stylesCatalog.cardContainer}>
							{this.renderContent(productCategory.pcpData.products)}
							{this.props.scroller.loading && this.loadingView}
						</div>
					</Page>
				);
			} else if (productCategory.pcpStatus === 'failed') {
				window.location.href = '/not-found';
			}
		}

		return pcpView;
	}

	renderContent(productList) {
		let contentView = null;
		if (productList.length > 0) {
			contentView = (
				productList.map((product, index) =>
					this.renderList(product, index)
				)
			);
		}

		return contentView;
	}

	renderList(productData, index) {
		if (productData) {
			const linkToPdpCreator = hyperlink('', ['product', productData.product_id], null);
			const { viewMode, comments, lovelist } = this.props;
			const commentData = !_.isEmpty(comments.data) ? _.find(comments.data, { product_id: productData.product_id }) : false;
			const commentTotal = commentData ? commentData.total : null;
			const lovelistData = !_.isEmpty(lovelist.bulkieCountProducts) ? _.find(lovelist.bulkieCountProducts, { product_id: productData.product_id }) : false;
			const lovelistTotal = lovelistData ? lovelistData.total : null;
			const lovelistStatus = lovelistData ? lovelistData.status : null;

			const listCardCatalogAttribute = {
				images: productData.images,
				productTitle: productData.product_title,
				brandName: productData.brand.name,
				pricing: productData.pricing,
				linkToPdp: linkToPdpCreator,
				commentTotal,
				commentUrl: `/product/comments/${productData.product_id}`,
				lovelistTotal,
				lovelistStatus
			};
			
			const cardCatalogGridAttribute = {
				key: index,
				images: productData.images,
				productTitle: productData.product_title,
				brandName: productData.brand.name,
				pricing: productData.pricing,
				linkToPdp: linkToPdpCreator
			};
			
			const cardCatalogSmall = {
				key: index,
				images: productData.images,
				pricing: productData.pricing,
				linkToPdp: linkToPdpCreator
			};
			
			switch (viewMode.mode) {
			case 1:
				return (
					<div key={index} className={stylesCatalog.cardCatalog}>
						<Card.Catalog {...listCardCatalogAttribute} />
						{comments && comments.loading ? this.renderLoading : this.renderComment(productData.product_id)}
					</div>
				);
			case 2:
				return (
					<Card.CatalogGrid {...cardCatalogGridAttribute} />
				);
			case 3:
				return (
					<Card.CatalogSmall {...cardCatalogSmall} />
				);
			default:
				return null;
			}
		} else {
			return null;
		}
	}

	renderComment(productId) {
		let commentView = null;
		const { isLoading, comments } = this.props;

		if (isLoading) {
			commentView = this.loadingView;
		}

		if (comments.status === 'success') {
			const commentProduct = _.find(comments.data, { product_id: productId }) || false;
			if (commentProduct) {
				commentView = (
					<div className={stylesCatalog.commentBlock}>
						<Link to={`/product/comments/${commentProduct.product_id}`}>
							<Button>View {commentProduct.total} comments</Button>
						</Link>
						<Comment data={commentProduct.last_comment} pcpComment />
						<Level>
							<Level.Item>
								<Input color='white' placeholder='Write comment' />
							</Level.Item>
						</Level>
					</div>
				);
			}
		}

		return commentView;
	}

	renderHeader() {
		const { isLoading, productCategory } = this.props;
		const headerTitle = _.chain(productCategory).get('pcpData.info.title').value() || 'PCP Title';
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
				<div>
					<Tabs
						className={stylesCatalog.filterBlockContainer}
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
					{renderIf(sorts)(
						<Sort shown={showSort} sorts={sorts} onSort={(e, value) => this.sort(e, value)} />
					)}
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
	return {
		// ...state,
		productCategory: state.productCategory,
		query: state.productCategory.query,
		comments: state.comments,
		isLoading: state.productCategory.isLoading,
		viewMode: state.productCategory.viewMode,
		scroller: state.scroller,
		shared: state.shared
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, match, location, productCategory } = props;

	const categoryId = _.chain(match).get('params.categoryId').value() || '';
	const parsedUrl = queryString.parse(location.search);
	const pcpParam = {
		category_id: parseInt(categoryId, 10),
		page: parsedUrl.page !== undefined ? parseInt(parsedUrl.page, 10) : 1,
		per_page: parsedUrl.per_page !== undefined ? parseInt(parsedUrl.per_page, 10) : 36,
		fq: parsedUrl.fq !== undefined ? parsedUrl.fq : '',
		sort: parsedUrl.sort !== undefined ? parsedUrl.sort : 'energy DESC',
	};
	
	dispatch(pcpActions.pcpAction({ token: cookies.get('user.token'), query: pcpParam }));
	
	if (!_.isEmpty(productCategory.pcpData.products)) {
		const productIdList = _.map(productCategory.pcpData.products, 'product_id') || null;
		dispatch(commentActions.bulkieCommentAction(cookies.get('user.token'), productIdList));
		dispatch(lovelistActions.bulkieCountByProduct(cookies.get('user.token'), productIdList));
	}
};

export default withCookies(connect(mapStateToProps)(Scroller(Shared(Product, doAfterAnonymous))));
