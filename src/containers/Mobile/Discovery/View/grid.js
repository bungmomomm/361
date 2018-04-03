import React, { Component } from 'react';
import {
	Card,
	Carousel,
	Grid
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

	productCardRender(product, index, carousel = false) {
		const { productOnClick } = this.props;

		const setStyle = () => {
			if (carousel) {
				return { width: '100%' };
			}
			return null;
		};

		return (
			<Card.CatalogGrid
				key={index}
				style={{ ...setStyle() }}
				images={product.images}
				productTitle={product.product_title}
				brandName={product.brand.name}
				pricing={product.pricing}
				linkToPdp={product.url}
				productOnClick={productOnClick ? () => productOnClick(product, index + 1) : () => true}
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
	}

	render() {
		const { carousel, products } = this.props;

		if (carousel) {
			return (
				<Carousel slidesToShow={2}>
					{products.map((product, index) => {
						return (
							<Grid split={2} key={index} className={stylesCatalog.cardGrid}>
								{this.productCardRender(product, index, carousel)}
							</Grid>
						);
					})}
				</Carousel>
			);
		}

		return (
			<div className={stylesCatalog.cardContainer}>
				{products.map((product, index) => {
					return (
						this.productCardRender(product, index)
					);
				})}
			</div>
		);
	}
}

export default GridView;
