import React from 'react';
import Helmet from 'react-helmet';

import Routes from '@/router';

export default (props) => {
	return (
		<div>
			<Helmet
				meta={[
					{
						charset: 'utf-8'
					},
					{
						name: 'viewport',
						content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
					},
					{
						'http-equiv': 'X-UA-Compatible',
						content: 'IE=edge, chrome=1'
					},
					{
						name: 'description',
						content: 'Lorem ipsum'
					}
				]}
			/>
			<main>		
				<Routes />
			</main>
		</div>
	);
};