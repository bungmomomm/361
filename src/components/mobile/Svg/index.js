import React, { Component } from 'react';
import SVGInline from 'react-svg-inline';

export default class Svg extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	get image() {
		return require(`@/assets/svg/mobile/${this.props.src}`);
	}

	render() {
		const cleanup = ['title', 'desc', 'comment', 'sketchMSShapeGroup', 'sketchMSPage', 'sketchMSLayerGroup'];
		return <SVGInline svg={this.image} cleanup={cleanup} width={this.props.width} height={this.props.height} />
	}
}
