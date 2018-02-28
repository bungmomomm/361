import React, { PureComponent } from 'react';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Header, Page, Navigation, Svg, Grid, Card, Carousel, Button } from '@/components/mobile';
import { actions } from '@/state/v4/HashtagsDetails';
import Shared from '@/containers/Mobile/Shared';
import Spinner from '@/components/mobile/Spinner';
import { hyperlink } from '@/utils';
import moment from 'moment';

class HashtagsDetails extends PureComponent {

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
					linkToPdp={hyperlink('', ['product', product.product_id], null)}
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
					linkToPdp={hyperlink('', ['product', product.product_id], null)}
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

		const HeaderPage = {
			left: (
				<button onClick={history.goBack}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</button>
			),
			center: ent.data.header.title,
			right: null
		};

		const looks = this.bufferCarousel(ent.data.products);

		return (
			<div>
				<Page>
					<div>
						<img alt='hastag' src={ent.data.post.image} />
					</div>
					<div className='padding--medium padding--none-right'>
						<div className='border-bottom'>
							<div className='margin--medium flex-row flex-spaceBetween flex-middle'>
								<div>
									<div>{ent.data.post.username}</div>
									<div className='font-color--primary-ext-2 font-small'>Post date: {moment(ent.data.post.created_time).format('DD/MM/YY')}</div>
								</div>
								<div className='padding--medium'>
									<Button>
										<div className='flex-row flex-middle'>
											<Svg src='ico_lovelist.svg' />
											<span>1.002</span>
										</div>
									</Button>
								</div>
							</div>
						</div>
					</div>
					<div className='padding--medium border-bottom'>
						<div className='margin--medium'>
							<div className='margin--medium margin--none-top'>{ent.data.post.caption}</div>
							<div className='font-color--primary-ext-2'>
								#nike #supplierbangkok #pobkkfirsthand #pobkk #pohk #grosirbaju #premiumquaity #readytowear #ootdindo #olshop #trustedseller #supplierbaju #pochina
							</div>
						</div>
					</div>
					{looks.length && (
					<div className='margin--medium'>
						<div className='padding--medium font-medium'><strong>Get The Look</strong></div>
						<Carousel className='margin--medium'>
							{looks.map((chunk, i) => <Grid split={2} key={i}>{chunk}</Grid>)}
						</Carousel>
					</div>
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
