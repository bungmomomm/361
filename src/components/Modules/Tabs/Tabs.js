import React from 'react';
import TabsDesktop from './Tabs.desktop';
import TabsMobile from './Tabs.mobile';
import Panel from './__child/TabPanel';

import { isMobile } from '@/utils';

const Tabs = (props) => {
	return (
		isMobile() ? (
			<TabsMobile {...props} />
		) : (
			<TabsDesktop {...props} />
		)
	);
};

Tabs.Panel = Panel;

export default Tabs;