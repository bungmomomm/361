import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { Page, Navigation, Svg, List, Level, Image, Panel } from '@/components/mobile';

class UserProfileEditOVO extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		return (
			<div>
				<Page>
					<Level>
						<Level.Left>
							<Link to='/profile-edit'><Svg src='ico_arrow-back-left.svg' /></Link>
						</Level.Left>
						<Level.Right>
							<Svg src='ico_setting.svg' />
						</Level.Right>
					</Level>
					<Link to='/profileEdit'>
						<Level>
							<Level.Left>
								<Image width={60} height={60} local avatar src='temp/thumb-2.jpg' alt='Rocky Syahputra' />
							</Level.Left>
							<Level.Item style={{ justifyContent: 'center', padding: '10px', color: '#191919' }}>
								<div style={{ fontWeight: 'bold', fontSize: '15px' }}>Rocky Syahputra</div>
								<div style={{ fontSize: '11px', color: '#A4A4A4' }}>Lihat informasi akun</div>
							</Level.Item>
							<Level.Right style={{ justifyContent: 'center' }}>
								<Svg src='ico_chevron-right.svg' />
							</Level.Right>
						</Level>
					</Link>
					<Panel>Account</Panel>
					<Link to='/'>
						<Level style={{ padding: '0 0 0 15px' }}>
							<Level.Left style={{ alignSelf: 'center' }}>
								<Svg src='ico_order.svg' />
							</Level.Left>
							<Level.Item>
								<List>
									<List.Content style={{ minHeight: '50px' }}>
										Pesanan
									</List.Content>
								</List>
							</Level.Item>
						</Level>
					</Link>
					<Link to='/'>
						<Level style={{ padding: '0 0 0 15px' }}>
							<Level.Left style={{ alignSelf: 'center' }}>
								<Svg src='ico_rating.svg' />
							</Level.Left>
							<Level.Item>
								<List>
									<List.Content style={{ minHeight: '50px' }}>
										Ulasan
									</List.Content>
								</List>
							</Level.Item>
						</Level>
					</Link>
					<Link to='/'>
						<Level style={{ padding: '0 0 0 15px' }}>
							<Level.Left style={{ alignSelf: 'center' }}>
								<Svg src='ico_cc.svg' />
							</Level.Left>
							<Level.Item>
								<List>
									<List.Content style={{ minHeight: '50px' }}>
										Daftar Kartu Kredit/Debit
									</List.Content>
								</List>
							</Level.Item>
						</Level>
					</Link>
					<Link to='/'>
						<Level style={{ padding: '0 0 0 15px' }}>
							<Level.Left style={{ alignSelf: 'center' }}>
								<Svg src='ico_address.svg' />
							</Level.Left>
							<Level.Item>
								<List>
									<List.Content style={{ minHeight: '50px' }}>
										Buku Alamat
									</List.Content>
								</List>
							</Level.Item>
						</Level>
					</Link>
					<Panel>More</Panel>
					<Link to='/'>
						<Level style={{ padding: '0 0 0 15px' }}>
							<Level.Left style={{ alignSelf: 'center' }}>
								<Svg src='ico_help.svg' />
							</Level.Left>
							<Level.Item>
								<List>
									<List.Content style={{ minHeight: '50px' }}>
										Bantuan
									</List.Content>
								</List>
							</Level.Item>
						</Level>
					</Link>
					<Link to='/'>
						<Level style={{ padding: '0 0 0 15px' }}>
							<Level.Left style={{ alignSelf: 'center' }}>
								<Svg src='ico_contact.svg' />
							</Level.Left>
							<Level.Item>
								<List>
									<List.Content style={{ minHeight: '50px' }}>
										Hubungi Kami
									</List.Content>
								</List>
							</Level.Item>
						</Level>
					</Link>
					<Link to='/'>
						<Level style={{ padding: '0 0 0 15px', minHeight: '80px' }}>
							<Level.Left style={{ alignSelf: 'center' }}>
								<Svg src='ico_logout.svg' />
							</Level.Left>
							<Level.Item style={{ color: '#FF3939', justifyContent: 'center', padding: '0 0 0 10px' }}>
								Logout
							</Level.Item>
						</Level>
					</Link>
				</Page>
				<Navigation active='Profile' />
			</div>
		);
	}
}

UserProfileEditOVO.defaultProps = {};

export default withCookies(UserProfileEditOVO);
