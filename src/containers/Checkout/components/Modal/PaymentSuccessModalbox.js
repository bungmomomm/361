import React from 'react';

// component load
import { Modal } from '@/components/Base';
import Icon from '@/components/Icon';

export default (props) => {
	return (
		<Modal small>
			<Modal.Header>
				<Icon name='check' custom='success' />
			</Modal.Header>
			<Modal.Body>
				<p>
					<strong>
					Selamat Pembayaran <br />
					Anda telah berhasil
					</strong>
				</p>
			</Modal.Body>
		</Modal>
	);
};
