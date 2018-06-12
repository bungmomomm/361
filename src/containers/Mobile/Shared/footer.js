import React from 'react';
import { Link } from 'react-router-dom';
import {
	Image, Svg, Button, Input
} from '@/components/mobile';

const footer = (props) => {
	// console.log(typeof _.toBoolean(props.isShow));
	const { isShow } = props;

	// const UA = navigator.userAgent;
	// const isAndroid = UA.match(/Android/i) || UA.match(/webOS/i);

	if (!isShow) return null;
	
	return (
		<div className='padding--medium-v' style={{ backgroundColor: '#111111' }}>
			<div className='container'>
				<div className='row'>
					<div className='margin--medium-v col-xs-12 col-sm-12 col-md-4 col-lg-4'>
						<h4 className='font-color--white'>Infomarsi</h4>
						<p>National Service Hotline : <br /> +62 21 2911 0133</p>
						<p>Alamat : <br />
							Gedung Lippo Kuningan, lantai 22 <br />
							Jln H. R. Rasuna Said Kav B-12, Setiabudi,
							RT.6/RW.7,
							Kota Jakarta Selatan.</p>
					</div>
					<div className='margin--medium-v col-xs-12 col-sm-12 col-md-3 col-lg-3'>
						<h4 className='font-color--white'>Tentang 361</h4>
						<Link to='/bantuan' className='font-color--primary'>
							Tentang 361
						</Link>
						<Link to='/bantuan' className='font-color--primary'>
							Hubungi Kami
						</Link>
						<h4 className='font-color--white margin--large-t'>Bantuan</h4>
						<Link to='/bantuan' className='font-color--primary'>
							Panduan Berbelanja
						</Link>
						<Link to='/bantuan' className='font-color--primary'>
							Metode Pembayaran
						</Link>
					</div>
					<div className='margin--medium-v col-xs-12 col-sm-12 col-md-5 col-lg-5'>
						<h4 className='font-color--white'>Berlangganan Newsletter</h4>
						<div className='row row-small'>
							<div className='col-xs-12 col-md-6 col-lg-6'>
								<Input
									placeholder='Masukkan email'
									value=''
									color='primary'
								/>
							</div>
							<div className='col-xs-6 col-md-3 col-lg-3'>
								<Button color='primary' size='large' >Pria</Button>
							</div>
							<div className='col-xs-6 col-md-3 col-lg-3'>
								<Button color='primary' size='large' >Wanita</Button>
							</div>
						</div>
						<h4 className='font-color--white margin--large-t'>Ikuti Kami</h4>
						<div className='flex-row margin--normal-v'>
							<div>
								<Link to='https://www.facebook.com/mataharimallcom/'>
									<Svg src='ico_facebook_361.svg' />
								</Link>
							</div>
							<div>
								<Link to='https://www.instagram.com/mataharimallcom/'>
									<Svg src='ico_instagram_361.svg' />
								</Link>
							</div>
						</div>
					</div>
				</div>
				<div className='border-top text-center padding--medium-h'>
					<div className='margin--large-t margin--normal-b text-center'>
						<Image local src='payment-method.png' />
					</div>
					<div className='margin--small-v font-color--primary'>
						<span className='margin--small-v'>©2018, 361 Degrees</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default footer;
