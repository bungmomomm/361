import React from 'react';
import classNames from 'classnames';
import styles from './header.scss';
import Image from '../Image';
import Level from '../Level';
import Button from '../Button';
import Svg from '../Svg';
import { Link } from 'react-router-dom';

const ShoppingBagItem = props => {
	
	const inlineStyle = {
		display: (props.show === false) ? 'none' : 'block',
	};
	
	const shoppingBagClass = classNames(
		styles.modalOnHeader,
		styles.shoppingBagModal
	);
	
	return (
		<div className={shoppingBagClass} id='shoppingBagModal' style={inlineStyle}>
			{
				(props.data.length === 0) && (
					<div className='flex-column flex-center flex-middle text-center'>
						<Svg src='ico_bag_empty.svg' />
						<div>
							Tas belanja anda masih kosong.
						</div>
					</div>
				)
			}
			{
				(props.data.length > 0) && (
					<div>
						<h3>Tas Belanja <span>({props.data.length} Barang)</span></h3>
						{
							props.data.map(({ total, price, size, name, image }, i) => {
								return (
									<div key={i} style={{ borderBottom: '1px solid #EEEEEE' }}>
										<Level style={{ paddingLeft: '0px' }} className='flex-row'>
											<Level.Item style={{ width: '30%', flex: 'none' }}>
												<Link className='font-color--black' to={''}>
													<Image width='100%' src={image} />
												</Link>
											</Level.Item>
											<Level.Item className='padding--medium-l'>
												<div className='flex-row flex-spaceBetween'>
													<Link className='font-color--black text-uppercase' to={''}>
														{name}
													</Link>
													<Button className='font-color--primary-ext-1 margin--medium-l margin--small-r'>
														<Svg src='ico_trash.svg' />
													</Button>
												</div>
												<div className='margin--medium-t'>
													<div className='font-color--primary'>
														Ukuran: {size}
													</div>
													<div className='font-color--secondary margin--normal-v'>
														Rp {price}
													</div>
													<div className='font-color--primary-ext-1'>
														Jumlah : {total}
													</div>
												</div>
											</Level.Item>
										</Level>
									</div>
								);
							})
						}
						<div
							className='flex-row flex-spaceBetween'
							style={{
								marginBottom: '19px',
								marginTop: '20px'
							}}
						>
							<div>Subtotal</div>
							<div>Rp 745.000</div>
						</div>
						<div className='flex-column'>
							<Button color='secondary' size='large' style={{ marginBottom: '15px' }}>
								Lihat Pesanan
							</Button>
							<Button color='primary' size='large'>
								Checkout
							</Button>
						</div>
					</div>
				)
			}
		</div>
	);
};


export default ShoppingBagItem;