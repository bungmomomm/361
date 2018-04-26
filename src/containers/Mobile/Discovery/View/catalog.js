import React, {
	Component
} from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import util from 'util';

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

import cookiesLabel from '@/data/cookiesLabel';

import stylesCatalog from './view.scss';

// @TODO cleanup code and move it as independence Component
import handler from '@/containers/Mobile/Shared/handler';

@handler
class CatalogView extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			showSendButton: false,
			showCounter: false,
			validForm: false,
			newComment: {
				product_id: props.focusedProductId || '',
				comment: ''
			},
			counterValue: 0
		};

		this.userProfile = this.props.cookies.get(cookiesLabel.userProfile) || false;
		this.counterLimit = 300;
		this.loadingView = (
			<div style={{ margin: '20px auto 20px auto' }}>
				<Spinner />
			</div>
		);
	}

	componentWillReceiveProps(nextProps) {
		const { newComment } = this.state;

		if (nextProps) {
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

		if (id !== focusedProductId) {
			this.setState({
				showCounter: false,
				validForm: false
			});
		}

		const getValueLength = document.getElementById(`textarea-${id}`).value.length;

		this.setState({
			counterValue: getValueLength,
			showCounter: true,
			showSendButton: true
		});

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

		await dispatch(commentActions.commentAddAction(cookies.get(cookiesLabel.userToken), newComment.product_id, newComment.comment, 'pcp'));
		await dispatch(commentActions.bulkieCommentAction(cookies.get(cookiesLabel.userToken), [focusedProductId]));

		this.setState({
			showSendButton: false,
			showCounter: false,
			validForm: false,
			counterValue: 0,
			newComment: {
				product_id: '',
				comment: ''
			}
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
		if (value.length > 0 && value.length <= this.counterLimit) {
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
		const { validForm, showCounter, showSendButton, counterValue } = this.state;

		if (comments.isLoading) {
			return this.loadingView;
		}

		const redirectUri = redirectPath !== '' ? `?redirect_uri=${redirectPath}` : `?redirect_uri=/product/comments/${product.product_id}`;

		const userAvatar = this.userProfile && !_.isEmpty(this.userProfile.avatar) ? (
			<Level.Left
				style={{ justifyContent: 'flex-end', paddingBottom: '5px' }}
			>
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
			`${counterValue}/${this.counterLimit}`
		) : '';

		const sendButton = showSendButton && focusedProductId === product.product_id ? (
			<Level.Right
				style={{ justifyContent: 'flex-end', paddingBottom: '10px' }}
			>
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
			textCounter
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
						loading={comments.isLoading}
					/>
				)}
				<Level>
					{cookies.get(cookiesLabel.isLogin) === 'true' && userAvatar}
					<Level.Item>
						{
							cookies.get(cookiesLabel.isLogin) === 'true' ?
								comments.isLoading ? this.loadingView :
									(
										<Input
											as='textarea'
											id={`textarea-${product.product_id}`}
											maxLength={this.counterLimit}
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
								productOnClick={productOnClick ? () => productOnClick(product, index + 1) : () => true}
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
