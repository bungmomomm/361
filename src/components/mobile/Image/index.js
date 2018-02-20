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
			const body = window.document.getElementsByTagName('body')[0];
			body.addEventListener('scroll', this.onBodyScroll);
		}
	}

	componentDidUpdate() {
		if (!this.props.lazyload) {
			const body = window.document.getElementsByTagName('body')[0];
			body.removeEventListener('scroll', this.onBodyScroll);
		}
	}

	componentWillUnmount() {
		const body = window.document.getElementsByTagName('body')[0];
		body.removeEventListener('scroll', this.onBodyScroll);
	}

	onBodyScroll() {
		if (this.props.lazyload && !this.state.loaded) {
			const viewportH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			const imgOffset = this.imgRef.getBoundingClientRect();
			const isVisible = viewportH >= imgOffset.top;
			if (isVisible) {
				this.setState({ loaded: true });
			}
		}
	}

	onLoad() {
		this.triggerEvent(window, 'resize');
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

	src() {
		let image = this.props.src;
		if (this.props.local) {
			image = require(`@/assets/images/${this.props.src}`);
		}
		if (this.props.lazyload && !this.state.loaded) {
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
		const createClassName = classNames([
			this.props.avatar ? styles.avatar : null
		]);

		return (
			<img
				ref={(imgRef) => { this.imgRef = imgRef; }}
				onLoad={this.onLoad}
				style={this.props.style}
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
