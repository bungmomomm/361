const updateDimensions = () => {
	if (navigator.userAgent.match(/Android/i)
		|| navigator.userAgent.match(/webOS/i)
		|| navigator.userAgent.match(/iPhone/i)
		|| navigator.userAgent.match(/iPod/i)
		|| navigator.userAgent.match(/BlackBerry/i)
		|| navigator.userAgent.match(/Windows Phone/i)
		|| (window.innerWidth > 320 && window.innerWidth <= 768)
	) {
		return true;
	}
	return false;
};

export default function () {
	return updateDimensions();
}