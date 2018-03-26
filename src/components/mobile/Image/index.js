import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './image.scss';

class Image extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false
		};
		this.onLoad = this.onLoad.bind(this);
		this.onBodyScroll = this.onBodyScroll.bind(this);
	}

	componentDidMount() {
		if (this.props.lazyload) {
			// Bind scroll when element added
			const body = window.document.getElementsByTagName('body')[0];
			body.addEventListener('scroll', this.onBodyScroll);
			if (!this.state.loaded) {
				// Fix for lazyload
				this.checkVisibility();
			}
		}
	}

	componentDidUpdate() {
		// Remove scroll bind when lazyload props removed
		if (!this.props.lazyload) {
			const body = window.document.getElementsByTagName('body')[0];
			body.removeEventListener('scroll', this.onBodyScroll);
		}
	}

	componentWillUnmount() {
		// Remove scroll bind when element removed
		const body = window.document.getElementsByTagName('body')[0];
		body.removeEventListener('scroll', this.onBodyScroll);
	}

	onBodyScroll() {
		this.checkVisibility();
	}

	onLoad() {
		// Fix for carousel issue
		this.triggerEvent(window, 'resize');
		this.imgRef.parentElement.style.backgroundColor = '#ffffff';
		this.forceUpdate();
	}

	checkVisibility() {
		// If element is visible load image
		const viewportH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		const viewportOffset = 0; // Debug only
		const imgOffset = this.imgRef.getBoundingClientRect();
		const isVisible = imgOffset.top <= (viewportH + viewportOffset);
		if (this.props.lazyload && !this.state.loaded && isVisible) {
			this.setState({ loaded: true });
			const body = window.document.getElementsByTagName('body')[0];
			body.removeEventListener('scroll', this.onBodyScroll);
		}
	}

	// Cross compatibility javascript event emitter
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

	src() {
		let image = this.props.src;
		if (this.props.local) {
			image = require(`@/assets/images/${this.props.src}`);
		}
		// if (this.props.lazyload && !this.state.loaded) {
		// 	image = require('@/assets/images/Loading_icon.gif');
		// }
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
		const createClassName = classNames([
			this.props.avatar ? styles.avatar : null,
			this.props.shape ? styles[this.props.shape] : null,
			this.props.className ? this.props.className : null
		]);

		// Use background for square image
		let imgStyle = this.props.style ? this.props.style : {};
		const backgroundImage = { backgroundImage: this.props.shape === 'square' ? `url(${this.src()})` : 'none' };
		imgStyle = Object.assign(imgStyle, backgroundImage);

		return (
			<img
				ref={(imgRef) => { this.imgRef = imgRef; }}
				onLoad={this.onLoad}
				style={imgStyle}
				className={createClassName}
				height={this.props.height}
				width={this.props.width}
				src={this.src()}
				data-src={this.dataSrc()}
				alt={this.props.alt || ''}
			/>
		);
	}
}

export default Image;
