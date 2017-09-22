import React from 'react';
import SelectDesktop from './Select.desktop';
import SelectMobile from './Select.mobile';
import { isMobile } from '@/utils';

const Select = (props) => {
	return (
		isMobile() ? <SelectMobile {...props} /> : <SelectDesktop {...props} />
	);
};

export default Select;