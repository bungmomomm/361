import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { actions } from '@/state/v4/Product';

class Products extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
	}
	

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(new actions.productDetailAction(this.userCookies, dispatch));
	}

	render() {
		const { product } = this.props;
		const productDetail = product.detail;
		return (
			<div>
				<h1>{productDetail.brand_name}</h1>
				<div> {productDetail.description} </div>
			</div>);
	}
}

const mapStateToProps = (state) => {
	return {
		...state
	};
};

export default withCookies(connect(mapStateToProps)(Products));
