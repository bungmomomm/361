import React from 'react';

// component load
import { Modal, Icon } from '@/components';

export default (props) => {
	return (
		<Modal small shown={props.shown}>
			<Modal.Header>
				<Icon name='check' custom='success' />
			</Modal.Header>
			<Modal.Body>
				<p>
					<strong>
					No Handphone anda <br />
					Berhasil di Verifikasi
					</strong>
				</p>
			</Modal.Body>
		</Modal>
	);
};
