import React, {
	Component
} from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import util from 'util';
import validator from 'validator';

import {
	Button,
	Card,
	Comment,
	Level,
	Input,
	Spinner,
	Image
} from '@/components/mobile';

import { Love } from '@/containers/Mobile/Widget';

import { actions as commentActions } from '@/state/v4/Comment';

import stylesCatalog from './view.scss';

// @TODO cleanup code and move it as independence Component

class CatalogView extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			commentLoading: false,
			showSendButton: false,
			showCounter: false,
			validForm: false,
			newComment: {
				product_id: props.focusedProductId || '',
				comment: ''
			},
			counterValue: 0,
			counterLimit: 300
		};

		this.userProfile = this.props.cookies.get('user.profile') || false;
		this.loadingView = <Spinner />;
	}

	componentWillReceiveProps(nextProps) {
		const { newComment } = this.state;

		if (nextProps.focusedProductId !== this.props.focusedProductId) {
			this.setState({
				newComment: {
					...newComment,
					product_id: nextProps.focusedProductId
				}
			});
		}
	}

	setFocusedProduct(id) {
		const { setFocusedProduct, focusedProductId } = this.props;

		if (focusedProductId !== id) {
			this.setState({
				showSendButton: true,
				showCounter: false,
				validForm: false,
				counterValue: 0
			});
		}
		
		setFocusedProduct(id);
	}

	forceLoginNow() {
		const { forceLoginNow } = this.props;

		if (forceLoginNow) {
			forceLoginNow();
		}
	}

	// @TODO refractor and move addcomment outside this component
	async addComment() {
		const { cookies, dispatch, focusedProductId } = this.props;
		const { newComment } = this.state;

		this.setState({
			commentLoading: true
		});

		await dispatch(commentActions.commentAddAction(cookies.get('user.token'), newComment.product_id, newComment.comment, 'pcp'));
		await dispatch(commentActions.bulkieCommentAction(cookies.get('user.token'), [focusedProductId]));
		
		this.setState({
			commentLoading: false,
			showSendButton: false,
			showCounter: false,
			validForm: false,
			counterValue: 0
		});
	}

	commentOnChange(e) {
		const { newComment } = this.state;
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
			newComment: {
				...newComment,
				comment: value
			}
		});
	}

	renderComment(product) {
		const { comments, cookies, focusedProductId, redirectPath } = this.props;
		const {
			commentLoading, 
			validForm, showCounter, showSendButton, counterValue, counterLimit
		} = this.state;

		if (comments.isLoading) {
			return this.loadingView;
		}

		const redirectUri = redirectPath !== '' ? `?redirect_uri=${redirectPath}` : `?redirect_uri=product/comments/${product.product_id}`;

		const userAvatar = this.userProfile && !_.isEmpty(this.userProfile.avatar) ? (
			<Level.Left>
				<Image
					height={30}
					width={30}
					avatar
					lazyload
					src={this.userProfile.avatar}
					style={{ marginRight: '8px' }}
				/>
			</Level.Left>
		) : '';

		const textCounter = showCounter ? (
			`${counterValue}/${counterLimit}`
		) : '';

		const sendButton = showSendButton && focusedProductId === product.product_id ? (
			<Level.Right>
				<Button
					className={stylesCatalog.sendButton}
					onClick={() => this.addComment()}
					loading={comments.isLoading}
					disabled={!validForm}
				>
					KIRIM
				</Button>
			</Level.Right>
		) : '';

		const commentProps = focusedProductId === product.product_id ? {
			onChange: (e) => this.commentOnChange(e),
			iconRight: textCounter
		} : '';

		const commentProduct = product.comments || false;
		return (
			<div className={stylesCatalog.commentBlock}>
				{(commentProduct) && (
					<Link to={product.commentUrl}>
						<Button>Lihat semua {commentProduct.total} komentar</Button>
					</Link>
				)}
				{(commentProduct) && (
					<Comment
						data={commentProduct.last_comment}
						type='lite-review'
						loading={comments.loading}
					/>
				)}
				<Level>
					{userAvatar}
					<Level.Item>
						{
							cookies.get('isLogin') === 'true' ?
								comments.isLoading || commentLoading ? this.loadingView :
									(
										<Input
											color='white'
											placeholder='Tulis komentar..'
											onClickInputAction={() => this.setFocusedProduct(product.product_id)}
											{...commentProps}
										/>
									)
								: (
									<span><Link to={`/login${redirectUri}`}>Login</Link> / <Link to={`/register${redirectUri}`}>Register</Link> untuk memberikan komentar</span>
								)
						}
					</Level.Item>
					{sendButton}
				</Level>
			</div>
		);
	}

	render() {
		const {
			comments,
			products,
			loveIsLogin,
			loveClick,
			loveLoading,
			productOnClick
		} = this.props;
		return (
			<div className={stylesCatalog.cardContainer}>
				{products.map((product, index) => {
					return (
						<div key={index} className={stylesCatalog.cardCatalog}>
							<Card.Catalog
								images={product.images}
								productTitle={product.product_title}
								brandName={product.brand.name}
								pricing={product.pricing}
								linkToPdp={product.url}
								commentTotal={product.commentTotal}
								commentUrl={product.commentUrl}
								love={(
									<Love
										isLogin={loveIsLogin}
										loading={loveLoading}
										status={product.lovelistStatus}
										data={product.product_id}
										total={product.lovelistTotal}
										onNeedLogin={() => this.forceLoginNow()}
										onClick={loveClick}
										showNumber
									/>
								)}
								productOnClick={() => productOnClick(product, index + 1)}
							/>
							{comments && comments.isLoading ? this.loadingView : this.renderComment(product)}
						</div>
					);
				})}
			</div>
		);
	}
}

export default withCookies(connect()(CatalogView));