import React, { Component } from 'react';
import styles from './page.scss';
import _ from 'lodash';

class Page extends Component {
	constructor(props) {
		super(props);
		this.handleScroll = this.handleScroll.bind(this);
	}

	componentDidMount() {
		this.windowHeight = window.innerHeight;
		this.attemp = 0;
		setTimeout(() => {
			this.getImage();
		}, 100);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll, true);
	}

	getImage() {
		this.lazyImageList = [];
		const imageList = document.getElementsByClassName('--lazy-load');
		if (imageList.length > 0) {
			window.addEventListener('scroll', this.handleScroll, true);
			for (let index = 0; index < imageList.length; index++) {
				this.lazyImageList.push({
					el: imageList[index],
					offsetTop: imageList[index].getBoundingClientRect().top,
					shown: false
				});
			}
			this.filteredLazyImage = this.lazyImageList;
		}
	}

	handleScroll(e) {
		if (this.filteredLazyImage.length > 0) {
			this.filteredLazyImage = _.filter(this.filteredLazyImage, (list) => {
				if (!list.shown && (list.offsetTop - (this.windowHeight)) <= e.target.scrollTop) {
					list.el.classList.remove('--lazy-load');
					list.el.src = list.el.getAttribute('data-src');
					list.shown = true;
					return null;
				}
				return list;
			});
			// get Image to make sure image list get updatePosition
			this.getImage();
		}
	}

	render() {
		return (
			<div className={styles.container}>
				<div className={styles.page} ref={(n) => { this.node = n; }}>
					{this.props.children}
				</div>
			</div>
		);
	}
};

export default Page;
