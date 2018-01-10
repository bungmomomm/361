import React from 'react';
import { currency } from '@/utils';
import {
	Level,
	Stepper,
	Icon,
} from 'mm-ui';
import styles from './StoreBoxBody.scss';
import { T } from '@/data/translations';

const StoreBoxBody = ({ products, onUpdateQty, showBtnDelete, stepOneActiveTab }) => {
	return (
		<div>
			{
				products.map((product, idx) => (
					<div key={idx} className={styles.productList}>
						<Level isMobile>
							<Level.Left>
								<img src={product.image} width={50} height={50} alt={product.name} />
								{
									showBtnDelete && 
									<div 
										role='button'
										tabIndex={-1}
										className='font-grey'
										onClick={() => onUpdateQty(0, product)}
									>
										<Icon name='trash-o' /> Hapus
									</div>
								}
							</Level.Left>
							<Level.Right style={{ paddingLeft: '20px' }}>
								<div>
									<div style={{ marginBottom: '10px' }}>{product.name}</div>
									<Level hasPadding isMobile style={{ marginBottom: '10px' }}>
										<Level.Left><strong>{currency(product.price)}</strong></Level.Left>
										<Level.Right>
											<Stepper max={product.maxQty} min={1} start={product.qty} value={product.qty} onChange={(e) => onUpdateQty(e, product)} />
										</Level.Right>
									</Level>
									<div>
										{product.attribute.map((list, iList) => (
											<div key={iList}><em>{list}</em></div>
										))}
									</div>
								</div>
							</Level.Right>
						</Level>
						{
							(product.o2o_supported === '0' && stepOneActiveTab > 0) && <div className='font-red' style={{ marginTop: '15px' }}>{T.checkout.O2O_PRODUCT_NOT_SUPPORT}</div>
						}
					</div>
				))
			}
		</div>
	);
};

export default StoreBoxBody;