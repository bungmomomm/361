import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Header, Page, Svg, Carousel } from '@/components/mobile';
import { actions } from '@/state/v4/HashtagsDetails';
import Shared from '@/containers/Mobile/Shared';
import Spinner from '@/components/mobile/Spinner';
import InstagramEmbed from 'react-instagram-embed';
import { GridView } from '@/containers/Mobile/Discovery/View';

class HashtagsDetails extends Component {

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
						products={products}
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
								marginTop: '-2px',
								marginLeft: '-1px',
								width: 'calc(100% + 4px)'
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
								onAfterRender={() => {}}
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
	return {
		...state
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

	await dispatch(actions.hashtagDetailAction(cookies.get('user.token'), ids));
};

export default withRouter(withCookies(connect(mapStateToProps)(Shared(HashtagsDetails, doAfterAnonymous))));
