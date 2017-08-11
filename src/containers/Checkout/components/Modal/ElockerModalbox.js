import React from 'react';

// component load
import { Modal } from '@/components/Base';
import Elocker from '@/components/Elocker';

export default (props) => {
	return (
		<Modal large shown={props.shown}>
			<Modal.Header>
				Pilih Lokasi E-Locker (O2O)
			</Modal.Header>
			<Modal.Body>
				<Elocker />
			</Modal.Body>
		</Modal>
	);
};
