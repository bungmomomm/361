import React from 'react';
import { currency } from '@/utils';
import {
	Level,
	Stepper,
	Icon,
} from 'mm-ui';
import styles from './StoreBoxBody.scss';

const StoreBoxBody = ({ products, onUpdateQty, showBtnDelete }) => {
	return (
		<div>
			{
				products.map((product, idx) => (
					<div key={idx} className={styles.productList}>
						<Level>
							<Level.Left>
								<img src={product.image} width={50} height={50} alt={product.name} />
								{
									showBtnDelete && 
									<div 
										role='button'
										tabIndex={-1}
										className='font-grey'
										onClick={() => onUpdateQty(0, product.id)} 
									>
										<Icon name='trash-o' /> Hapus
									</div>
								}
							</Level.Left>
							<Level.Item style={{ paddingLeft: '20px' }}>
								<div style={{ marginBottom: '10px' }}>{product.name}</div>
								<Level style={{ marginBottom: '10px' }}>
									<Level.Left><strong>{currency(product.price)}</strong></Level.Left>
									<Level.Right>
										<Stepper max={product.maxQty} min={1} start={product.qty} defaultValue={product.qty} value={product.qty} onChange={(e) => onUpdateQty(e, product.id)} />
									</Level.Right>
								</Level>
								<div>
									{product.attribute.map((list, iList) => (
										<div key={iList}><em>{list}</em></div>
									))}
								</div>
							</Level.Item>
						</Level>
					</div>
				))
			}
		</div>
	);
};

export default StoreBoxBody;