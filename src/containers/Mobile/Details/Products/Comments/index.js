import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import _ from 'lodash';
import util from 'util';
import validator from 'validator';
import queryString from 'query-string';

import { Page, Header, Svg, Comment, Input, Button, Level, Spinner, Image } from '@/components/mobile';

import Shared from '@/containers/Mobile/Shared';

import { actions as commentActions } from '@/state/v4/Comment';
import { actions as userActions } from '@/state/v4/User';

import styles from './comments.scss';

class Comments extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.isLogin = this.props.cookies.get('isLogin') || false;

		this.state = {
			validForm: false,
			commentValue: '',
			showClearButton: false
		};

		this.renderLoading = <Spinner />;
		this.clearButton = <Svg src='ico_clear.svg' />;
	}

	inputHandler(e) {
		const value = util.format('%s', e.target.value);

		if (value.length > 0) {
			this.setState({ showClearButton: true });
		} else {
			this.setState({ showClearButton: false });
		}

		let validForm = false;
		if (!validator.isEmpty(value) && value.length <= 300) {
			validForm = true;
		}

		this.setState({
			validForm,
			commentValue: value
		});
	}

	loadNextComments = async () => {
		const { dispatch, comments, cookies } = this.props;

		if (!_.isEmpty(comments.links.next)) {
			const getParam = queryString.extract(comments.links.next);
			const parsedUrl = queryString.parse(getParam);
			const commentsParam = {
				product_id: parsedUrl.product_id !== undefined ? parseInt(parsedUrl.product_id, 10) : '',
				page: parsedUrl.page !== undefined ? parseInt(parsedUrl.page, 10) : ''
			};
			await dispatch(commentActions.productCommentAction(cookies.get('user.token'), commentsParam.product_id, commentsParam.page));
		}
	}

	postComment() {
		const { dispatch, match, cookies } = this.props;
		const { commentValue } = this.state;

		const productId = _.chain(match).get('params.id').value() || false;
		if (productId) {
			dispatch(commentActions.commentAddAction(cookies.get('user.token'), productId, commentValue));
		}

		this.setState({
			commentValue: ''
		});
	}

	renderHeader() {
		const { history } = this.props;

		let back;
		if (this.props.history.length === 0) {
			back = () => history.push('/');
		} else {
			back = () => history.goBack();
		}

		const HeaderOption = {
			left: (
				<Button onClick={back}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</Button>
			),
			center: 'Komentar',
			right: null
		};

		return <Header.Modal {...HeaderOption} />;
	}

	renderDetail() {
		const { product } = this.props;

		if (!_.isEmpty(product)) {
			return (
				<div
					className='margin--small-v padding--medium-h'
					dangerouslySetInnerHTML={{ __html: product.description }}
				/>
			);
		}
		
		return null;
	}

	renderComments() {
		const { isLoading, comments } = this.props;
		
		if (!_.isEmpty(comments.comments)) {
			const loadMore = !_.isEmpty(comments.links.next) ? (
				<Button
					className={styles.loadMore}
					onClick={() => this.loadNextComments()}
					loading={isLoading}
				>
					Lihat komentar sebelumnya
				</Button>
			) : '';
			return (
				<div style={{ marginBottom: '100px' }}>
					{loadMore}
					{<Comment data={comments.comments} loading={isLoading} />}
				</div>
			);
		}

		return null;
	}

	renderClearButton() {
		const { showClearButton } = this.state;

		if (showClearButton) {
			return (
				<Button
					onClick={() => {
						this.setState({
							commentValue: '',
							showClearButton: false,
							validForm: false
						});
					}}
				>
					{this.clearButton}
				</Button>
			);
		}

		return null;
	}

	renderAvailComment() {
		const { isLoading, userProfile } = this.props;
		const { validForm, commentValue } = this.state;

		if (this.isLogin === 'true') {
			const userAvatar = !_.isEmpty(userProfile) ? (
				<Level.Left>
					<Image
						height={30}
						width={30}
						avatar
						src={userProfile.avatar}
						style={{ marginRight: '8px' }}
					/>
				</Level.Left>
			) : '';

			return (
				<Level className={styles.commentbox}>
					{userAvatar}
					<Level.Item>
						<Input
							color='white'
							placeholder='Tulis komentar..'
							value={commentValue}
							onChange={(e) => this.inputHandler(e)}
							iconRight={this.renderClearButton()}
						/>
					</Level.Item>
					<Level.Right>
						<Button
							className='padding--small-h font--lato-bold'
							style={{ marginLeft: '5px' }}
							onClick={() => this.postComment()}
							loading={isLoading}
							disabled={!validForm}
						>
							KIRIM
						</Button>
					</Level.Right>
				</Level>
			);
		}

		return (
			<span className={styles.commentbox}>
				<a href='/login'>Log in</a> / <a href='/register'>Register</a> untuk memberi komentar
			</span>
		);
	}

	render() {
		const { isLoadingProfile } = this.props;

		return (
			<div>
				<div className={styles.commentsBackground} />
				<Page style={{ paddingTop: 0 }} color='white'>
					<div className='margin--medium-v'>
						{this.renderDetail()}
						{this.renderComments()}
					</div>
				</Page>
				{this.renderHeader()}
				{isLoadingProfile ? this.renderLoading : this.renderAvailComment()}
			</div>);
	}
}

const mapStateToProps = (state) => {
	return {
		...state,
		comments: state.comments.data || '',
		product: state.comments.data.product || '',
		isLoading: state.comments.isLoading,
		isLoadingProfile: state.users.isLoading,
		userProfile: state.users.userProfile
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, match, shared } = props;

	const productId = _.chain(match).get('params.id').value() || false;
	if (productId) {
		await dispatch(commentActions.productCommentAction(cookies.get('user.token'), productId, 1));
	}

	const serviceUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;
	if (serviceUrl) {
		await dispatch(userActions.userGetProfile(cookies.get('user.token')));
	}
};

export default withCookies(connect(mapStateToProps)(Shared(Comments, doAfterAnonymous)));
