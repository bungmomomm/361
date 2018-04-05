import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';

import xhandler from '@/containers/Mobile/Shared/handler';
import { urlBuilder } from '@/utils';
import { Card } from '@/components/mobile';

@xhandler
class LovedItemsSingle extends Component {

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
			return (<Card.Lovelist
				key={idx}
				data={product}
				isLoved={isLoved}
				onBtnLovelistClick={this.props.onIconLoveClick}
				linkToPdp={urlBuilder.buildPdp(product.product_title, product.id)}
				linkToComments={urlBuilder.buildPcpCommentUrl(product.id)}
				lovelistDisabled={loading}
			/>);
		});
	}

	render() {
		console.log('rendering lovelist single');
		const { cardContainerStyles } = this.props;
		return <div className={cardContainerStyles}>{this.renderCard()}</div>;
	}
};

export default withCookies(connect()(LovedItemsSingle));