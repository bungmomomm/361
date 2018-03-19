const stringHelper = {};
stringHelper.removeHtmlTag = (html) => {
	const element = document.createElement('DIV');
	element.innerHTML = html;
	return element.textContent || element.innerText || '';
};


export default stringHelper;