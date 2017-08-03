import React from 'react';

// component load
import { Modal, Level, Button } from '@/components/Base';
import Elocker from '@/components/Elocker';

export default (props) => {
	return (
		<Modal large >
			<Modal.Header>
				Pilih Lokasi E-Locker (O2O)
			</Modal.Header>
			<Modal.Body>
				<Elocker />
			</Modal.Body>
			<Modal.Footer>
				<Level>
					<Level.Right>
						<Button text='Pilih E-Locker (O2O)' dark />
					</Level.Right>
				</Level>
			</Modal.Footer>
		</Modal>
	);
};
