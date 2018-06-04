import React from 'react';
import { Link } from 'react-router-dom';
import { Svg } from '@/components/mobile';

const footer = (props) => {
	// console.log(typeof _.toBoolean(props.isShow));
	const { isShow } = props;

	// const UA = navigator.userAgent;
	// const isAndroid = UA.match(/Android/i) || UA.match(/webOS/i);

	if (!isShow) return null;
	
	return (
		<div>
			<div style={{ backgroundColor: '#111111' }}>
				<Link to='/bantuan'>
					<div className='flex-row flex-middle flex-center margin--medium-v'>
						<div className='padding--medium-h'>BUTUH BANTUAN ? HUBUNGI KAMI</div>
						<Svg src='ico_chevron-right.svg' />
					</div>
				</Link>
			</div>
			<div style={{ backgroundColor: '#111111' }}>
				<div className='flex-middle padding--large-h'>
					<div className='margin--medium-v'>
						<h3 className='font-color--white'>Infomarsi</h3>
						<p>National Service Hotline : <br /> +62 21 2911 0133</p>
						<p>Alamat : <br />
							Gedung Lippo Kuningan, lantai 22
							Jln H. R. Rasuna Said Kav B-12, Setiabudi,
							RT.6/RW.7,
							Kota Jakarta Selatan.</p>
					</div>
					<div className='margin--medium-v'>
						<h3 className='font-color--white'>Tentang 361</h3>
						<p>National Service Hotline : <br /> +62 21 2911 0133</p>
						<p>Alamat : <br />
							Gedung Lippo Kuningan, lantai 22
							Jln H. R. Rasuna Said Kav B-12, Setiabudi,
							RT.6/RW.7,
							Kota Jakarta Selatan.</p>
					</div>
					<div className='margin--medium-v'>
						<h3 className='font-color--white'>Bantuan</h3>
						<p>National Service Hotline : <br />+62 21 2911 0133</p>
						<p>Alamat : <br />
							Gedung Lippo Kuningan, lantai 22
							Jln H. R. Rasuna Said Kav B-12, Setiabudi,
							RT.6/RW.7,
							Kota Jakarta Selatan.</p>
					</div>
				</div>
				<hr />
				<div className='border-top text-center padding--medium-h'>
					<div className='margin--small-v font-color--primary-ext-2 font-small'>
						<span className='margin--small-v'>©2018, 361 Degrees</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default footer;
