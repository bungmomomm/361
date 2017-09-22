import React, { Component } from 'react';
import { 
	Card,
	Level,
	InputGroup,
	Button,
	Input
} from '@/components';
import styles from '../../../Mobile/mobile.scss';

import { currency } from '@/utils';

export default class StepThree extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}
	
	render() {
		return (
			<Card>
				<p><strong>3. Rincian Pembayaran</strong></p>
				<Level>
					<Level.Left><strong>Subtotal</strong></Level.Left>
					<Level.Right className='text-right'><strong>{currency(100000)}</strong></Level.Right>
				</Level>
				<Level>
					<Level.Left>Voucher : <strong>MM20HM</strong> &nbsp; <Button icon='times-circle' iconPosition='right' /></Level.Left>
					<Level.Right className='text-right'>&nbsp;</Level.Right>
				</Level>
				<Level>
					<Level.Left>Total Biaya Pengiriman</Level.Left>
					<Level.Right className='text-right'>{currency(15000)}</Level.Right>
				</Level>
				<Level>
					<Level.Left>
						<div className='font-green'>Discount Biaya Pengiriman</div>
					</Level.Left>
					<Level.Right>
						<div className='font-green text-right'>{currency(-10000)}</div>
					</Level.Right>
				</Level>
				<Level>
					<Level.Left className={styles.voucherLabel}>Kode Voucher</Level.Left>
					<Level.Right>
						<InputGroup addons>
							<Input size='small' name='voucherCode' color='green' />
							<Button type='submit' size='small' color='green' content='CEK' />
						</InputGroup>
					</Level.Right>
				</Level>
				<div className={styles.CheckoutTitle}>
					<Level noMargin>
						<Level.Left>Total Pembayaran</Level.Left>
						<Level.Right>
							<div className={`${styles.price} text-right`}>{currency(1500000)}</div>
						</Level.Right>
					</Level>
				</div>
			</Card>

		);
	}
}