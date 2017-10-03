import React, { Component } from 'react';
import { 
	Card,
	Level,
	InputGroup,
	Button,
	Input
} from '@/components';
import { T } from '@/data/translations';
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
				<p><strong>{T.checkout.STEP_THREE_LABEL}</strong></p>
				<Level>
					<Level.Left><strong>{T.checkout.SUB_TOTAL}</strong></Level.Left>
					<Level.Right className='text-right'><strong>{currency(100000)}</strong></Level.Right>
				</Level>
				<Level>
					<Level.Left>{T.checkout.VOUCHER} : <strong>MM20HM</strong> &nbsp; <Button icon='times-circle' iconPosition='right' /></Level.Left>
					<Level.Right className='text-right'>&nbsp;</Level.Right>
				</Level>
				<Level>
					<Level.Left>{T.checkout.TOTAL_SHIPPING_COST}</Level.Left>
					<Level.Right className='text-right'>{currency(15000)}</Level.Right>
				</Level>
				<Level>
					<Level.Left>
						<div className='font-green'>{T.checkout.DISCOUNT_SHPPING_COST}</div>
					</Level.Left>
					<Level.Right>
						<div className='font-green text-right'>{currency(-10000)}</div>
					</Level.Right>
				</Level>
				<Level>
					<Level.Left className={styles.voucherLabel}>{T.checkout.VOUCHER_CODET}</Level.Left>
					<Level.Right>
						<InputGroup addons>
							<Input size='small' name='voucherCode' color='green' />
							<Button type='submit' size='small' color='green' content={T.checkout.CHECK} />
						</InputGroup>
					</Level.Right>
				</Level>
				<div className={styles.CheckoutTitle}>
					<Level noMargin>
						<Level.Left>{T.checkout.TOTAL_PAYMENT}</Level.Left>
						<Level.Right>
							<div className={`${styles.price} text-right`}>{currency(1500000)}</div>
						</Level.Right>
					</Level>
				</div>
			</Card>

		);
	}
}