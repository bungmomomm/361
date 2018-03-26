import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Header, Page, Svg, Carousel } from '@/components/mobile';
import { actions } from '@/state/v4/HashtagsDetails';
import Shared from '@/containers/Mobile/Shared';
import Spinner from '@/components/mobile/Spinner';
import { GridView } from '@/containers/Mobile/Discovery/View';
import Discovery from '@/containers/Mobile/Discovery/Utils';
import { actions as commentActions } from '@/state/v4/Comment';
import { actions as lovelistActions } from '@/state/v4/Lovelist';
import _ from 'lodash';
import { userToken } from '@/data/cookiesLabel';

class HashtagsDetails extends Component {

	componentDidMount() {
		const script = document.createElement('script');
		script.src = '//www.instagram.com/embed.js';
		script.async = true;
		script.defer = true;

		document.body.appendChild(script);
	}

	forceLoginNow = () => {
		const { history, location } = this.props;
		const currentUrl = encodeURIComponent(`${location.pathname}${location.search}`);
		history.push(`/login?redirect_uri=${currentUrl}`);
	};

	bufferCarousel = (products) => {
		const { scroller } = this.props;
		const buffer = [];
		let fragment = [];

		products.forEach((product, i) => {
			fragment = ((i + 1) % 2 !== 0) ? [product] : [...fragment, product];
			if ((i + 1) % 2 === 0 || products.length === (i + 1)) {
				buffer.push(
					<GridView
						key={i}
						loading={scroller.loading}
						forceLoginNow={() => this.forceLoginNow()}
						products={fragment}
					/>
				);
			}
		});

		return buffer;
	};

	render() {
		const { hashtagdetails, history } = this.props;
		const ent = hashtagdetails;
		const looks = this.bufferCarousel(ent.data.products);

		const HeaderPage = {
			left: (
				<button onClick={history.goBack}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</button>
			),
			center: ent.data.header.title,
			right: null
		};

		return (
			<div>
				<Page color='white'>
					{ent.data.post.embed_url && (
						<div
							style={{
								marginBottom: '10px',
								maxWidth: '480px'
							}}
						>
							<iframe
								src={ent.data.post.embed_url}
								title='sgdsgs'
								className={'instagram-media'}
								frameBorder={0}
								style={{
									pointerEvents: 'none',
									cursor: 'default !important',
									maxWidth: '480px'
								}}
							/>
						</div>
					)}

					{looks.length > 0 && (
						<div
							style={{
								marginTop: '-15px',
								borderTop: '15px solid #ffffff'
							}}
						>
							<div className='padding--medium-h font-medium'><strong>Get The Look</strong></div>
							<Carousel>
								{looks.map((chunk, i) => chunk)}
							</Carousel>
						</div>
					)}
					{ent.loading && <Spinner />}
				</Page>

				<Header.Modal {...HeaderPage} />
			</div>);
	}
}

const mapStateToProps = (state) => {
	const { comments, lovelist, hashtagdetails } = state;
	hashtagdetails.data.products = Discovery.mapProducts(hashtagdetails.data.products, comments, lovelist);

	return {
		...state,
		hashtagdetails
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, match: { params } } = props;
	if (isNaN(parseInt(params.post_id, 10)) || isNaN(parseInt(params.campaign_id, 10))) {
		window.location.href = '/404';
	}

	const ids = {
		post_id: params.post_id,
		campaign_id: params.campaign_id,
		icode: params.icode
	};

	const resp = await dispatch(actions.hashtagDetailAction(cookies.get(userToken), ids));
	const productIdList = _.map(resp.data.data.products, 'product_id') || [];
	if (productIdList.length > 0) {
		dispatch(commentActions.bulkieCommentAction(cookies.get(userToken), productIdList));
		dispatch(lovelistActions.bulkieCountByProduct(cookies.get(userToken), productIdList));
	}
};

export default withRouter(withCookies(connect(mapStateToProps)(Shared(HashtagsDetails, doAfterAnonymous))));
