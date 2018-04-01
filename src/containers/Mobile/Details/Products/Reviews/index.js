import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Page, Header, Svg, Comment, Spinner, Button, Rating } from '@/components/mobile';
import { actions as productActions } from '@/state/v4/Product';
import Scroller from '@/containers/Mobile/Shared/scroller';
import Shared from '@/containers/Mobile/Shared';
import styles from './reviews.scss';
import cookiesLabel from '@/data/cookiesLabel';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Reviews extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.isLogin = (typeof this.props.cookies.get(cookiesLabel.isLogin) === 'string' && this.props.cookies.get(cookiesLabel.isLogin) === 'true');

		this.goToPreviousPage = this.goToPreviousPage.bind(this);
		this.loadingContent = (
			<div style={{ margin: '70% auto 20% auto' }}>
				<Spinner size='large' />
			</div>
		);
	}

	componentWillReceiveProps(nextProps) {}

	shouldComponentUpdate(np) {
		if (_.has(np.product.allReviews, 'items')) {
			const { items } = this.props.product.allReviews;
			const nItems = np.product.allReviews.items;

			return (items !== nItems);
		}
		return false;
	}

	toFixDecimal = (val, max, fix = 0) => {
		return (val > 0 && val < max) ? Number.parseFloat(val).toFixed(fix) : val;
	}

	goToPreviousPage() {
		const { history } = this.props;
		if ((history.length - 1 >= 0)) {
			history.goBack();
		} else {
			history.push('/');
		}
	}

	renderReviews() {
		const { allReviews } = this.props.product;
		const reviewsContent = allReviews.items.map((item, idx) => {
			return (
				<div className='padding--small-h' key={`rvd-${idx + 1}`}>
					<Comment key={idx} type='review' data={item} />
					{!_.isEmpty(item.reply.reply) &&
						<div className='comment-reply'>
							<div><Svg src='ico_review_reply.svg' /></div>
							<Comment key={idx} type='review-reply' replyData={item.reply} sellerData={allReviews.seller} />
						</div>
					}
				</div>
			);
		});

		return (
			<div className='padding--small-h' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
				<div className='margin--medium-v'>{reviewsContent}</div>
			</div>
		);
	}

	render() {
		const { allReviews } = this.props.product;
		const reviewsEmpty = _.isEmpty(allReviews.items);
		const { info } = allReviews;
		const { rating } = info;

		const HeaderOption = {
			left: (
				<Button onClick={this.goToPreviousPage}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</Button>
			),
			center: 'Reviews',
			right: null
		};
		return (
			(!reviewsEmpty) && <div>
				<Page>
					<div>
						<div style={{ backgroundColor: '#ffffff' }}>
							<div className='flex-row padding--medium-h margin--medium-v'>
								{/* ----------------------------	SELLER REVIEW INFO ---------------------------- */}
								<div>
									<div className={styles.starCon}>
										<Svg src='ico_circle_review.svg' />
										<div className={styles.num}>{this.toFixDecimal(info.total_rating, 5, 1)}</div>
									</div>
									<Rating total={5} active={this.toFixDecimal(info.total_rating, 5, 1)} />
									<div className='text-center font-color--primary'>Ulasan ({info.total_review})</div>
								</div>
								{/* ----------------------------	END OF SELLER REVIEW INFO ---------------------------- */}


								{/* ----------------------------	REVIEW DETAILS ---------------------------- */}
								<div style={{ flex: 1 }} className='margin--large-l font-color--grey'>

									<div className='flex-row flex-spaceBetween flex-middle'>
										<Rating total={1} active={0} />
										<div className='margin--small-h'>5</div>
										<div className={styles.slider}>
											<span style={{ width: `${this.toFixDecimal(rating.rating5.percentage, 100)}%` }} />
										</div>
										<div className='padding--small-h'>{this.toFixDecimal(rating.rating5.percentage, 100)} %</div>
									</div>

									<div className='flex-row flex-spaceBetween flex-middle'>
										<Rating total={1} active={0} />
										<div className='margin--small-h'>4</div>
										<div className={styles.slider}>
											<span style={{ width: `${this.toFixDecimal(rating.rating4.percentage, 100)}%` }} />
										</div>
										<div className='padding--small-h'>{this.toFixDecimal(rating.rating4.percentage, 100)} %</div>
									</div>

									<div className='flex-row flex-spaceBetween flex-middle'>
										<Rating total={1} active={0} />
										<div className='margin--small-h'>3</div>
										<div className={styles.slider}>
											<span style={{ width: `${this.toFixDecimal(rating.rating3.percentage, 100)}%` }} />
										</div>
										<div className='padding--small-h'>{this.toFixDecimal(rating.rating3.percentage, 100)} %</div>
									</div>

									<div className='flex-row flex-spaceBetween flex-middle'>
										<Rating total={1} active={0} />
										<div className='margin--small-h'>2</div>
										<div className={styles.slider}>
											<span style={{ width: `${this.toFixDecimal(rating.rating2.percentage, 100)}%` }} />
										</div>
										<div className='padding--small-h'>{this.toFixDecimal(rating.rating2.percentage, 100)} %</div>
									</div>

									<div className='flex-row flex-spaceBetween flex-middle'>
										<Rating total={1} active={0} />
										<div className='margin--small-h'>1</div>
										<div className={styles.slider}>
											<span style={{ width: `${this.toFixDecimal(rating.rating1.percentage, 100)}%` }} />
										</div>
										<div className='padding--small-h'>{this.toFixDecimal(rating.rating1.percentage, 100)} %</div>
									</div>
								</div>
							</div>
						</div>
						{this.renderReviews()}
						{this.props.scroller.loading && (<div style={{ paddingTop: '20px' }}> <Spinner /></div>)}
					</div>

				</Page>
				<Header.Modal {...HeaderOption} />
			</div>);
	}
}

const mapStateToProps = (state) => {
	return {
		shared: state.shared,
		product: state.product,
		scroller: state.scroller,
		users: state.users
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, match, history } = props;
	const token = cookies.get(cookiesLabel.userToken);
	if (_.has(match, 'params.id') && typeof _.toInteger(match.params.id) === 'number') {
		const productId = match.params.id;
		const params = { token, productId, query: { product_id: productId, page: 1, per_page: 10 }, type: 'init' };

		const res = await dispatch(productActions.allProductReviewsAction(params));
		if (res.status !== 200 || (_.has(res, 'data.data.items') && _.isEmpty(res.data.data.items))) history.push('/not-found');

	} else history.push('/not-found');
};

export default withCookies(connect(mapStateToProps)(Scroller(Shared(Reviews, doAfterAnonymous))));
