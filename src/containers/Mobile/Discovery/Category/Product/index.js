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

import { Header, Page, Card, Svg, Tabs, Navigation, Comment, Button, Level, Input } from '@/components/mobile';
import Spinner from '../../../../../components/mobile/Spinner';

import { actions as pcpActions } from '@/state/v4/ProductCategory';
import { actions as filterActions } from '@/state/v4/SortFilter';
import { actions as commentActions } from '@/state/v4/Comment';

import { hyperlink } from '@/utils';
import stylesCatalog from '../Catalog/catalog.scss';

class Product extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.currentListState = 0;
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
		this.state = {
			listTypeState: this.listType[this.currentListState],
			notification: {
				show: true
			},
			filterShown: false,
			sortShown: false
		};
	}

	async onApply(e) {
		console.log('onApply called');
		const { dispatch, cookies, filters } = this.props;
		const [err, response] = await to(dispatch(new filterActions.applyFilter(cookies.get('user.token'), 'category', filters)));
		console.log(err, response);
		if (err) {
			return err;
		}
		this.setState({
			filterShown: false
		});
		console.log(response);
		return response;
	}

	onUpdateFilter(e, type, value) {
		try {
			this.props.dispatch(new filterActions.updateFilter(type, value));
		} catch (error) {
			console.log(error);
		}
	}

	onReset(e) {
		this.props.dispatch(new filterActions.resetFilter());
	}

	onClose(e) {
		this.setState({
			filterShown: false
		});
	}

	sort(e, value) {
		this.setState({
			sortShown: false
		});
		this.props.dispatch(new filterActions.updateSort(value));
	}

	handlePick(e) {
		if (e === 'view') {
			this.currentListState = this.currentListState === 2 ? 0 : this.currentListState + 1;
			this.setState({ listTypeState: this.listType[this.currentListState] });
		} else {
			this.setState({
				filterShown: e === 'filter',
				sortShown: e === 'sort'
			});
		}
	}

	loadingView() {
		return (
			<div style={this.props.style}>
				<Spinner />
			</div>
		);
	}

	renderPage() {
		let pageView = null;
		const { filters } = this.props;
		const { filterShown } = this.state;

		if (filterShown) {
			pageView = (
				<Filter
					shown={filterShown}
					filters={filters}
					onUpdateFilter={(e, type, value) => this.onUpdateFilter(e, type, value)}
					onApply={(e) => {
						this.onApply(e);
					}}
					onReset={(e) => this.onReset(e)}
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

					{this.props.scroller.loading}
				</div>
			);
		}

		return pageView;
	}

	renderPcp() {
		let pcpView = (<Spinner />);
		const { filters } = this.props;
		const { sortShown } = this.state;
		const pcpResults = this.props.productCategory;

		if (pcpResults.pcpStatus !== undefined && pcpResults.pcpStatus !== '') {
			if (pcpResults.pcpStatus === 'success' /* && pcpResults.pcpData.products.length > 0 */) {
				pcpView = (
					<Page>
						<div className={stylesCatalog.cardContainer}>
							{this.renderContent(pcpResults.pcpData.products)}
						</div>
						<Sort shown={sortShown} sorts={filters.sorts} onSelected={(e, value) => this.sort(e, value)} />
					</Page>
				);
			} else if (pcpResults.pcpStatus === 'failed') {
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
			
			const listCardCatalogAttribute = {
				images: productData.images,
				productTitle: productData.product_title,
				brandName: productData.brand,
				pricing: productData.pricing,
				linkToPdp: linkToPdpCreator
			};
			
			const cardCatalogGridAttribute = {
				key: index,
				images: productData.images,
				productTitle: productData.product_title,
				brandName: productData.brand,
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
						<Card.Catalog
							{...listCardCatalogAttribute}
							commentTotal={comments.total}
							commentUrl={`/product/comments/${productData.product_id}`}
						/>
						{comments && comments.loading ? <Spinner /> : this.renderComment(productData.product_id)}
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
		const { comments } = this.props;
		if (comments && comments.data !== null && comments.data.length > 0) {
			const commentData = _.find(comments.data, { product_id: productId }) || null;
			commentView = (
				<div className={stylesCatalog.commentBlock}>
					<Link to={`/product/comments/${commentData.product_id}`}>
						<Button>View {commentData.total} comments</Button>
					</Link>
					<Comment data={commentData.last_comment} pcpComment />
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

		const pcpResults = this.props.productCategory;
		const headerTitle = _.chain(pcpResults).get('pcpData.info.title').value();
		const HeaderPage = {
			left: (
				<Link to='' onClick={back}>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: headerTitle || <Spinner />,
			right: null
		};

		return (
			<Header.Modal {...HeaderPage} />
		);
	}

	renderTabs() {
		return (
			<Tabs
				className={stylesCatalog.fixed}
				type='segment'
				variants={[
					{
						id: 'sort',
						title: 'Urutkan'
					},
					{
						id: 'filter',
						title: 'Filter'
					},
					{
						id: 'view',
						title: <Svg src={this.state.listTypeState.icon} />
					}
				]}
				onPick={e => this.handlePick(e)}
			/>
		);
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
		shared: state.shared,
		productCategory: state.productCategory,
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
		per_page: parsedUrl.per_page !== undefined ? parseInt(parsedUrl.per_page, 10) : 10,
		fq: parsedUrl.fq !== undefined ? parsedUrl.fq : '',
		sort: parsedUrl.sort !== undefined ? parsedUrl.sort : 'energy DESC',
	};
	
	const [err, response] = await to(dispatch(pcpActions.pcpAction(cookies.get('user.token'), pcpParam)));
	
	if (err) {
		console.log(err.message);
	} else {
		const productIdList = _.map(response.products, 'product_id') || null;
		dispatch(commentActions.bulkieCommentAction(cookies.get('user.token'), productIdList));

		dispatch(filterActions.initializeFilter(response));
	}
};

export default withCookies(connect(mapStateToProps)(Scroller(Shared(Product, doAfterAnonymous))));
