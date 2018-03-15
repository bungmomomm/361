import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import {
	Header, Page, Svg, Navigation, Card, Button
} from '@/components/mobile';
import _ from 'lodash';
import stylesCatalog from '../Category/Catalog/catalog.scss';
import Shared from '@/containers/Mobile/Shared';
import styles from './promo.scss';
import { actions } from '@/state/v4/Discovery';
import Scroller from '@/containers/Mobile/Shared/scroller';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import Spinner from '@/components/mobile/Spinner';
import { Love } from '@/containers/Mobile/Widget';

import Discovery from '../Utils';

class Promo extends Component {

	constructor(props) {
		super(props);
		this.props = props;

		this.state = {
			listTypeGrid: false,
			productEmpty: false
		};
		this.handlePick = this.handlePick.bind(this);
		this.getProductListContent = this.getProductListContent.bind(this);

		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.promoType = this.props.match.params.type;
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
						brandName={product.brand.name}
						pricing={product.pricing}
						linkToPdp={product.url}
						love={(
							<Love
								status={product.lovelistStatus}
								data={product.product_id}
								total={product.lovelistTotal}
								onNeedLogin={() => this.forceLoginNow()}
							/>
						)}
					/>) :
					(<Card.Catalog
						key={idx}
						className={stylesCatalog.cardCatalog}
						images={product.images}
						productTitle={product.product_title}
						brandName={product.brand.name}
						pricing={product.pricing}
						linkToPdp={product.url}
						love={(
							<Love
								status={product.lovelistStatus}
								data={product.product_id}
								total={product.lovelistTotal}
								onNeedLogin={() => this.forceLoginNow()}
								showNumber
							/>
						)}
					/>);
			});

			return <div className={styles.cardContainer}>{content}</div>;
		}

		return null;
	}

	forceLoginNow() {
		const { history } = this.props;
		history.push(`/login?redirect_uri=${location.pathname}`);
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

		const { shared, dispatch } = this.props;

		return (
			<div style={this.props.style}>
				<Page>
					{content}
					{this.props.scroller.loading && <Spinner />}
				</Page>

				<Header.Modal {...HeaderPage} />
				{<ForeverBanner {...shared.foreverBanner} dispatch={dispatch} />}
				
				<Navigation active='Promo' scroll={this.props.scroll} />
			</div>
		);
	}

	render() {
		const content = this.getProductListContent();
		return this.renderData(content);
	}
}

const mapStateToProps = (state, props) => {
	const { 
		comments, 
		lovelist,
		discovery } = state;
	const { match } = props;
	
	const promoType = match.params.type;

	const promoTypeData = _.chain(discovery).get(`promo.${promoType}`);

	if (!promoTypeData.isEmpty().value()) {
		const { products } = promoTypeData.value();

		discovery.promo[promoType].products = Discovery.mapProducts(products, comments, lovelist);
	}
	
	return {
		discovery: {
			...discovery,
			loading: state.discovery.loading
		},
		shared: state.shared,
		home: state.home,
		scroller: state.scroller
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, match, location } = props;
	await dispatch(actions.promoAction({
		token: cookies.get('user.token'),
		promoType: `${match.params.type}${location.search}`
	}));
};

export default withCookies(connect(mapStateToProps)(Scroller(Shared(Promo, doAfterAnonymous))));
