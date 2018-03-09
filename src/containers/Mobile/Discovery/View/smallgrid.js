import React, { Component } from 'react';
import {
	Card,
	Spinner
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
		const { loading, products } = this.props;
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
				{loading && (
					<div style={{ margin: '20px auto 20px auto' }}><Spinner /></div>
				)}
			</div>
		);
	}
}

export default SmallGridView;