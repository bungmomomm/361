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
		return <SVGInline svg={this.image} />;
	}
}