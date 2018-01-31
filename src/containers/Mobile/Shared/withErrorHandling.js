import React, { Component } from 'react';

const withErrorHandling = (WrapperComponent, errorData, callback) => {
	class ErrorHandling extends Component {
		constructor(props) {
			super(props);
			this.props = props;
		}

		render() {
			return (
				<WrapperComponent {...this.props} />
			);
		}
	}

	return ErrorHandling;
};

export default withErrorHandling;