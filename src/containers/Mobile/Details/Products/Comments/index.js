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
import { loading } from '@/utils';

class Comments extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.productId = this.props.match.params.id;
		this.isLogin = this.props.cookies.get('isLogin') || false;
		this.renderLoading = <div><Spinner /></div>;
		this.writeComment = this.writeComment.bind(this);
		this.postComment = this.postComment.bind(this);

	}

	componentWillMount() {
		this.setState({
			detail: {
				isLoading: true,
				firstLoad: this.renderLoading
			},
			comment: {
				isLoading: true,
				firstLoad: this.renderLoading
			},
			hashtag: {
				isLoading: true,
				firstLoad: this.renderLoading
			},
			productComment: ''
		});
	}

	writeComment(e) {
		this.setState({
			productComment: e.target.value
		});

	}

	postComment() {
		const { dispatch } = this.props;
		const { productComment } = this.state;

		dispatch(commentActions.commentAddAction(this.userCookies, this.productId, productComment));
	}

	renderComments() {
		const { comments } = this.props;

		const commentReady = _.isEmpty(comments.data);

		if (commentReady) {
			const me = this;
			loading().then((response) => {
				if (me.state.comment.isLoading) {
					me.setState({
						comment: {
							isLoading: false,
							firstLoad: null
						}
					});
				}

			});
			return this.state.comment.firstLoad;
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
			const me = this;
			loading().then((response) => {
				if (me.state.detail.isLoading) {
					me.setState({
						detail: {
							isLoading: false,
							firstLoad: null
						}
					});
				}
			});

			return this.state.detail.firstLoad;
		}

		return (
			<div>
				<p className='margin--small padding--medium-h' dangerouslySetInnerHTML={{ __html: product.detail.description }} />
				{/* <span className='margin--small padding--medium-h'>
					<a>#jualbajubangkok</a> <a>#supplierbangkok</a> <a>#pobkkfirsthand</a> <a>#pobkk</a> <a>#pohk</a> <a>#grosirbaju</a> <a>#premiumquaity</a> <a>#readytowear</a> <a>#ootdindo</a> <a>#olshop</a> <a>#trustedseller</a> <a>#supplierbaju</a> <a>#pochina</a>
				</span> */}
			</div>
		);
	}

	renderAvailComment() {

		if (this.isLogin === 'true') {
			return (
				<Level className={styles.commentbox}>
					<Level.Item><Input color='white' placeholder='Type a message ...' onChange={this.writeComment} /></Level.Item>
					<Level.Right><Button className='padding--small-h font--lato-normal' style={{ marginLeft: '15px' }} onClick={this.postComment} >KIRIM</Button></Level.Right>
				</Level>
			);
		}


		return (
			<Level className={styles.commentbox}>
				<Link to='/user/login'>Log in</Link> / <Link to='/user/register'>Register</Link> untuk memberi komentar
			</Level>
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
					</div>
					{ this.renderComments() }
				</Page>
				<Header.Modal {...HeaderOption} />

				{ this.renderAvailComment() }
			</div>);
	}
}

const mapStateToProps = (state) => {
	console.log(state);
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
