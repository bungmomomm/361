import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
	Card,
	Header,
	Page,
	Svg,
	Carousel,
	Modal,
	Level,
	Button
} from '@/components/mobile';
import { actions } from '@/state/v4/HashtagsDetails';
import Shared from '@/containers/Mobile/Shared';
import Spinner from '@/components/mobile/Spinner';
// import { GridView } from '@/containers/Mobile/Discovery/View';
import Discovery from '@/containers/Mobile/Discovery/Utils';
import { actions as commentActions } from '@/state/v4/Comment';
import { actions as lovelistActions } from '@/state/v4/Lovelist';
import { actions as usersActions } from '@/state/v4/User';
import _ from 'lodash';
import { userToken, isLogin } from '@/data/cookiesLabel';
import { urlBuilder } from '@/utils';
import { Love } from '@/containers/Mobile/Widget';
import stylesCatalog from '@/containers/Mobile/Discovery/View/view.scss';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class HashtagsDetails extends Component {

	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			showLoginModal: false
		};
	}

	componentDidMount() {
		const el = document.getElementsByClassName('embed-ig');

		if (el.length) document.body.removeChild(el[0]);
		if (window.instgrm) delete window.instgrm;

		const script = document.createElement('script');
		script.className = 'embed-ig';
		script.src = '//www.instagram.com/embed.js';
		script.async = true;
		script.defer = true;
		document.body.appendChild(script);
	}

	handleLovelistClick(e, product) {
		const { cookies } = this.props;

		// customer must be logged in first
		if (cookies.get(isLogin) === 'false') {
			this.setState({
				showLoginModal: true,
				product
			});
		}
	}

	loginNow = () => {
		this.props.dispatch(new usersActions.addAfterLogin('Lovelist', 'addToLovelist', [this.state.product]));
		const { history, location } = this.props;
		const currentUrl = encodeURIComponent(`${location.pathname}${location.search}`);
		history.push(`/login?redirect_uri=${currentUrl}`);
	};

	loginLater() {
		this.setState({
			showLoginModal: false,
			product: undefined
		});
	}

	bufferCarousel = (products) => {
		const buffer = [];
		let fragment = [];

		const productClicked = (e) => null;
		products.forEach((product, i) => {
			const attr = {
				key: i,
				images: product.images,
				productTitle: product.product_title,
				brandName: product.brand.name,
				pricing: {
					discount: product.pricing.formatted.discount,
					...product.pricing
				},
				productOnClick: productClicked,
				linkToPdp: urlBuilder.buildPdp(product.product_title, product.product_id),
				love: (
					<Love
						status={product.lovelistStatus}
						data={product.product_id}
						inline={false}
						total={product.lovelistTotal}
						onNeedLogin={(e) => this.handleLovelistClick(e, product.product_id)}
					/>
				)
			};

			if ((i + 1) % 2 !== 0) {
				fragment = [
					<Card.CatalogGrid
						{...attr}
					/>
				];
			} else {
				fragment = [
					...fragment,
					<Card.CatalogGrid
						{...attr}
					/>
				];
			};

			if ((i + 1) % 2 === 0 || products.length === (i + 1)) {
				buffer.push(
					<div className={stylesCatalog.cardContainer} key={i}>
						{fragment}
					</div>
				);
			}
		});

		return buffer;
	};

	render() {
		const { hashtagdetails, history } = this.props;
		const { showLoginModal } = this.state;
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
								title='Instagram'
								className={'instagram-media'}
								frameBorder={0}
								style={{
									pointerEvents: 'none',
									cursor: 'default !important',
									maxWidth: '480px'
								}}
								ref={(r) => { this.embedIg = r; }}
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
				{showLoginModal && (
					<Modal show>
						<div className='font-medium'>
							<h3 className='text-center'>Lovelist</h3>
							<Level style={{ padding: '0px' }} className='margin--medium-v'>
								<Level.Left />
								<Level.Item className='padding--medium-h margin--medium-h'>
									<center className='font-medium'>Silahkan login/register untuk menambahkan produk ke Lovelist</center>
								</Level.Item>
							</Level>
						</div>
						<Modal.Action
							closeButton={(
								<Button onClick={(e) => this.loginLater()}>
									<strong className='font-color--primary-ext-2'>NANTI</strong>
								</Button>)}
							confirmButton={(<Button onClick={(e) => this.loginNow()}><strong className='font-color--primary'>SEKARANG</strong></Button>)}
						/>
					</Modal>
				)}
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
