const enableZoomPinch = (togle = true) => {
	const elViewport = document.querySelector('[name=viewport]');
	let content = elViewport.content;
	if (togle === true) {
		content = content.replace('user-scalable=no', 'user-scalable=yes');
		content = content.replace('maximum-scale=1', 'maximum-scale=2');
	} else {
		content = content.replace('user-scalable=yes', 'user-scalable=no');
		content = content.replace('maximum-scale=2', 'maximum-scale=1');
	}
	elViewport.setAttribute('content', content);
	return togle;
};

export default enableZoomPinch;