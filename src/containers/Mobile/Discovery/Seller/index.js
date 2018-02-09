import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Navigation, Svg, Tabs, Header, Page, Button, Level, Image, Input, Card, Grid } from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import Scroller from '@/containers/Mobile/Shared/scroller';
import { actions } from '@/state/v4/Seller';
import stylesCatalog from '../Category/Catalog/catalog.scss';
// import _ from 'lodash';

class Seller extends Component {

	static currentListState = 0;
	static listType = [{
		type: 'grid',
		icon: 'ico_list.svg'
	}, {
		type: 'list',
		icon: 'ico_grid.svg'
	}];

	state = {
		listTypeState: Seller.listType[Seller.currentListState]
	};

	filterTabs = () => {
		const { listTypeState } = this.state;

		return (
			<Tabs
				className={stylesCatalog.fixed}
				type='segment'
				variants={[
					{
						id: 'urutkan',
						title: 'Urutkan'
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
				onPick={this.handlePick}
			/>
		);
	}

	handlePick = (e) => {
		switch (e) {
		case 'view':
			Seller.currentListState = Seller.currentListState === 1 ? 0 : Seller.currentListState + 1;
			this.setState({ listTypeState: Seller.listType[Seller.currentListState] });
			break;
		case 'filter':
			this.props.history.push('/filterCategory');
			break;
		default:
			break;
		}
	}

	loadProducts = () => {
		const { seller: { data: { products } } } = this.props;

		if (products.length > 0) {
			return (
				<div className={stylesCatalog.cardContainer}>
					{
						products.map((product, index) =>
							this.renderList(product, index)
						)
					}
				</div>
			);
		}

		return null;
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
							{seller.info.product || 0}
						</div>
					</Grid>
				</div>
				<div>
					{seller.info.description || ''}
				</div>
			</div>
		);
	}

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
			default:
				return null;
			}
		} else {
			return null;
		}
	}

	render() {
		const HeaderPage = {
			left: (
				<button href={this.props.history.goBack}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</button>
			),
			center: null,
			right: null
		};

		return (
			<div>
				<Page>
					{this.sellerHeader()}
					{this.loadProducts()}
				</Page>

				<Header.Modal {...HeaderPage} />
				{this.filterTabs()}

				<Navigation />
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

export default connect(mapStateToProps)(withCookies(Scroller(Shared(Seller, doAfterAnonymous))));
