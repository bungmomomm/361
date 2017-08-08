
function injectTracking(target, name, descriptor) {
	const oldFunction = descriptor.value;
	descriptor.value = function propsInjectorFunction(...args) {
		console.log(oldFunction);
	};
}

export default injectTracking;