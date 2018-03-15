import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Header, Page, Navigation, Svg, Grid, Card, Carousel } from '@/components/mobile';
import { actions } from '@/state/v4/HashtagsDetails';
import Shared from '@/containers/Mobile/Shared';
import Spinner from '@/components/mobile/Spinner';
import { urlBuilder } from '@/utils';
import InstagramEmbed from 'react-instagram-embed';

class HashtagsDetails extends Component {

	bufferCarousel = (products) => {
		const buffer = [];
		let fragment = [];

		products.forEach((product, i) => {
			fragment = ((i + 1) % 2 !== 0) ?
			[
				<Card.CatalogGrid
					key={i}
					images={product.images}
					productTitle={product.product_title}
					brandName={product.brand.name}
					pricing={product.pricing}
					linkToPdp={urlBuilder.buildPdp(product.product_title, product.product_id)}
				/>
			] :
			[
				...fragment,
				<Card.CatalogGrid
					key={i}
					images={product.images}
					productTitle={product.product_title}
					brandName={product.brand.name}
					pricing={product.pricing}
					linkToPdp={urlBuilder.buildPdp(product.product_title, product.product_id)}
				/>
			];

			if ((i + 1) % 2 === 0 || products.length === (i + 1)) {
				buffer.push(fragment);
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
								marginTop: '-3px',
								marginLeft: '-3px',
								width: 'calc(100% + 8px)'
							}}
						>
							<InstagramEmbed
								url={ent.data.post.embed_url.replace('embed/captioned/', '')}
								maxWidth='auto'
								hideCaption={false}
								containerTagName='div'
								protocol=''
								onLoading={() => {}}
								onSuccess={() => {}}
								onAfterRender={() => {
									// document.getElementsByClassName('instagram-media')[0].removeAttribute('style');
								}}
								onFailure={() => {}}
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
								{looks.map((chunk, i) => <Grid split={2} key={i}>{chunk}</Grid>)}
							</Carousel>
						</div>
					)}
					{ent.loading && <Spinner />}
				</Page>

				<Header.Modal {...HeaderPage} />
				<Navigation scroll={this.props.scroll} />
			</div>);
	}
}

const mapStateToProps = (state) => {
	return {
		...state
	};
};

const doAfterAnonymous = (props) => {
	const { dispatch, cookies, match: { params } } = props;
	if (isNaN(parseInt(params.post_id, 10)) || isNaN(parseInt(params.campaign_id, 10))) {
		window.location.href = '/404';
	}

	const ids = {
		post_id: params.post_id,
		campaign_id: params.campaign_id,
	};

	dispatch(actions.hashtagDetailAction(cookies.get('user.token'), ids));
};

export default withRouter(withCookies(connect(mapStateToProps)(Shared(HashtagsDetails, doAfterAnonymous))));
