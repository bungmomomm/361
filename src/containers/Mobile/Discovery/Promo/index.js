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
import Scroller from '@/containers/Mobile/Shared/scroller';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import { urlBuilder } from '@/utils';
import Spinner from '@/components/mobile/Spinner';
import Love from '@/containers/Mobile/Shared/Widget/Love';

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
				<Image alt='Product Terlaris' src='http://www.solidbackgrounds.com/images/950x350/950x350-light-pink-solid-color-background.jpg' style={bannerInline} />
				<Navigation active='Promo' scroll={this.props.scroll} />
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
	const { comments, lovelist, discovery } = state;
	const products = _.chain(discovery).get(`promo.${this.promoType}`).value().products;

	if (typeof products !== 'undefined') {
		discovery.promo[this.promoType] = _.map(products, (product) => {
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

const doAfterAnonymous = (props) => {
	const { dispatch, cookies, match, home } = props;
	const filtr = home.segmen.filter((obj) => {
		return obj.key === home.activeSegment;
	});

	const query = filtr && filtr[0] ? { segment_id: filtr[0].id } : {};

	dispatch(actions.promoAction({
		token: cookies.get('user.token'),
		promoType: match.params.type,
		query
	}));
};

export default withCookies(connect(mapStateToProps)(Scroller(Shared(Promo, doAfterAnonymous))));
