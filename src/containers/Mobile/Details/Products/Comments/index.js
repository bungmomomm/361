import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import util from 'util';
import validator from 'validator';
import queryString from 'query-string';

import { Page, Header, Svg, Comment, Input, Button, Level, Spinner, Image } from '@/components/mobile';

import Shared from '@/containers/Mobile/Shared';

import { actions as commentActions } from '@/state/v4/Comment';

import styles from './comments.scss';
import cookiesLabel from '@/data/cookiesLabel';

class Comments extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.isLogin = this.props.cookies.get(cookiesLabel.isLogin) || false;

		this.state = {
			validForm: false,
			commentValue: '',
			showCounter: false,
			counterValue: 0,
			counterLimit: 300
		};

		this.userProfile = this.props.cookies.get(cookiesLabel.userProfile) || false;
		this.renderLoading = <Spinner />;
	}

	inputHandler(e) {
		const value = util.format('%s', e.target.value);

		if (value.length > 0) {
			this.setState({ showCounter: true, counterValue: value.length });
		} else {
			this.setState({ counterValue: 0 });
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
			await dispatch(commentActions.productCommentAction(cookies.get(cookiesLabel.userToken), commentsParam.product_id, commentsParam.page));
		}
	}

	postComment() {
		const { dispatch, match, cookies } = this.props;
		const { commentValue } = this.state;

		const productId = _.chain(match).get('params.id').value() || false;
		if (productId) {
			dispatch(commentActions.commentAddAction(cookies.get(cookiesLabel.userToken), productId, commentValue));
		}

		this.setState({
			validForm: false,
			showCounter: false,
			counterValue: 0,
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
				<div className={styles.loadMore}>
					<Button
						onClick={() => this.loadNextComments()}
						loading={isLoading}
					>
						Lihat komentar sebelumnya
					</Button>
				</div>
			) : '';
			return (
				<div style={{ marginBottom: '50px' }}>
					{loadMore}
					{<Comment data={comments.comments} loading={isLoading} />}
				</div>
			);
		}

		return null;
	}

	renderCounter() {
		const { showCounter, counterValue, counterLimit } = this.state;

		if (showCounter) {
			return `${counterValue}/${counterLimit}`;
		}

		return null;
	}

	renderAvailComment() {
		const { isLoading, location } = this.props;
		const { validForm, commentValue } = this.state;
		const redirectUri = location.pathname !== '' ? `?redirect_uri=${location.pathname}` : '';

		if (this.isLogin === 'true') {
			const userAvatar = this.userProfile && !_.isEmpty(this.userProfile.avatar) ? (
				<Level.Left>
					<Image
						height={30}
						width={30}
						avatar
						src={this.userProfile.avatar}
						style={{ marginRight: '8px' }}
					/>
				</Level.Left>
			) : '';

			return (
				<Level className={styles.commentbox}>
					{userAvatar}
					<Level.Item>
						<Input
							as='textarea'
							color='white'
							placeholder='Tulis komentar..'
							value={commentValue}
							onChange={(e) => this.inputHandler(e)}
							onFocus={() => this.setState({ showCounter: true })}
							onBlur={() => commentValue.length === 0 && this.setState({ showCounter: false })}
							textCounter={this.renderCounter()}
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
				<Link to={`/login${redirectUri}`}>Login</Link> / <Link to={`/register${redirectUri}`}>Register</Link> untuk memberikan komentar
			</span>
		);
	}

	render() {
		const { isLoadingProfile } = this.props;

		return (
			<div className={styles.commentsContainer}>
				<div className={styles.commentsBackground} />
				<Page style={{ paddingTop: 0 }} color='white'>
					<div className='margin--medium-v'>
						{this.renderDetail()}
						{this.renderComments()}
					</div>
				</Page>
				{this.renderHeader()}
				{isLoadingProfile ? this.renderLoading : this.renderAvailComment()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		...state,
		comments: state.comments.data || '',
		product: state.comments.data.product || '',
		isLoading: state.comments.isLoading,
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, match } = props;

	const productId = _.chain(match).get('params.id').value() || false;
	if (productId) {
		await dispatch(commentActions.productCommentAction(cookies.get(cookiesLabel.userToken), productId, 1));
	}
};

export default withCookies(connect(mapStateToProps)(Shared(Comments, doAfterAnonymous)));
