import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { Page, Header, Image, Button, Svg } from '@/components/mobile';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Empty extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		const headerOption = {
			left: (
				<Link to='/'>
					<Svg src={'ico_close-large.svg'} />
				</Link>
			),
			center: 'Tas Belanja',
			right: null
		};
		return (
			<div className='full-height'>
				<Page color='white'>
					<div className='padding--medium-h text-center full-height'>
						<div className='margin--large-v'>
							<div className='font-large'>Tas Belanja Kamu Masih Kosong</div>
							<div className='margin--medium-v'>
								Butuh inspirasi gaya fashion? <br />
								Cek halaman <br />
								#MauGayaItuGampang,
							</div>
							<div className='flex-row flex-center'>
								<Link to='/mau-gaya-itu-gampang'>
									<Button color='primary' size='medium'>CEK AJA</Button>
								</Link>
							</div>
						</div>
					</div>
					<div className='flex-row flex-center' style={{ flex: 1, alignItems: 'flex-end' }}>
						<Image local src='mobile/cart-empty.jpg' />
					</div>
				</Page>
				<Header.Modal {...headerOption} />
			</div>
		);
	}
}


export default withCookies(Empty);
