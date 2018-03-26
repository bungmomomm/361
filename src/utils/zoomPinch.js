const enableZoomPinch = (togle = true) => {
	const elViewport = document.querySelector('[name=viewport]');
	let content = elViewport.content;
	if (togle === true) {
		content = content.replace('user-scalable=no', 'user-scalable=yes');
		content = content.replace('initial-scale=1', 'initial-scale=2');
	} else {
		content = content.replace('user-scalable=yes', 'user-scalable=no');
		content = content.replace('initial-scale=2', 'initial-scale=1');
	}
	elViewport.setAttribute('content', content);
	return togle;
};

export default enableZoomPinch;