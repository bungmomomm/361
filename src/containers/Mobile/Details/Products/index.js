import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { actions as productActions } from '@/state/v4/Product';
import { actions as commentActions } from '@/state/v4/Comment';

class Products extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
	}
	

	componentDidMount() {
		const { dispatch, match } = this.props;
		dispatch(new productActions.productDetailAction(this.userCookies, match.params.id));
		dispatch(new productActions.productRecommendationAction(this.userCookies));
		dispatch(new productActions.productSimilarAction(this.userCookies));
		dispatch(new productActions.productSocialSummaryAction(this.userCookies));
		dispatch(new commentActions.productCommentAction(this.userCookies));
	}

	addComment() {
		const { dispatch } = this.props;
		dispatch(new commentActions.commentAddAction(this.userCookies));		
	}

	render() {
		const { product } = this.props;
		const productDetail = product.detail;
		return (
			<div>
				<h1>{productDetail.brand_name}</h1>
				<div> {productDetail.description} </div>
				<button onClick={() => this.addComment()}> add comment </button>
			</div>);
	}
}

const mapStateToProps = (state) => {
	return {
		...state
	};
};

export default withCookies(connect(mapStateToProps)(Products));
