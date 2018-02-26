import React from 'react';
import { Group, Input } from 'mm-ui';

const Header = (props) => {
	return (
		<div>
			<Group grouped>
				<Input type='text' placeholder='Cari produk, #hashtags' />
			</Group>
		</div>
	);
};

export default Header;