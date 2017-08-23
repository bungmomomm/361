import React from 'react';

// component load
import { Modal, Icon } from '@/components';

export default (props) => {
	return (
		<Modal size='small' shown={props.shown}>
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
