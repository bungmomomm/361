import React from 'react';
// import _ from 'lodash';
import { Svg, Button } from '@/components/mobile';

const footer = (props) => {
	// console.log(typeof _.toBoolean(props.isShow));
	const { isShow } = props;

	if (!isShow) return null;

	return (
		<div>
			<div style={{ backgroundColor: '#D8D8D8' }}>
				<div className='flex-row flex-middle flex-center margin--medium-v'>
					<div className='padding--medium-h'>BUTUH BANTUAN ? HUBUNGI KAMI</div>
					<Svg src='ico_chevron-right.svg' />
				</div>
			</div>
			<div style={{ backgroundColor: '#EBEBEB' }}>
				<div className='flex-middle flex-center padding--large-h text-center'>
					<div className='margin--medium-v'>
						<Button outline color='white' size='medium'>
							<div className='flex-row flex-center flex-middle'>
								<Svg src='ico_newstore.svg' />
								<span className='padding--small-h'>JUALAN AJA</span>
							</div>
						</Button>
					</div>
					<p className='font-small'>MatahariMall.com adalah situs belanja online No. #1 dan terbesar di Indonesia. Kami memberikan fasilitas pelayanan yang terbaik untuk mendukung Anda belanja online dengan aman, nyaman dan terpercaya. MatahariMall.com menawarkan beragam kemudahan untuk bertransaksi, seperti transfer antar bank, kartu kredit dengan cicilan 0%, O2O (Online-to-Offline), COD (Cash On Delivery), dan metode lainnya.</p>
					<div className='margin--medium-v'>
						[social media]
					</div>
					<p className='font-small'>Belanja lebih mudah unduh aplikasinya sekarang</p>
					<div className='margin--medium-v'>
						[mobile apps media]
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
