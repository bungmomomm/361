import React from 'react';
import { connect } from 'react-redux';
import { actions } from '@/state/v4/Shared';
import getComputedStyles from './styleSnackbar';

class Snackbar extends React.Component {

	state = {
		snack: null,
		visible: false,
	};

	componentDidMount() {
		if (this.props.snack) {
			this.showSnack(this.props.snack);
		}
	}

	componentWillReceiveProps(nextProps) {
		const snack = this.props.snack;
		const nextSnack = nextProps.snack;
		const visibleSnack = this.state.snack;
		const isInactive = this.props.inactive;
		const willInactivate = nextProps.inactive;
		if (!willInactivate && ((nextSnack && !snack) || (nextSnack && (nextSnack.id !== (snack || {}).id)))) {
			this.showSnack(nextSnack); // Active, and a new snack stands in line in the queue. Show it!
		} else if (isInactive && !willInactivate && (snack && !visibleSnack)) {
			this.showSnack(snack); // Will be active, and we have a snack. Show it!
		} else if (!isInactive && willInactivate && visibleSnack) {
			this.hideSnack(); // Will deactivate, remove the snack until we become active again
		} else if (!nextSnack && snack) {
			this.hideSnack();
		}
	}

	componentWillUnmount() {
		this.clearDismissTimer();
	}

	showSnack = (snack) => {
		this.hideSnack().then(() => {
			this.setState({ snack, visible: false });
			setTimeout(() => {
				this.setState({ visible: true });
				if (snack.data.timeout) {
					this.snackTimer = setTimeout(() => {
						this.props.dispatch(actions.dismissSnack(snack.id));
					}, snack.data.timeout);
				}
			}, 1);
		});
	};

	hideSnack = () => {
		if (!this.state.snack) {
			return Promise.resolve();
		}
		return new Promise((resolve) => {
			this.clearDismissTimer();
			this.setState({ visible: false });
			this.afterTransition = () => {
				this.setState({ snack: null });
				resolve();
			};
		});
	};

	clearDismissTimer = () => {
		if (this.snackTimer) {
			clearTimeout(this.snackTimer);
			this.snackTimer = null;
		}
	};

	transitionEndHandler = () => {
		if (this.afterTransition) {
			this.afterTransition();
			this.afterTransition = null;
		}
	};

	buttonClickHandler = () => {
		const { onButtonClick } = this.props;
		const { snack } = this.state;
		const { id, data: { button = {} } } = snack;

		if (onButtonClick) {
			onButtonClick(snack);
		} else if (button.action && typeof button.action === 'function') {
			button.action(snack);
		} else if (button.action && typeof button.action.type === 'string') {
			this.props.dispatch(button.action);
		} else if (button.action === 'reload') {
			window.location.href = this.props.location.pathname;
		} else if (button.action === 'redirect' && button.href) {
			window.location.href = button.href;
		} else if (button.action === 'to' && button.path) {
			this.props.history.push(button.path);
		}

		this.props.dispatch(actions.dismissSnack(id));
	};

	closeHandler = () => {
		const { snack: { id } } = this.state;
		this.props.dispatch(actions.dismissSnack(id));
	};

	populateStyles = (elem) => {
		const { theming, customStyles } = this.props;
		const largeScreen = window.matchMedia('(min-width: 720px)').matches;
		return getComputedStyles(elem, largeScreen, this.state.visible, theming, customStyles);
	};

	render() {
		const { snack } = this.state;
		if (!snack) {
			return null;
		}
		const button = (snack.data.button || {}).label ? snack.data.button : null;

		return (
			<div
				style={this.populateStyles('snack')}
				onTransitionEnd={this.transitionEndHandler}
			>
				<span>
					<div style={this.populateStyles('label')}>
						{snack.data.label}
					</div>
					{button && (
						<div style={{ display: 'inline-block', width: '25%' }}>
							<button
								style={this.populateStyles('button')}
								onClick={this.buttonClickHandler}
							>
								{button.label}
							</button>
						</div>
					)}
					{snack.close && (
						<button
							onClick={this.closeHandler}
							className='close'
							style={this.populateStyles('close')}
							title='Close'
						>
							✖
						</button>
					)}
				</span>
			</div>
		);
	}

}

export default connect(state => ({ snack: state.shared.snackbar[0] || null }))(Snackbar);
