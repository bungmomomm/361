import URL from 'url-parse';
import queryString from 'query-string';
import htmlspecialchars from 'htmlspecialchars';


const sendGtm = (data) => {
	window.dataLayer.push(data);
};

const sendLocation = (url) => {

	// Define default return value.
	const data = [];
	data.url = url;
	
	// Parse the URL to get the Query
	const parsedUrl = new URL(url);
	// Return the data if query not found.
	if (parsedUrl.query === '') {
		// return the function
		return this;
	}
	
	// Parse the string from query
	const promoData = queryString.parse(parsedUrl.query);
	if ((promoData.icid && promoData.icn && promoData.creid && promoData.bannerid) === undefined
	) {
		// Early return if no key inside the object found
		return this;
	}
	
	window.dataLayer.push({
		event: 'promotionClick',
		ecommerce: {
			promoClick: {
				promotions: [
					{
						id: htmlspecialchars(promoData.icid),
						name: htmlspecialchars(promoData.icn),
						creative: htmlspecialchars(promoData.creid),
						position: htmlspecialchars(promoData.bannerid)
					}]
			}
		}
	});
	
	return this;
};

const sendLucidWork = (data) => {
	// ...
};

export default {
	sendGtm,
	sendLocation,
	sendLucidWork
};