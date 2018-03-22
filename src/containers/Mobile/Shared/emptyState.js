import React from 'react';
import { Svg } from '@/components/mobile';

const EmptyState = () => {
	return (
		<div className='text-center' style={{ marginBottom: '100px' }}>
			<div className='margin--medium-v flex-center flex-middle'><Svg src='ico_no_404.svg' /></div>
			<div className=' margin--small-v'>
				<strong className='font-bold font-large'>SORRY!</strong>
			</div>
			<div>
				Kami tidak menemukan produk yang<br />cocok untuk kriteria Anda.
			</div>
		</div>
	);
};

export default EmptyState;