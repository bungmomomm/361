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

	triggerEvent(target, type) {
		const doc = window.document;
		if (doc.createEvent) {
			const event = doc.createEvent('HTMLEvents');
			event.initEvent(type, true, true);
			target.dispatchEvent(event);
		} else {
			const event = doc.createEventObject();
			target.fireEvent(`on${type}`, event);
		}
		return this;
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
				onLoad={() => this.triggerEvent(window, 'resize')}
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
