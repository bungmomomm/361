import React, {
	Component
} from 'react';
import { Link } from 'react-router-dom';
import {
	Button,
	Card,
	Comment,
	Level,
	Input,
	Spinner
} from '@/components/mobile';
import { Love } from '@/containers/Mobile/Widget';
import stylesCatalog from './view.scss';

import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { actions as commentActions } from '@/state/v4/Comment';

// @TODO cleanup code and move it as independence Component

class CatalogView extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			commentLoading: false
		};

		this.loadingView = <Spinner />;
	}

	forceLoginNow() {
		const { forceLoginNow } = this.props;
		if (forceLoginNow) {
			forceLoginNow();
		}
	}

	// @TODO refractor and move addcomment outside this component
	async addComment(event, productId) {
		const { cookies, dispatch } = this.props;
		const { newComment } = this.state;
		if (event.key === 'Enter') {
			this.setState({
				commentLoading: true
			});
			await dispatch(commentActions.commentAddAction(cookies.get('user.token'), newComment.product_id, newComment.comment, 'pcp'));
			await dispatch(commentActions.bulkieCommentAction(cookies.get('user.token'), [productId]));
			this.setState({
				commentLoading: false
			});
		}
	}

	commentOnChange(event, productId) {
		this.setState({ newComment: { product_id: productId, comment: event.target.value } });
	}

	renderComment(product) {
		const { comments, cookies } = this.props;
		const { commentLoading } = this.state;

		if (comments.isLoading) {
			return this.loadingView;
		}

		const redirectUri = `?redirect_uri=product/comments/${product.product_id}`;

		const commentProduct = product.comments || false;
		return (
			<div className={stylesCatalog.commentBlock}>
				{(commentProduct) && (
					<Link to={product.commentUrl}>
						<Button>View {commentProduct.total} comments</Button>
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
					<Level.Item>
						{
							cookies.get('isLogin') === 'true' ?
								comments.isLoading || commentLoading ? this.loadingView :
									(
										<Input
											color='white'
											placeholder='Write comment'
											onKeyPress={(e) => this.addComment(e, product.product_id)}
											onChange={(e) => this.commentOnChange(e, product.product_id)}
										/>)
								: (
									<span><Link to={`/login${redirectUri}`}>Login</Link> / <Link to={`/register${redirectUri}`}>Register</Link> untuk memberikan komentar</span>
								)
						}
					</Level.Item>
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
							{comments && comments.loading ? this.loadingView : this.renderComment(product)}
						</div>
					);
				})}
			</div>
		);
	}
}

export default withCookies(connect()(CatalogView));