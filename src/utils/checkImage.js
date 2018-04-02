export default (imageUrl) => {
	const http = new XMLHttpRequest();
	http.open('HEAD', imageUrl, false);
	http.onloadend = () => {
		if (http.status === 404) return false;
		return true;
	};

	http.send(null);
	return http.status !== 404;
};
