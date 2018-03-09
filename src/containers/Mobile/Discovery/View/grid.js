import React, { Component } from 'react';
import {
	Card,
	Spinner
} from '@/components/mobile';
import Love from '@/containers/Mobile/Shared/Widget/Love';
import stylesCatalog from './view.scss';

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
		const { loading, products } = this.props;
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
				{loading && (
					<div style={{ margin: '20px auto 20px auto' }}><Spinner /></div>
				)}
			</div>
		);
	}
}

export default GridView;