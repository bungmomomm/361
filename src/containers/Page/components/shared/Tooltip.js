import React from 'react';
import { Modal } from 'mm-ui';

const Tooltip = ({ show, onClose, content }) => {
	return (
		<Modal size='small' show={show} onCloseRequest={(e) => onClose(e)} >
			<Modal.Body>
				<div dangerouslySetInnerHTML={{ __html: content }} />
			</Modal.Body>
		</Modal>
	);
};

export default Tooltip;