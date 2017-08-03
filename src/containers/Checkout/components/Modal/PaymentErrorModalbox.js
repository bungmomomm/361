import React from 'react';

// component load
import { Modal } from '@/components/Base';
import Icon from '@/components/Icon';

export default (props) => {
	return (
		<Modal small>
			<Modal.Header>
				<Icon name='times' custom='error' />
			</Modal.Header>
			<Modal.Body>
				<p>
					<strong>
					Pembayaran Anda tidak <br />
					berhasil coba lagi atau gunakan <br />
					metode pembayaran lainnya <br />
					</strong>
				</p>
			</Modal.Body>
		</Modal>
	);
};
