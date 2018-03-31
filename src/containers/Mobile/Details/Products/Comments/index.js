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
import handler from '@/containers/Mobile/Shared/handler';
import { urlBuilder } from '@/utils';

@handler
class Comments extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.isLogin = this.props.cookies.get(cookiesLabel.isLogin) || false;

		this.state = {
			validForm: false,
			commentValue: '',
			showCounter: false,
			counterValue: 0
		};

		this.userProfile = this.props.cookies.get(cookiesLabel.userProfile) || false;
		this.counterLimit = 300;
		this.loadingView = (
			<div style={{ margin: '20px auto 20px auto' }}>
				<Spinner />
			</div>
		);

		this.hastagLinkCreator = (text) => {
			const urlRegex = /(#[^\s]+)/g;
			return text.replace(urlRegex, (url) => {
				const hashlink = urlBuilder.setName(url).buildSearchByKeyword();
				return `<a href="${hashlink + url.replace('#', '%23')}">${url}</a>`;
			});
		};
	}

	componentWillUnmount() {
		const { dispatch } = this.props;

		dispatch(commentActions.commentLoadingAction(true));
	}

	inputHandler(e) {
		const value = util.format('%s', e.target.value);

		if (value.length > 0) {
			this.setState({ showCounter: true, counterValue: value.length });
		} else {
			this.setState({ counterValue: 0 });
		}

		let validForm = false;
		if (!validator.isEmpty(value) && value.length <= this.counterLimit) {
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

	postComment = async () => {
		const { dispatch, match, cookies } = this.props;
		const { commentValue } = this.state;

		const productId = _.chain(match).get('params.id').value() || false;
		if (productId) {
			await dispatch(commentActions.commentAddAction(cookies.get(cookiesLabel.userToken), productId, commentValue));
		}

		this.setState({
			validForm: false,
			showCounter: false,
			counterValue: 0,
			commentValue: ''
		});

		const body = document.body;
		const html = document.documentElement;
		const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
		window.scrollTo(0, height);
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
					className='margin--medium-v padding--medium-h wysiwyg-content'
					dangerouslySetInnerHTML={{ __html: this.hastagLinkCreator(product.description) }}
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
				<div>
					{loadMore}
					{<Comment data={comments.comments} loading={isLoading} />}
				</div>
			);
		}

		return null;
	}

	renderCounter() {
		const { showCounter, counterValue } = this.state;

		if (showCounter) {
			return `${counterValue}/${this.counterLimit}`;
		}

		return null;
	}

	renderAvailComment() {
		const { isLoading, location } = this.props;
		const { validForm, commentValue } = this.state;
		const redirectUri = location.pathname !== '' ? `?redirect_uri=${location.pathname}` : '';

		if (this.isLogin === 'true') {
			const userAvatar = this.userProfile && !_.isEmpty(this.userProfile.avatar) ? (
				<Level.Left
					style={{ paddingBottom: '2px' }}
				>
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
				<Level className={styles.commentbox} innerRef={(n) => { this.commentBoxRef = n; }}>
					{userAvatar}
					<Level.Item>
						<Input
							as='textarea'
							maxLength={this.counterLimit}
							color='white'
							placeholder='Tulis komentar..'
							value={commentValue}
							onChange={(e) => this.inputHandler(e)}
							onFocus={() => this.setState({ showCounter: true })}
							onBlur={() => commentValue.length === 0 && this.setState({ showCounter: false })}
							textCounter={this.renderCounter()}
						/>
					</Level.Item>
					<Level.Right
						style={{ paddingBottom: '10px' }}
					>
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
			<Level className={styles.commentboxGuest}>
				<Link to={`/login${redirectUri}`}>Login</Link>&nbsp;/&nbsp;<Link to={`/register${redirectUri}`}>Register</Link>&nbsp;untuk memberikan komentar
			</Level>
		);
	}

	render() {
		const { isLoading } = this.props;
		const commentBoxHeight = () => {
			if (_.has(this, 'commentBoxRef')) {
				return _.round(this.commentBoxRef.getBoundingClientRect().height);
			};
			return 68;
		};

		return (
			<div className={styles.commentsContainer}>
				<div className={styles.commentsBackground} />
				<Page>
					{isLoading ? this.loadingView : (
						<div className='padding--medium-v' style={{ backgroundColor: '#fff' }}>
							{this.renderDetail()}
							{this.renderComments()}
						</div>
					)}
				</Page>
				{this.renderHeader()}
				<div style={{ order: 5 }}>
					<div style={{ height: commentBoxHeight() }}>
						{this.renderAvailComment()}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		...state,
		comments: state.comments.data || {},
		product: state.comments.data.product || {},
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
