import React, {
	Component 
} from 'react';
import _ from 'lodash';
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

class CatalogView extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {

		};

		this.loading = <div style={{ margin: '20px auto 20px auto' }}><Spinner /></div>;
	}

	forceLoginNow() {
		const { forceLoginNow } = this.props;
		if (forceLoginNow) {
			forceLoginNow();
		}
	}

	renderComment(product) {
		const { comments } = this.props;

		if (comments.loading) {
			return this.loading;
		}

		if (comments.status === 'success') {
			const commentProduct = _.find(comments.data, { product_id: product.product_id }) || false;
			if (commentProduct) {
				return (
					<div className={stylesCatalog.commentBlock}>
						<Link to={product.commentUrl}>
							<Button>View {commentProduct.total} comments</Button>
						</Link>
						<Comment data={commentProduct.last_comment} pcpComment />
						<Level>
							<Level.Item>
								<Input color='white' placeholder='Write comment' />
							</Level.Item>
						</Level>
					</div>
				);
			}
		}

		return null;
	}

	render() {
		const { loading, comments, products } = this.props;
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
										status={product.lovelistStatus}
										data={product.product_id}
										total={product.lovelistTotal}
										onNeedLogin={() => this.forceLoginNow()}
										showNumber
									/>
								)}
							/>
							{comments && comments.loading ? this.loading : this.renderComment(product)}
						</div>
					);
				})}
				{loading && this.loading}
			</div>
		);
	}
}

export default CatalogView;