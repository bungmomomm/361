import React, { Component } from 'react';

import xhandler from '@/containers/Mobile/Shared/handler';
import { urlBuilder } from '@/utils';
import { Card } from '@/components/mobile';

@xhandler
class LovedItemsGrid extends Component {

	constructor(props) {
		super(props);
		this.props = props;
	}

	shouldComponentUpdate(nextProps) {
		const { items, loading } = nextProps;
		return ((this.props.items.list !== items.list) || this.props.loading !== loading); 
	}

	renderCard() {
		const isLoved = true;
		const { items, loading } = this.props;
		return items.list.map((product, idx) => {
			return (<Card.LovelistGrid
				key={idx}
				data={product}
				isLoved={isLoved}
				onBtnLovelistClick={this.props.onIconLoveClick}
				linkToPdp={urlBuilder.buildPdp(product.product_title, product.id)}
				linkToComments={urlBuilder.buildPcpCommentUrl(product.id)}
				lovelistDisabled={loading}
				split={2}
			/>);
		});
	}

	render() {
		console.log('rendering lovelist grid');
		const { cardContainerStyles } = this.props;
		return <div className={cardContainerStyles}>{this.renderCard()}</div>;
	}

};

export default (LovedItemsGrid);