import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './image.scss';

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
		const createClassName = classNames(
			{
				'--lazy-load': this.props.lazyload,
				[styles.avatar]: this.props.avatar
			}
		);

		return (
			<img  
				style={this.props.style}
				className={createClassName}
				height={this.props.height}
				width={this.props.width}
				src={this.image()} 
				data-src={this.dataSrc()} 
				alt={this.props.alt || ''} 
			/>
		);
	}
}

export default Image;
