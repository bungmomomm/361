import React, { PureComponent } from 'react';

class Image extends PureComponent {
	image() {
		let image = this.props.src;
		if (this.props.local) {
			image = require(`@/assets/images/${this.props.src}`);
		}
		if (this.props.lazyload) {
			image = require('@/assets/images/Loading_icon.gif');
		}
		return image;
	}

	dataSrc() {
		let image = this.props.src;

		if (this.props.lazyload && this.props.local) {
			image = require(`@/assets/images/${this.props.src}`);
			return image;
		}
		return image;
	}

	render() {

		return (
			<img className={this.props.lazyload && '--lazy-load'} src={this.image()} data-src={this.dataSrc()} alt={this.props.alt || ''} />
		);
	}
}

export default Image;
