import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Page, Header, Svg, Comment, Spinner, Button, Rating } from '@/components/mobile';
import { actions as productActions } from '@/state/v4/Product';
import Shared from '@/containers/Mobile/Shared';
import styles from './reviews.scss';

class Reviews extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.isLogin = (typeof this.props.cookies.get('isLogin') === 'string' && this.props.cookies.get('isLogin') === 'true');

		this.state = {
			loading: false
		};

		this.goToPreviousPage = this.goToPreviousPage.bind(this);
		this.loadingContent = (
			<div style={{ margin: '20% auto 20% auto' }}>
				<Spinner size='large' />
			</div>
		);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			loading: this.props.product.loading
		});
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
		const reviewsNotReady = _.isEmpty(allReviews.items);

		if (reviewsNotReady) return this.loadingContent;

		const reviewsContent = allReviews.items.map((item, idx) => {
			return (
				<div>
					<Comment key={idx} type='review' data={item} />
					<div className='comment-reply'>
						<div><Svg src='ico_review_reply.svg' /></div>
						<Comment key={idx} type='review' data={item} />
					</div>
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
			<div>
				<Page>
					<div>
						<div style={{ backgroundColor: '#ffffff' }}>
							<div className='flex-row padding--medium-h margin--medium-v'>
								<div>
									<div className={styles.starCon}>
										<Svg src='ico_circle_review.svg' />
										<div className={styles.num}>4.8</div>
									</div>
									<Rating total={5} active={3} />
									<div className='text-center font-color--grey'>Ulasan (99)</div>
								</div>
								<div style={{ flex: 1 }} className='margin--large-l font-color--grey'>
									<div className='flex-row flex-spaceBetween flex-middle'>
										<Rating total={1} active={0} />
										<div className='margin--small-h'>5</div>
										<div className={styles.slider}>
											<span />
										</div>
										<div className='padding--small-h'>100 %</div>
									</div>
									<div className='flex-row flex-spaceBetween flex-middle'>
										<Rating total={1} active={0} />
										<div className='margin--small-h'>5</div>
										<div className={styles.slider}>
											<span />
										</div>
										<div className='padding--small-h'>100 %</div>
									</div>
									<div className='flex-row flex-spaceBetween flex-middle'>
										<Rating total={1} active={0} />
										<div className='margin--small-h'>5</div>
										<div className={styles.slider}>
											<span />
										</div>
										<div className='padding--small-h'>100 %</div>
									</div>
									<div className='flex-row flex-spaceBetween flex-middle'>
										<Rating total={1} active={0} />
										<div className='margin--small-h'>5</div>
										<div className={styles.slider}>
											<span />
										</div>
										<div className='padding--small-h'>100 %</div>
									</div>
									<div className='flex-row flex-spaceBetween flex-middle'>
										<Rating total={1} active={0} />
										<div className='margin--small-h'>5</div>
										<div className={styles.slider}>
											<span />
										</div>
										<div className='padding--small-h'>100 %</div>
									</div>
								</div>
							</div>
							{JSON.stringify(allReviews.info)}
						</div>
						{this.renderReviews()}
					</div>

				</Page>
				<Header.Modal {...HeaderOption} />
			</div>);
	}
}

const mapStateToProps = (state) => {
	return {
		product: state.product,
		shared: state.shared,
		users: state.users
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, match } = props;
	const token = cookies.get('user.token');
	const productId = match.params.id;

	dispatch(productActions.allProductReviewsAction(token, productId));
};

export default withCookies(connect(mapStateToProps)(Shared(Reviews, doAfterAnonymous)));
