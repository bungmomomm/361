import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import _ from 'lodash';
import queryString from 'query-string';

import Shared from '@/containers/Mobile/Shared';
import EmptyState from '@/containers/Mobile/Shared/emptyState';
import Scroller from '@/containers/Mobile/Shared/scroller';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import {
	CatalogView,
	GridView,
	SmallGridView
} from '@/containers/Mobile/Discovery/View';

import {
	Header, Page, Svg, Navigation, Button
} from '@/components/mobile';
import { userToken, pageReferrer, isLogin } from '@/data/cookiesLabel';

import Spinner from '@/components/mobile/Spinner';

import { actions as promoActions } from '@/state/v4/Discovery';
import { actions as commentActions } from '@/state/v4/Comment';
import { actions as lovelistActions } from '@/state/v4/Lovelist';

import Discovery from '../Utils';
import handler from '@/containers/Mobile/Shared/handler';
import { Collector } from '@/utils/tracking/emarsys';

@handler
class Promo extends Component {

	constructor(props) {
		super(props);
		this.props = props;
		this.promoType = this.props.match.params.type;
		this.isLogin = this.props.cookies.get(isLogin) === 'true';

		this.state = {
			focusedProductId: ''
		};

		this.loadingView = (
			<div style={{ margin: '20px auto 20px auto' }}>
				<Spinner />
			</div>
		);
	}

	componentWillUnmount() {
		const { dispatch } = this.props;
		dispatch(promoActions.loadingAction(true));
	}

	setFocusedProduct(id) {
		this.setState({ focusedProductId: id });
	}

	handlePick(e) {
		const { dispatch, discovery } = this.props;
		const mode = discovery.viewMode.mode === 3 ? 1 : discovery.viewMode.mode + 1;
		dispatch(promoActions.viewModeAction(mode));
	}

	forceLoginNow() {
		const { history } = this.props;
		history.push(`/login?redirect_uri=${encodeURIComponent(location.pathname + location.search)}`);
	}

	renderHeader() {
		const { history, discovery } = this.props;

		let back = () => {
			history.goBack();
		};
		if (history.length === 0) {
			back = () => {
				history.push('/');
			};
		}

		const headerTitle = _.chain(discovery).get(`promo.${this.promoType}.info.title`).value() || '';
		const headerPage = {
			left: (
				<Button onClick={back}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: discovery.isLoading ? this.loadingView : headerTitle,
			right: (
				<Button onClick={(e) => this.handlePick(e)}>
					<Svg src={discovery.viewMode.icon} />
				</Button>
			)
		};

		return <Header.Modal {...headerPage} />;
	}

	renderForeverBanner() {
		const { shared, dispatch } = this.props;
		return <ForeverBanner {...shared.foreverBanner} dispatch={dispatch} />;
	}

	renderProductList() {
		const { discovery, comments, scroller, location } = this.props;
		const { focusedProductId } = this.state;
		const products = _.chain(discovery).get(`promo.${this.promoType}.products`).value();

		if (products) {
			let productsView;
			if (!_.isEmpty(products)) {
				const productCount = _.chain(discovery).get(`promo.${this.promoType}.info.product_count`).value() || 0;
				const redirectPath = location.pathname !== '' ? location.pathname : '';

				let listView;
				switch (discovery.viewMode.mode) {
				case 1:
					listView = (
						<CatalogView
							comments={comments}
							loading={scroller.loading}
							forceLoginNow={() => this.forceLoginNow()}
							products={products}
							focusedProductId={focusedProductId}
							setFocusedProduct={(id) => this.setFocusedProduct(id)}
							redirectPath={redirectPath}
						/>
					);
					break;
				case 2:
					listView = (
						<GridView
							loading={scroller.loading}
							forceLoginNow={() => this.forceLoginNow()}
							products={products}
						/>
					);
					break;
				case 3:
					listView = (
						<SmallGridView
							loading={scroller.loading}
							products={products}
						/>
					);
					break;
				default:
					listView = null;
					break;
				}

				productsView = (
					<div>
						<div className='text-center margin--medium-v'>{productCount} Total Produk</div>
						{listView}
					</div>
				);
			} else {
				productsView = <EmptyState />;
			}

			return (
				<Page color='white'>
					{discovery.isLoading ? this.loadingView : productsView}
				</Page>
			);
		}

		return null;
	}

	renderPage() {
		const { cookies, shared } = this.props;
		const navigationAttribute = {
			scroll: this.props.scroll,
			totalCartItems: shared.totalCart
		};
		navigationAttribute.active = cookies.get(pageReferrer);

		return (
			<div style={this.props.style}>
				{this.renderProductList()}
				{this.renderHeader()}
				{this.renderForeverBanner()}
				<Navigation {...navigationAttribute} botNav={this.props.botNav} isLogin={this.isLogin} />
			</div>
		);
	}

	render() {
		return this.renderPage();
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
		discovery,
		shared: state.shared,
		home: state.home,
		scroller: state.scroller,
		comments: state.comments,
		lovelist: state.lovelist
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, match, location } = props;

	const promoType = _.chain(match).get('params.type').value().replace('-', '_') || 'best_seller';
	const parsedUrl = queryString.parse(location.search);
	const promoParam = {
		segment_id: parsedUrl.segment_id !== undefined ? parseInt(parsedUrl.segment_id, 10) : 150,
		page: parsedUrl.page !== undefined ? parseInt(parsedUrl.page, 10) : 1,
		per_page: parsedUrl.per_page !== undefined ? parseInt(parsedUrl.per_page, 10) : 36,
	};
	const response = await dispatch(promoActions.promoAction({
		token: cookies.get(userToken),
		promoType,
		query: promoParam
	}));

	const productIdList = _.map(response.products, 'product_id') || [];
	if (productIdList.length > 0) {
		await dispatch(commentActions.bulkieCommentAction(cookies.get(userToken), productIdList));
		await dispatch(lovelistActions.bulkieCountByProduct(cookies.get(userToken), productIdList));
	}

	Collector.push();
};

export default withCookies(connect(mapStateToProps)(Scroller(Shared(Promo, doAfterAnonymous))));
