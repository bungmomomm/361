import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Image extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	get image() {
		return require(`../../assets/images/${this.props.src}`);
	}

	render() {
		return (
			<img alt={this.props.alt} width={this.props.width} height={this.props.height} src={this.image} />
		);
	}
};

Image.propTypes = {
	src: PropTypes.string.isRequired
};