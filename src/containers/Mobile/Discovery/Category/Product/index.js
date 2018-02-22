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

import { hyperlink, renderIf } from '@/utils';
import stylesCatalog from '../Catalog/catalog.scss';

class Product extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.currentListState = 1;
		this.listType = [{
			type: 'list',
			icon: 'ico_grid.svg'
		}, {
			type: 'grid',
			icon: 'ico_three-line.svg'
		}, {
			type: 'small',
			icon: 'ico_list.svg'
		}];
		const propsObject = _.chain(props.productCategory);
		this.state = {
			listTypeState: this.listType[this.currentListState],
			notification: {
				show: true
			},
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

		console.log('urlParam', urlParam);

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
			this.currentListState = this.currentListState === 2 ? 0 : this.currentListState + 1;
			this.setState({ listTypeState: this.listType[this.currentListState] });
		} else {
			this.setState({
				showFilter: e === 'filter',
				showSort: e === 'sort'
			});
		}
	}

	renderPage() {
		let pageView = null;
		const { productCategory } = this.props;
		const { showFilter } = this.state;

		if (showFilter) {
			pageView = (
				<Filter
					shown={showFilter}
					filters={productCategory.pcpData}
					onApply={(e, fq) => {
						this.onApply(e, fq);
					}}
					onClose={(e) => this.onClose(e)}
				/>
			);
		} else {
			pageView = (
				<div style={this.props.style}>
					{this.renderPcp()}
					{this.renderHeader()}
					{this.renderTabs()}
					{this.renderForeverBanner()}
					<Navigation active='Categories' />
				</div>
			);
		}

		return pageView;
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
		} else {
			contentView = (
				<h3>Empty Data</h3>
			);
		}

		return contentView;
	}

	renderList(productData, index) {
		if (productData) {
			const linkToPdpCreator = hyperlink('', ['product', productData.product_id], null);
			const { comments } = this.props;
			const commentData = !_.isEmpty(comments.data) ? _.find(comments.data, { product_id: productData.product_id }) : false;
			const commentTotal = commentData ? commentData.total : null;

			const listCardCatalogAttribute = {
				images: productData.images,
				productTitle: productData.product_title,
				brandName: productData.brand.name,
				pricing: productData.pricing,
				linkToPdp: linkToPdpCreator,
				commentTotal,
				commentUrl: `/product/comments/${productData.product_id}`
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
			
			switch (this.state.listTypeState.type) {
			case 'list':
				return (
					<div key={index} className={stylesCatalog.cardCatalog}>
						<Card.Catalog {...listCardCatalogAttribute} />
						{comments && comments.loading ? this.renderLoading : this.renderComment(productData.product_id)}
					</div>
				);
			case 'grid':
				return (
					<Card.CatalogGrid {...cardCatalogGridAttribute} />
				);
			case 'small':
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

		return commentView;
	}

	renderHeader() {
		let back = () => { this.props.history.goBack(); };
		if (this.props.history.length === 0) {
			back = () => { this.props.history.push('/'); };
		}

		const { productCategory } = this.props;
		const headerTitle = _.chain(productCategory).get('pcpData.info.title').value() || this.loadingView;
		const HeaderPage = {
			left: (
				<Link to='' onClick={back}>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: headerTitle,
			right: null
		};

		return (
			<Header.Modal {...HeaderPage} />
		);
	}

	renderTabs() {
		const { productCategory } = this.props;
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
								title: <Svg src={this.state.listTypeState.icon} />,
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
		const { shared } = this.props;
		const foreverBannerData = shared.foreverBanner;
		foreverBannerData.show = this.state.notification.show;
		foreverBannerData.onClose = () => this.setState({ notification: { show: false } });

		return <ForeverBanner {...foreverBannerData} />;
	}

	render() {
		return this.renderPage();
	}
}

const mapStateToProps = (state) => {
	return {
		...state,
		productCategory: state.productCategory,
		query: state.productCategory.query,
		comments: state.comments,
		isLoading: state.productCategory.isLoading,
		scroller: state.scroller
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
};

export default withCookies(connect(mapStateToProps)(Scroller(Shared(Product, doAfterAnonymous))));
