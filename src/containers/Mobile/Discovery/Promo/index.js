import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import {
	Header, Page, Svg, Navigation, Card, Image, Button
} from '@/components/mobile';
import _ from 'lodash';
import stylesCatalog from '../Category/Catalog/catalog.scss';
import Shared from '@/containers/Mobile/Shared';
import styles from './promo.scss';
import { actions } from '@/state/v4/Discovery';
import Scroller from '@/containers/Mobile/Scroller';


class Promo extends Component {

	constructor(props) {
		super(props);
		this.props = props;

		this.state = {
			listTypeGrid: false,
			productEmpty: false,
			// products: this.props.discovery.Promo,
			// promoType: '',
		};
		this.listPromo = [
			'new_arrival',
			'best_seller',
			'recommended_products',
			'recent_view'
		];
		this.renderNewArrival = this.renderData.bind(this);
		this.handlePick = this.handlePick.bind(this);
		this.getProductListContent = this.getProductListContent.bind(this);

		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.promoType = this.props.location.pathname.replace('/', '');

	}

	componentDidMount() {
		this.props.loadScroller({ token: this.userCookies, promoType: this.promoType });
	}

	getProductListContent() {
		const { discovery } = this.props;
		const { listTypeGrid } = this.state;
		const products = _.chain(discovery).get(`promo.${this.promoType}`).value().products;

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

	renderData(content) {
		const { listTypeGrid } = this.state;
		const { discovery } = this.props;
		const info = _.chain(discovery).get(`promo.${this.promoType}`).value().info;
		const bannerInline = {
			color: 'pink',
			width: '100%',
			height: '20%'
		};
		const headerLabel = info ? `${info.title} <br /> ${info.product_count} Total Produk` : '';
		const HeaderPage = {
			left: (
				<Link to='/'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: <div dangerouslySetInnerHTML={{ __html: headerLabel }} />,
			right: (
				<Button onClick={() => this.setState({ listTypeGrid: !listTypeGrid })}>
					<Svg src={listTypeGrid ? 'ico_list.svg' : 'ico_grid.svg'} />
				</Button>

			)
		};

		return (
			<div style={this.props.style}>
				<Page>
					{content}
				</Page>
				<Header.Modal {...HeaderPage} />
				<Image alt='Product Terlaris' src='http://www.solidbackgrounds.com/images/950x350/950x350-light-pink-solid-color-background.jpg' style={bannerInline} />
				<Navigation active='Promo' />

				{this.props.scroller.loading}
			</div>
		);
	}

	render() {

		if (this.state.productEmpty) {
			return this.renderData('');
		}

		const content = this.getProductListContent();
		return this.renderData(content);
	}
}

const mapStateToProps = (state) => {
	return {
		...state
	};
};

const mapsDispatchToProps = (dispatch) => {
	return {
		loadScroller: (data) => dispatch(actions.promoAction(data))
	};
};

export default withCookies(connect(mapStateToProps, mapsDispatchToProps)(Shared(Scroller(Promo))));
