function getDefaultStyles(theming) {
	return {
		snack: {
			display: 'flex',
			position: 'fixed',
			bottom: 0,
			left: 0,
			right: 0,
			zIndex: 999,
			marginRight: 'auto',
			marginLeft: 'auto',
			width: '100%',
			maxWidth: '480px',
			transition: 'transform 100ms ease-out',
			willChange: 'transform',
			transform: 'translate(0, 100%)',
			backgroundColor: theming.backgroundColor || '#E3E3E3',
			padding: '13px 16px',
			largeScreen: {}
		},
		label: {
			flex: 4,
			font: theming.labelFont || 'normal 14px arial, sans-serif',
			color: theming.labelColor || '#494949',
			width: '75%',
			display: 'inline-block',
			paddingRight: '20px'
		},
		button: {
			flex: 1,
			float: 'right',
			font: theming.buttonFont || 'bold 14px arial, sans-serif',
			color: theming.buttonColor || '#494949',
			border: 'none',
			background: 'none',
			paddingRight: '10px',
			margin: 0
		},
		close: {
			color: '#777',
			font: '14px/100% arial, sans-serif',
			position: 'absolute',
			right: '5px',
			textDecoration: 'none',
			textShadow: '0 1px 0 #fff',
			top: '5px',
			content: '×'
		}
	};
}

function toastSytle() {
	return 	{
		css: {
			snack: {
				display: 'flex',
				position: 'fixed',
				bottom: '30px',
				right: 0,
				left: 0,
				marginRight: 'auto',
				marginLeft: 'auto',
				zIndex: '2',
				width: '300px',
				maxWidth: '480px',
				backgroundColor: 'rgba(0, 0, 0, 0.8)',
				padding: '15px',
				borderRadius: '40px',
				textAlign: 'center',
				transition: 'transform 100ms ease-out',
				willChange: 'transform',
				transform: 'translate(0, 100%)',
				largeScreen: {}
			},
			label: {
				flex: '4',
				fontSize: '14px',
				lineHeight: 'normal',
				fontFamily: 'arial, sans-serif',
				color: 'rgba(255, 255, 255, 0.7)',
				width: '100%',
				display: 'block',
				paddingRight: '0px'
			}
		},
		sticky: true
	};
}

function getTransitionStyles(elem, largeScreen, visible, theming) {
	if (elem === 'snack') {
		if (visible) {
			const small = `translate(${(theming.transitionToXY || {}).smallScreen || '0, 0'})`;
			const large = `translate(${(theming.transitionToXY || {}).largeScreen || '0, 0'})`;
			return {
				transform: largeScreen ? large : small,
			};
		}
		return {};
	}
	return {
		transition: 'opacity 100ms ease-out',
		transitionDelay: '150ms',
		willChange: 'opacity',
		opacity: visible ? 1 : 0,
	};
}

function getComputedStyles(elem, largeScreen, visible, theming = {}, customStyles = {}) {
	let styles = {
		...getDefaultStyles(theming)[elem],
		...customStyles[elem],
	};
	delete styles.largeScreen;
	if (largeScreen) {
		styles = {
			...styles,
			...(getDefaultStyles(theming)[elem] || {}).largeScreen,
			...(customStyles[elem] || {}).largeScreen,
		};
	}
	styles = { ...styles, ...getTransitionStyles(elem, largeScreen, visible, theming) };
	return styles;
}

export default {
	getComputedStyles,
	toastSytle
};
