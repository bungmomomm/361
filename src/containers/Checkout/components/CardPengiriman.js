import React, { Component } from 'react';
import Icon from '@/components/Icon';

// component load
import { 
	Level, 
	InputGroup, 
	Select,  
	Button, 
	Tabs,
	Alert,
	Box
} from '@/components/Base';

import Dropshipper from './Dropshipper';

// Dummy Data
import { Address, ElockerList } from '@/data';

export default class CardPengiriman extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}
	
	render() {
		return (
			<Tabs tabActive={0} stretch>
				<Tabs.Panel title='Kirim ke Alamat' sprites='truck-off' spritesActive='truck-on'>
					<Alert align='center' color='yellow' close>
						Gratis ongkos kirim hingga Rp 15,000 untuk minimal pembelian sebesar Rp 100,000
					</Alert>
					<Box>
						<InputGroup>
							<Select filter selectedLabel='-- Pilih Alamat Lainnya' options={Address} />
						</InputGroup>
						<Level>
							<Level.Left><strong>Rumah Bangka</strong></Level.Left>
							<Level.Right className='text-right'><Icon name='map-marker' /> &nbsp; Lokasi Sudah Ditandai</Level.Right>
						</Level>
						<p>
							Aufar Syahdan <br />
							The Residence B10 - 9 <br />
							Jl. Bangka II, Mampang Prapatan, Jakarta Selatan, DKI Jakarta 12720 <br />
							P: 08568052187
						</p> 
						<Button type='button' icon='pencil' iconPosition='left' className='font-orange' content='Ubah Alamat ini' />
					</Box>
					<Dropshipper />
					<Button content='Masukan Alamat Pengiriman' color='dark' block size='large' iconPosition='right' icon='angle-right' />
				</Tabs.Panel>
				<Tabs.Panel title='Ambil Di Toko/E-locker (O2O)' sprites='o2o-off' spritesActive='o2o-on'>
					<Alert align='center' color='yellow'>
						Maksimum 2 kg perorder untuk Ambil di Toko. Pesanan diatas 2 kg akan langsung dikirimkan ke Alamat Anda.
					</Alert>
					<Box>
						<InputGroup>
							<Select filter selectedLabel='-- Pilih Alamat E-Locker' options={ElockerList} />
						</InputGroup>
						<Level>
							<Level.Left><strong>E-Locker Family Mart Kelapa Gading &nbsp; <Icon name='map-marker' /></strong></Level.Left>
						</Level>
						<p>
							Family Mart Kelapa Gading Lt.2 <br />
							Jl. Boulevard Barat Blok XC No.7 <br />
							Kelapa Gading, Jakarta Utara 12420 <br />
							Telp:
						</p>
					</Box>
					<p className='font-red'>Satu atau lebih produk dalam keranjang belanja anda tidak menyediakan layanan Ambil di Toko / Elocker (O2O)</p>
				</Tabs.Panel>
			</Tabs>
		);
	}
};