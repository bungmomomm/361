import React, { Component } from 'react';
import {
	Card
} from '@/components/mobile';
import { Love } from '@/containers/Mobile/Widget';
import stylesCatalog from './view.scss';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class GridView extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {

		};
	}

	forceLoginNow() {
		const { forceLoginNow } = this.props;
		if (forceLoginNow) {
			forceLoginNow();
		}
	}

	render() {
		const { products, productOnClick } = this.props;
		return (
			<div className={stylesCatalog.cardContainer}>
				{products.map((product, index) => {
					return (
						<Card.CatalogGrid
							key={index}
							images={product.images}
							productTitle={product.product_title}
							brandName={product.brand.name}
							pricing={product.pricing}
							linkToPdp={product.url}
							productOnClick={() => productOnClick(product, index + 1)}
							love={(
								<Love
									status={product.lovelistStatus}
									data={product.product_id}
									total={product.lovelistTotal}
									onNeedLogin={() => this.forceLoginNow()}
								/>
							)}
						/>
					);
				})}
			</div>
		);
	}
}

export default GridView;
