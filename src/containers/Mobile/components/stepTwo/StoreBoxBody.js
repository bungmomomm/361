import React from 'react';
import { currency } from '@/utils';
import {
	Level,
	Stepper
} from 'mm-ui';
import { T } from '@/data/translations';

const StoreBoxBody = ({ products, isRestrictO2O, onUpdateQty }) => {
	return (
		<div>
			{
				products.map((product, idx) => (
					<div key={idx}>
						<Level>
							<Level.Left><img src={product.image} width={50} height={50} alt={product.name} /></Level.Left>
							<Level.Right style={{ paddingLeft: '20px' }}>
								<div style={{ marginBottom: '10px' }}>{product.name}</div>
								<Level style={{ marginBottom: '10px' }}>
									<Level.Left><strong>{currency(product.price)}</strong></Level.Left>
									<Level.Right>
										<Stepper max={product.maxQty} min={1} start={product.qty} onChange={(e) => onUpdateQty(e, product.id)} />
									</Level.Right>
								</Level>
								<div>
									{product.attribute.map((list, iList) => (
										<div key={iList}><em>{list}</em></div>
									))}
								</div>
							</Level.Right>
						</Level>
						{
							isRestrictO2O && (
								<Level>
									<Level.Item className='font-red'><p>{T.checkout.RESTRICT_O2O}</p></Level.Item>
								</Level>
							)
						}
					</div>
				))
			}
		</div>
	);
};

export default StoreBoxBody;