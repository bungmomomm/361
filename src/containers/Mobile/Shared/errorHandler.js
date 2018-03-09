import React from 'react';
import { Modal, Level } from '@/components/mobile';
import { actions } from '@/state/v4/Shared';

const errorHandler = (props) => {
	const { errors, dispatch } = props;

	const showError = errors.length > 0;
	if (!showError) {
		return null;
	}

	setTimeout(() => {
		dispatch(actions.clearErrors());
	}, 5000);

	return (
		<Modal show={showError}>
			<div className='font-medium'>
				<h3 className='text-center'>Terjadi Kesalahan</h3>
				<Level style={{ padding: '0px' }} className='margin--medium-v'>
					<Level.Left />
					<Level.Item className='padding--medium-h'>
						<ul>
							{
								errors.map(({ status, app, errorMessage }, i) => (
									<li key={i}><b>{app}</b>: {errorMessage}</li>
								))
							}
						</ul>
					</Level.Item>
				</Level>
			</div>
		</Modal>
	);
};

export default errorHandler;