import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import {
	Header, Page, Svg, Navigation, Tabs, Card, Image
} from '@/components/mobile';
import stylesCatalog from '../Category/Catalog/catalog.scss';
import Shared from '@/containers/Mobile/Shared';
import styles from './newarrival.scss';
import { actions } from '@/state/v4/Discovery';

class NewArrival extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.state = {
			listTypeGrid: false,
			productEmpty: false,
			products: this.props.discovery.newArrivalData
		};

		this.renderNewArrival = this.renderNewArrival.bind(this);
		this.handlePick = this.handlePick.bind(this);
		this.getProductListContent = this.getProductListContent.bind(this);
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(actions.newArrivalAction(this.userCookies));
	}

	getProductListContent() {
		const { discovery } = this.props;
		const { listTypeGrid } = this.state;
		const products = discovery.newArrivalData.products;

		if (typeof products !== 'undefined') {
			const content = products.map((product, idx) => {
				return listTypeGrid ?
					(<Card.CatalogGrid
						key={idx}
						images={product.images}
						productTitle={product.product_title}
						brandName={product.brand}
						pricing={product.pricing}
					/>) :
					(<Card.Catalog
						key={idx}
						className={stylesCatalog.cardCatalog}
						images={product.images}
						productTitle={product.product_title}
						brandName={product.brand}
						pricing={product.pricing}
					/>);
			});

			return <div className={styles.cardContainer}>{content}</div>;
		}

		return null;
	}

	handlePick(event) {
		const { listTypeGrid } = this.state;

		switch (event) {
		case 'view':
			this.setState({ listTypeGrid: !listTypeGrid });
			break;
		case 'filter':
			// TODO: implement filter handler
			this.props.history.push('/filterCategory');
			break;
		default:
			// TODO: implement sorting handler
			break;
		}
	}

	renderNewArrival(content) {
		const { listTypeGrid } = this.state;
		const bannerInline = {
			color: 'pink',
			width: '100%',
			height: '20%'
		};

		const HeaderPage = {
			left: (
				<Link to='/'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Produk Terlaris',
			right: null
		};

		return (
			<div style={this.props.style}>
				<Page>
					{content}
				</Page>
				<Header.Modal {...HeaderPage} />
				<Tabs
					className={stylesCatalog.fixed}
					type='segment'
					variants={[
						{
							id: 'sort',
							Title: 'Urutkan'
						},
						{
							id: 'filter',
							Title: 'Filter'
						},
						{
							id: 'view',
							Title: <Svg src={listTypeGrid ? 'ico_grid.svg' : 'ico_list.svg'} />
						}
					]}

					onPick={this.handlePick}
				/>
				<Image alt='Product Terlaris' src='http://www.solidbackgrounds.com/images/950x350/950x350-light-pink-solid-color-background.jpg' style={bannerInline} />
				<Navigation active='Promo' />
			</div>
		);
	}

	render() {

		if (this.state.productEmpty) {
			return this.renderNewArrival('');
		}

		const content = this.getProductListContent();
		return this.renderNewArrival(content);
	}
}

const mapStateToProps = (state) => {
	return {
		...state
	};
};

export default withCookies(connect(mapStateToProps)(Shared(NewArrival)));