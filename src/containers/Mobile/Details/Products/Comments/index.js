import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Page, Header, Svg, Comment, Input, Button, Level, Spinner } from '@/components/mobile';
import styles from './comments.scss';
import { actions as commentActions } from '@/state/v4/Comment';
import { actions as productActions } from '@/state/v4/Product';
import Shared from '@/containers/Mobile/Shared';

class Comments extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.productId = this.props.match.params.id;
	}

	renderComments() {
		const { comments } = this.props;

		const commentReady = _.isEmpty(comments.data);

		if (commentReady) {
			return <div><Spinner /></div>;
		}

		return (
			<div style={{ marginBottom: '100px' }}>
				{ <Comment data={comments.data} /> }
			</div>
		);
		
	}

	renderDetail() {
		const { product } = this.props;
		const detailReady = _.isEmpty(product.detail);

		if (detailReady) {
			return <div><Spinner /></div>;
		}

		return (
			<p className='margin--small padding--medium'>
				{ product.detail.description }
			</p>
		);
	}

	render() {
		const { match } = this.props;
		const HeaderOption = {
			left: (
				<Link to={`/product/${match.params.id}`}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</Link>
			),
			center: 'Comments',
			right: null
		};
		return (
			<div>
				<Page>
					<div className='margin--medium'>
						{ this.renderDetail() }
						<span className='margin--small padding--medium'>
							<a>#jualbajubangkok</a> <a>#supplierbangkok</a> <a>#pobkkfirsthand</a> <a>#pobkk</a> <a>#pohk</a> <a>#grosirbaju</a> <a>#premiumquaity</a> <a>#readytowear</a> <a>#ootdindo</a> <a>#olshop</a> <a>#trustedseller</a> <a>#supplierbaju</a> <a>#pochina</a>
						</span>
					</div>
					{ this.renderComments() }
				</Page>
				<Header.Modal {...HeaderOption} />
				<Level className={styles.commentbox}>
					<Level.Item><Input color='white' placeholder='Type a message ...' /></Level.Item>
					<Level.Right><Button className='padding--small font--lato-normal' style={{ marginLeft: '15px' }}>KIRIM</Button></Level.Right>
				</Level>
			</div>);
	}
}

const mapStateToProps = (state) => {
	return {
		comments: state.comments,
		product: state.product, 
		shared: state.shared
	};
};

const doAfterAnonymous = (props) => {
	const { dispatch, product, cookies, match } = props;
	const token = cookies.get('user.token');
	const productId = match.params.id;
	if (_.isEmpty(product.detail)) {
		dispatch(new productActions.productDetailAction(token, productId));
	}
	dispatch(commentActions.productCommentAction(token, productId, 1));
};

export default withCookies(connect(mapStateToProps)(Shared(Comments, doAfterAnonymous)));
