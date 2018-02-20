import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { to } from 'await-to-js';

import { Header, Page, Card, Svg, Tabs, Button, Level, Image, Input, Navigation, Spinner } from '@/components/mobile';
import stylesCatalog from '../Catalog/catalog.scss';
import Shared from '@/containers/Mobile/Shared';
import { actions } from '@/state/v4/ProductCategory';
import queryString from 'query-string';
import Scroller from '@/containers/Mobile/Shared/scroller';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import { actions as filterActions } from '@/state/v4/SortFilter';
import Filter from '@/containers/Mobile/Shared/Filter';
import Sort from '@/containers/Mobile/Shared/Sort';
import { hyperlink } from '@/utils';

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

	pcpRender() {
		let pcpView = null;
		const { shared, filters } = this.props;
		const foreverBannerData = shared.foreverBanner;
		foreverBannerData.show = this.state.notification.show;
		foreverBannerData.onClose = () => this.setState({ notification: { show: false } });

		const { filterShown, sortShown } = this.state;
		const pcpResults = this.props.productCategory;
		if (typeof pcpResults.pcpStatus !== 'undefined' && pcpResults.pcpStatus !== '') {
			if (pcpResults.pcpStatus === 'success' && pcpResults.pcpData.products.length > 0) {
				if (filterShown) {
					pcpView = (
						<Filter
							shown={filterShown}
							filters={pcpResults}
							onUpdateFilter={(e, type, value) => this.onUpdateFilter(e, type, value)}
							onApply={(e) => {
								console.log(e);
								// this.onApply(e);
							}}
							onReset={(e) => this.onReset(e)}
							onClose={(e) => this.onClose(e)}
						/>
					);
				} else {
					pcpView = (
						<div style={this.props.style}>
							<Page>
								<div className={stylesCatalog.cardContainer}>
									{
										pcpResults.pcpData.products.map((product, index) =>
											this.renderList(product, index)
										)
									}
								</div>
								<Sort shown={sortShown} sorts={filters.sorts} onSelected={(e, value) => this.sort(e, value)} />
							</Page>
							{this.renderHeader()}
							{this.renderTabs()}
							{
								<ForeverBanner {...foreverBannerData} />
							}
							<Navigation active='Categories' />
			
							{this.props.scroller.loading}
						</div>
					);
				}
			} else if (pcpResults.pcpStatus === 'failed') {
				window.location.href = '/not-found';
			}
		}

		return pcpView;
	}

	renderList(productData, index) {
		if (productData) {
			const renderBlockComment = (
				<div className={stylesCatalog.commentBlock}>
					<Button>View 38 comments</Button>
					<Level>
						<Level.Left><div style={{ marginRight: '10px' }}><Image avatar width={25} height={25} local src='temp/pp.jpg' /></div></Level.Left>
						<Level.Item>
							<Input color='white' placeholder='Write comment' />
						</Level.Item>
					</Level>
				</div>
			);
			
			const linkToPdpCreator = hyperlink('', ['product', productData.product_id], null);
			
			const listCardCatalogAttribute 			= {
				images: productData.images,
				productTitle: productData.product_title,
				brandName: productData.brand,
				pricing: productData.pricing,
				linkToPdp: linkToPdpCreator
			};
			
			const cardCatalogGridAttribute 			= {
				key: index,
				images: productData.images,
				productTitle: productData.product_title,
				brandName: productData.brand,
				pricing: productData.pricing,
				linkToPdp: linkToPdpCreator
			};
			
			const cardCatalogSmall 					= {
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
						{renderBlockComment}
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

	renderHeader() {
		let back = () => { this.props.history.goBack(); };
		if (this.props.history.length === 0) {
			back = () => { this.props.history.push('/'); };
		}

		const pcpResults = this.props.productCategory;
		const headerTitle = _.chain(pcpResults).get('pcpData.info.title').value() || '';
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

	render() {
		return this.props.isLoading ? this.loadingView() : this.pcpRender();
	}
}

const mapStateToProps = (state) => {
	return {
		...state,
		shared: state.shared,
		productCategory: state.productCategory,
		isLoading: state.productCategory.isLoading,
		scroller: state.scroller
	};
};

const doAfterAnonymous = async (props) => {
	console.log(props);
	const { shared, dispatch, cookies, match, location } = props;

	const productService = _.chain(shared).get('serviceUrl.product').value() || false;
	const categoryId = _.chain(match).get('params.categoryId').value() || '';
	const parsedUrl = queryString.parse(location.search);
	const pcpParam = {
		category_id: categoryId,
		page: parsedUrl.page !== undefined ? parseInt(parsedUrl.page, 10) : 1,
		per_page: parsedUrl.per_page !== undefined ? parseInt(parsedUrl.per_page, 10) : 10,
		fq: parsedUrl.fq !== undefined ? parsedUrl.fq : '',
		sort: parsedUrl.sort !== undefined ? parsedUrl.sort : 'energy DESC',
	};
	
	dispatch(actions.initAction(cookies.get('user.token'), productService, pcpParam));
	
	// if (err) {
	// 	console.log(err.message);
	// } else {
	// 	dispatch(filterActions.initializeFilter(response));
	// }
};

export default withCookies(connect(mapStateToProps)(Shared(Scroller(Product), doAfterAnonymous)));
