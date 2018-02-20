import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Navigation, Svg, Tabs, Header, Page, Button, Level, Image, Input, Card, Grid } from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import Scroller from '@/containers/Mobile/Shared/scroller';
import { actions } from '@/state/v4/Seller';
import { actions as filterActions } from '@/state/v4/SortFilter';
import Filter from '@/containers/Mobile/Shared/Filter';
import Sort from '@/containers/Mobile/Shared/Sort';
import { to } from 'await-to-js';
import { withRouter } from 'react-router-dom';
import stylesCatalog from '../Category/Catalog/catalog.scss';
import styles from './styles.scss';
import Spinner from '@/components/mobile/Spinner';
import Share from '@/components/mobile/Share';

class Seller extends Component {

	static currentListState = 0;
	static listType = [{
		type: 'list',
		icon: 'ico_grid.svg'
	}, {
		type: 'grid',
		icon: 'ico_three-line.svg'
	}, {
		type: 'small',
		icon: 'ico_list.svg'
	}];

	state = {
		listTypeState: Seller.listType[Seller.currentListState],
		filterShown: false,
		sortShown: false
	};

	onApply = async (e) => {
		const { dispatch, cookies, filters } = this.props;
		const [err, response] = await to(dispatch(new filterActions.applyFilter(cookies.get('user.token'), 'category', filters)));
		// console.log(err);
		// console.log(response);
		if (err) {
			return err;
		}
		return response;
	};

	onUpdateFilter = (e, type, value) => {
		try {
			this.props.dispatch(new filterActions.updateFilter(type, value));
		} catch (error) {
			console.log(error);
		}
	};

	onReset = (e) => {
		this.props.dispatch(new filterActions.resetFilter());
	};

	onClose = (e) => {
		this.setState({
			filterShown: false
		});
	};

	handlePick = (val) => {
		switch (val) {
		case 'view':
			Seller.currentListState = Seller.currentListState === 2 ? 0 : Seller.currentListState + 1;
			this.setState({ listTypeState: Seller.listType[Seller.currentListState] });
			break;
		case 'filter':
			this.setState({
				filterShown: val === 'filter'
			});
			break;
		case 'sort':
			this.setState({
				sortShown: val === 'sort'
			});
			break;
		default:
			break;
		}
	};

	sort = async (e, value) => {
		this.setState({
			sortShown: false
		});

		this.props.dispatch(filterActions.updateSort(value));

		// const { dispatch, cookies, filters } = this.props;
		// dispatch(filterActions.updateSort(value));
		//
		// const [err, response] = await to(dispatch(new filterActions.applyFilter(cookies.get('user.token'), 'category', filters)));
		// if (err) {
		// 	return err;
		// }
		// return response;
	};

	filterTabs = () => {
		const { listTypeState } = this.state;

		return (
			<div style={this.props.style}>
				<Tabs
					type='segment'
					variants={[
						{
							id: 'sort',
							title: 'Sort'
						},
						{
							id: 'filter',
							title: 'Filter'
						},
						{
							id: 'view',
							title: <Svg src={listTypeState.icon} />
						}
					]}
					onPick={e => this.handlePick(e)}
				/>
			</div>
		);
	}

	sellerHeader = () => {
		const { seller } = this.props;

		return (
			<div>
				<div>
					<Grid split={4}>
						<div>
							<Image width={60} src={seller.info.seller_logo || ''} />
							<br />
							{seller.info.seller || ''}
							<p>
								{seller.info.seller_location || ''}
							</p>
						</div>
						<div>
							<Image width={60} src={seller.info.seller_badge_image || ''} />
							<br />
							{seller.info.seller_badge || ''}
						</div>
						<div>
							{seller.info.rating || ''}
						</div>
						<div>
							{seller.info.product || ''}
						</div>
					</Grid>
				</div>
				<div>
					{seller.info.description || ''}
				</div>
			</div>
		);
	};

	loadProducts = () => {
		const { seller: { data: { products } } } = this.props;

		return (
			<div className={styles.cardContainer}>
				{
					products.map((product, index) =>
						this.renderList(product, index)
					)
				}
			</div>
		);
	};

	renderList = (productData, index) => {
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
			switch (this.state.listTypeState.type) {
			case 'list':
				return (
					<div key={index} className={stylesCatalog.cardCatalog}>
						<Card.Catalog
							images={productData.images}
							productTitle={productData.product_title}
							brandName={productData.brand}
							pricing={productData.pricing}
						/>
						{renderBlockComment}
					</div>
				);
			case 'grid':
				return (
					<Card.CatalogGrid
						key={index}
						images={productData.images}
						productTitle={productData.product_title}
						brandName={productData.brand}
						pricing={productData.pricing}
					/>
				);
			case 'small':
				return (
					<Card.CatalogSmall
						key={index}
						images={productData.images}
						pricing={productData.pricing}
					/>
				);
			default:
				return null;
			}
		} else {
			return null;
		}
	};

	renderData = () => {
		const { filterShown, sortShown } = this.state;
		const { filters, seller, history } = this.props;
		const title = seller.info.seller;
		const url = `${process.env.MOBILE_URL}/store/${seller.info.seller_id}`;

		const HeaderPage = {
			left: (
				<Button onClick={history.goBack}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</Button>
			),
			center: null,
			right: <Share title={title} url={url} />
		};

		return (
			<span>
				{filterShown ? (
					<Filter
						shown={filterShown}
						filters={filters}
						onUpdateFilter={(e, type, value) => this.onUpdateFilter(e, type, value)}
						onApply={this.onApply}
						onReset={this.onReset}
						onClose={this.onClose}
					/>
				) : (
					<div style={this.props.style}>
						<Page>
							{this.sellerHeader()}
							{this.loadProducts()}

							<Sort shown={sortShown} sorts={filters.sorts} onSelected={(e, value) => this.sort(e, value)} />
						</Page>

						<Header.Modal {...HeaderPage} />
						{this.filterTabs()}

						<Navigation />
					</div>
				)}
			</span>
		);
	};

	render() {
		return (
			<div>
				{this.renderData()}
				{this.props.scroller.loading && <Spinner />}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		...state
	};
};

const doAfterAnonymous = (props) => {
	const { dispatch, cookies, match: { params } } = props;
	const data = {
		token: cookies.get('user.token'),
		query: { store_id: params.store_id || 0 }
	};
	dispatch(actions.initSeller(data.token, data.query.store_id));
	dispatch(actions.getProducts(data));
};

export default withRouter(withCookies(connect(mapStateToProps)(Scroller(Shared(Seller, doAfterAnonymous)))));
