import React from 'react';
import { Link } from 'react-router-dom';
import { Svg, Button } from '@/components/mobile';

const footer = (props) => {
	// console.log(typeof _.toBoolean(props.isShow));
	const { isShow } = props;

	// const UA = navigator.userAgent;
	// const isAndroid = UA.match(/Android/i) || UA.match(/webOS/i);

	if (!isShow) return null;

	let isi = 'MatahariMall.com adalah situs belanja online No. #1 dan terbesar di Indonesia. Kami memberikan fasilitas pelayanan yang terbaik untuk mendukung Anda belanja online dengan aman, nyaman dan terpercaya. MatahariMall.com menawarkan beragam kemudahan untuk bertransaksi, seperti transfer antar bank, kartu kredit dengan cicilan 0%, O2O (Online-to-Offline), COD (Cash On Delivery), dan metode lainnya.';
	
	if (typeof window.meta !== 'undefined') {
		const { content	} = window.meta;
		isi = content;
	}
	
	return (
		<div>
			<div style={{ backgroundColor: '#EBEBEB' }}>
				<Link to='/bantuan'>
					<div className='flex-row flex-middle flex-center margin--medium-v'>
						<div className='padding--medium-h'>BUTUH BANTUAN ? HUBUNGI KAMI</div>
						<Svg src='ico_chevron-right.svg' />
					</div>
				</Link>
			</div>
			<div style={{ backgroundColor: '#F7F7F7' }}>
				<div className='flex-middle flex-center padding--large-h text-center'>
					<div className='margin--medium-v'>
						<Button outline color='white' size='medium'>
							<div className='flex-row flex-center flex-middle'>
								<Svg src='ico_newstore.svg' />
								<span className='padding--small-h'>JUALAN AJA</span>
							</div>
						</Button>
					</div>
					<p className='font-small' dangerouslySetInnerHTML={{ __html: isi }} />
					<div className='margin--medium-v'>
						<div className='flex-row'>
							<a className='margin--small-h' href={process.env.FB_MM} target='_blank'>
								<Svg src='ico_footer_facebook.svg' />
							</a>
							<a className='margin--small-h' href={process.env.TWITTER_MM} target='_blank'>
								<Svg src='ico_footer_twitter.svg' />
							</a>
							<a className='margin--small-h' href={process.env.INSTAGRAM_MM} target='_blank'>
								<Svg src='ico_footer_instagram.svg' />
							</a>
							<a className='margin--small-h' href={process.env.LINE_MM} target='_blank'>
								<Svg src='ico_footer_line.svg' />
							</a>
						</div>
					</div>
					<p className='font-small'>Belanja lebih mudah unduh aplikasinya sekarang</p>
					<div className='margin--medium-v'>
						<div className='flex-row'>
							<a className='margin--small-h' href={process.env.MM_PLAY_STORE}>
								<Svg src='ico_btn_playstore.svg' />
							</a>
							<a className='margin--small-h' href={process.env.MM_APP_STORE}>
								<Svg src='ico_btn_appstore.svg' />
							</a>
							
						</div>
					</div>
				</div>
				<div className='border-top text-center padding--medium-h'>
					<div className='margin--small-v font-color--primary-ext-2 font-small'>
						<span className='margin--small-v'>©PT Solusi Ecommerce Global</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default footer;
