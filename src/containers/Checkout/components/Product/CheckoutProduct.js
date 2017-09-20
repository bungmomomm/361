import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CheckoutProduct.scss';
import { Button, Figure, Stepper } from '@/components';

import { currency, renderIf } from '@/utils';
import { pushDataLayer } from '@/utils/gtm';

export default class CheckoutProduct extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.onDeleteCart = this.onDeleteCart.bind(this);
		this.onUpdateQty = this.onUpdateQty.bind(this);
		this.pushDataLayer = this.pushDataLayer.bind(this);
	}
	onDeleteCart() {
		this.props.onDeleteCart(this.props);
		this.pushDataLayer('removeFromCart', 'remove', this.props.data.qty);
	}
	onUpdateQty(state) {
		if (parseInt(state.value, 10) > 0 && parseInt(state.value, 10) !== this.props.data.qty) {
			this.props.onUpdateQty(state.value, this.props.data.id);
			if (state.value > this.props.data.qty) {
				this.pushDataLayer('addToCart', 'add', state.value - this.props.data.qty, 'IDR');
			} else {
				this.pushDataLayer('removeFromCart', 'remove', this.props.data.qty - state.value);
			}
		}
	}
	pushDataLayer(event, ecommerceEvent, qty, currencyCode = null) {
		const products = [
			{
				id: this.props.data.id,
				name: this.props.data.name,
				price: this.props.data.price,
				brand: this.props.data.brand,
				category: this.props.data.category,
				variant: '',
				qty
			}
		];
		pushDataLayer(event, ecommerceEvent, null, products, currencyCode);
	}
	render() {
		return (
			<div className={styles.list}>
				<div className={styles.body}>
					<div className={styles.bodyLeft}>
						<Figure 
							src={this.props.data.image}
							width={50}
							height={50}
							alt={this.props.data.name}
						/>
					</div>
					<div className={styles.bodyRight}>
						<div className={styles.title}>{this.props.data.name}</div>
						<div className={styles.option}>
							<div className={styles.price}>{currency(this.props.data.price)}</div>
							<div className={styles.qty}>
								{
									renderIf(this.props.data.qty)(
										<Stepper size='small' value={this.props.data.qty} maxValue={this.props.data.maxQty} onChange={this.onUpdateQty} />
									)
								}
							</div>
						</div>
					</div>
				</div>
				<div className={styles.body}>
					<div className={styles.bodyLeft}>
						{
							!this.props.showBtnDelete ? <Button /> :
							<Button clean size='small' icon='trash-o' iconPosition='left' content='Hapus' onClick={this.onDeleteCart} />
						}
					</div>
					<div className={styles.bodyRight}>
						{/* <div><strong>Keterangan:</strong></div> */}
						{
							this.props.data.attribute.map((list, i) => (
								<div key={i}><em>{list}</em></div>
							))
						}
					</div>
				</div>
				{
					!this.props.restrictO2o ? null :
					<div className={styles.body}>
						<p className='font-red'>Penjual tidak menyediakan layanan o2o</p>
					</div>
				}
			</div>
		);
	}
};

CheckoutProduct.propTypes = {
	data: PropTypes.object.isRequired
};