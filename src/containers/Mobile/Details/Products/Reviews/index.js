import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Page, Header, Svg, Comment, Spinner, Button } from '@/components/mobile';
import { actions as productActions } from '@/state/v4/Product';
import Shared from '@/containers/Mobile/Shared';

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
			return <Comment key={idx} type='review' data={item} />;
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
				<Page color='white'>
					<div style={{ backgroundColor: '#F5F5F5' }}>
						<div className='padding--small-h' style={{ backgroundColor: '#fff', marginTop: '15px', minHeight: 150, maxHeight: 200, wordWrap: 'break-word' }}>
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
