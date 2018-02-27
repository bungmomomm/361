import React, { Component } from 'react';
import Svg from '../Svg';
import Button from '../Button';
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
		const { hideFooter } = this.props;
		return (
			<div className={styles.container}>
				<div className={styles.page} ref={(n) => { this.node = n; }}>
					{this.props.children}
				</div>
				{!hideFooter && (
					<div>
						<div style={{ backgroundColor: '#D8D8D8' }}>
							<div className='flex-row flex-middle flex-center margin--medium'>
								<div className='padding--medium'>BUTUH BANTUAN ? HUBUNGI KAMI</div>
								<Svg src='ico_chevron-right.svg' />
							</div>
						</div>
						<div style={{ backgroundColor: '#EBEBEB' }}>
							<div className='flex-middle flex-center padding--large text-center'>
								<div className='margin--medium'>
									<Button outline color='white' size='medium'>
										<div className='flex-row flex-center flex-middle'>
											<Svg src='ico_newstore.svg' />
											<span className='padding--small'>JUALAN AJA</span>
										</div>
									</Button>
								</div>
								<p className='font-small'>MatahariMall.com adalah situs belanja online No. #1 dan terbesar di Indonesia. Kami memberikan fasilitas pelayanan yang terbaik untuk mendukung Anda belanja online dengan aman, nyaman dan terpercaya. MatahariMall.com menawarkan beragam kemudahan untuk bertransaksi, seperti transfer antar bank, kartu kredit dengan cicilan 0%, O2O (Online-to-Offline), COD (Cash On Delivery), dan metode lainnya.</p>
								<div className='margin--medium'>
									[social media]
								</div>
								<p className='font-small'>Belanja lebih mudah unduh aplikasinya sekarang</p>
								<div className='margin--medium'>
									[mobile apps media]
								</div>
							</div>
							<div className='border-top text-center padding--medium'>
								<div className='margin--small font-color--primary-ext-2 font-small'>
									<span className='margin--small'>©PT Solusi Ecommerce Global</span>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
};

export default Page;
