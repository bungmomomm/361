import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { Page, Header, Svg, Panel, Image, Select, Level, Button, Modal } from '@/components/mobile';
import styles from './cart.scss';

class Cart extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			showSelect: false,
			showConfirmDelete: false,
			selected: {
				label: null,
				value: null
			}
		};
	}

	renderList() {
		return (
			<div style={{ paddingLeft: '15px', paddingTop: '15px', marginBottom: '20px', background: '#fff' }}>
				<div>BitterBallenBall</div>
				<Level style={{ paddingLeft: '0px' }} className='flex-row border-bottom'>
					<Level.Item><Image width='100%' src='https://www.wowkeren.com/images/events/ori/2015/03/26/minah-album-i-am-a-woman-too-01.jpg' /></Level.Item>
					<Level.Item className='padding--medium'>
						<div>HeavyWater </div>
						<div className='font-color--primary-ext-1'>Holy shoes brown egg </div>
						<div className='margin--medium'>
							<div>Rp3.890.000</div>
							<div className='font-color--primary-ext-1 font-small text-line-through'>Rp900.900</div>
						</div>
						<Level className='flex-row border-bottom'>
							<Level.Item>
								<Button onClick={() => this.setState({ showSelect: !this.state.showSelect })} className='flex-center'><span style={{ marginRight: '10px' }}>{this.state.selected.label || 'M'}</span> <Svg src='ico_chevron-down.svg' /></Button>
							</Level.Item>
							<Level.Item>
								<Button onClick={() => this.setState({ showSelect: !this.state.showSelect })} className='flex-center'><span style={{ marginRight: '10px' }}>{this.state.selected.label || 'M'}</span> <Svg src='ico_chevron-down.svg' /></Button>
							</Level.Item>
						</Level>
						<div className='margin--medium font-medium'>Rp3.890.000</div>
					</Level.Item>
				</Level>
				<div className='flex-row flex-center flex-spaceBetween margin--medium'>
					<div><Button outline color='secondary' size='medium'><Svg src='ico_reply.svg' /> &nbsp; Pindahkan ke Lovelist</Button></div>
					<div className='padding--large'><Button onClick={() => this.setState({ showConfirmDelete: true })} className='font-color--primary-ext-1'><Svg src='ico_trash.svg' /> &nbsp; Hapus</Button></div>
				</div>
			</div>
		);
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
			<div>
				<Page>
					<div style={{ backgroundColor: '#F5F5F5' }}>
						<Panel className='flex-row flex-spaceBetween'>
							<div className='flex-row'><span className='font-color--primary'>Total:</span> <span className='padding--medium'>2 ITEM(S)</span></div>
							<div className='font-medium font-color--primary'>Rp6.000.000</div>
						</Panel>
						{this.renderList()}
						{this.renderList()}
						{this.renderList()}
						{this.renderList()}
						<div className='padding--medium' style={{ backgroundColor: '#fff' }}>
							<div className='margin--medium'>
								<div className='flex-row flex-spaceBetween'>
									<div>Subtotal</div>
									<div className='font-medium'>Rp2.600.000</div>
								</div>
								<div className='flex-row flex-spaceBetween'>
									<div>
										<div>Estimasi biaya pengiriman</div>
										<div className='font-small'>(Jakarta)</div>
									</div>
									<div className='font-medium'>Rp19.000</div>
								</div>
								<hr className='margin--medium' />
								<div className='flex-row flex-spaceBetween'>
									<div>
										<div>Total Pembayaran</div>
										<div className='font-color--primary-ext-1 font-small'>(Termasuk PPN)</div>
									</div>
									<div className='font-medium'>Rp2.619.000</div>
								</div>
							</div>
						</div>
					</div>
				</Page>
				<Header.Modal {...headerOption} />
				<div className={styles.paymentLink}>
					<div>
						<div>
							<Link to='/'>Lanjutkan ke Pembayaran <Svg color='#fff' src='ico_arrow-back.svg' /></Link>
						</div>	
					</div>
				</div>
				<Select
					show={this.state.showSelect}
					label='Pilih Ukuran'
					onChange={(e) => this.setState({ selected: e })}
					onClose={() => this.setState({ showSelect: false })}
					options={[
						{ value: 1, label: '1', disabled: true, note: 'Stock Habis' },
						{ value: 2, label: '2' },
						{ value: 3, label: '3' },
						{ value: 4, label: '4' },
						{ value: 5, label: '5' },
						{ value: 6, label: '6' }
					]}
				/>
				<Modal show={this.state.showConfirmDelete}>
					<div className='font-medium'>Anda mau menghapus produk ini?</div>
					<Level style={{ padding: '0px' }} className='margin--medium'>
						<Level.Left><Image width='40px' src='https://www.wowkeren.com/images/events/ori/2015/03/26/minah-album-i-am-a-woman-too-01.jpg' /></Level.Left>
						<Level.Item className='padding--medium'>
							<div className='font-small'>IMMACULATE</div>
							<div className='font-small font-color--primary-ext-1'>Olivia Von Halle pink print</div>
						</Level.Item>
					</Level>
					<Modal.Action 
						closeButton={<Button onClick={() => this.setState({ showConfirmDelete: false })}>BATAL</Button>}
						confirmButton={<Button><span className='font-color--primary-ext-2'>HAPUS</span></Button>}
					/>
				</Modal>
			</div>
		);
	}
}


export default withCookies(Cart);
