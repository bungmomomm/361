import React, { PureComponent } from 'react';

class Loading extends PureComponent {
	componentWillUnmount() {
		window.mmLoading.stop();
	}
	render() {
		return <div>&nbsp;</div>;
	}
}

export default Loading;
