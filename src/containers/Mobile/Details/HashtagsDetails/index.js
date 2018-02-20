import React, { PureComponent } from 'react';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Header, Page, Navigation, Svg, Grid, Card } from '@/components/mobile';
import { actions } from '@/state/v4/HashtagsDetails';
import Shared from '@/containers/Mobile/Shared';
import Spinner from '@/components/mobile/Spinner';
import { hyperlink } from '@/utils';

class HashtagsDetails extends PureComponent {

	render() {
		const { hashtagdetails, history } = this.props;
		const ent = hashtagdetails;

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
				<Page>
					{ent.data.post.image && (
						<Grid split={1}>
							<div>
								<img alt='' src={ent.data.post.image} />
							</div>
							<div>
								{ent.data.post.username}
								<p>
									Post date: {ent.data.post.created_time} <br />
									{ent.data.post.caption}
								</p>
							</div>

							{ent.data.products.length && (
							<div>
								<h2>Get The Look</h2>
								<Grid split={2}>
									{ent.data.products.map((product, i) =>
										(
											<Card.CatalogGrid
												key={i}
												images={product.images}
												productTitle={product.product_title}
												brandName={product.brand.name}
												pricing={product.pricing}
												linkToPdp={hyperlink('', ['product', product.product_id], null)}
											/>
										)
									)}
								</Grid>
							</div>
							)}

						</Grid>
					)}

					{ent.loading && <Spinner />}
				</Page>

				<Header.Modal {...HeaderPage} />
				<Navigation />
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
