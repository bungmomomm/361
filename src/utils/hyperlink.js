/**
 * Created by Faris Rayhan on 2/14/18.
 *
 */
const hyperlink = (baseUrl, urlSegment, queryString) => {
 
	// Url segment builder
	const urlSegmentBuilder = (url) => {
		let linkSegment = '';
		url.map((value) => {
			if ((typeof value === 'string')) {
				linkSegment += `/${encodeURIComponent(value)}`;
			} else {
				linkSegment += `/${value}`;
			}
			return '';
		});
		return linkSegment;
	};
	
	// Url query string builder
	const urlQueryStringBuilder = (url) => {
		let linkQueryString = '';
		url.map((value) => {
			if (typeof value === 'string') {
				linkQueryString += `?${encodeURIComponent(value)}&`;
			} else {
				linkQueryString += `?${value}&`;
			}
			return '';
		});
		return linkQueryString;
	};
	
	// Link result to be appended inside the element
	let linkResult = baseUrl + urlSegmentBuilder(urlSegment);
	
	if (queryString !== null) {
		linkResult += urlQueryStringBuilder(queryString);
	}
	
	return linkResult;
};
export default hyperlink;