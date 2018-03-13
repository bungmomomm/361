import React, { Component } from 'react';
import {
	Card
} from '@/components/mobile';
import stylesCatalog from './view.scss';
class SmallGridView extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {

		};
	}

	render() {
		const { products } = this.props;
		return (
			<div className={stylesCatalog.cardContainer}>
				{products.map((product, index) => {
					return (
						<Card.CatalogSmall
							key={index}
							images={product.images}
							pricing={product.pricing}
							linkToPdp={product.url}
						/>
					);
				})}
			</div>
		);
	}
}

export default SmallGridView;