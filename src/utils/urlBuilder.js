import { kebabCase } from 'lodash';
import queryString from 'query-string';

const replace = (history, obj) => {
	const url = queryString.stringify(obj, {
		encode: false
	});
	history.push(`?${url}`);
};

class MMUrlBuilder {
	id = '';
	name = '';
	domain = process.env.MOBILE_URL;
	brand = '';

	setId = (id) => {
		this.id = id;
		return this;
	}

	setName = (name) => {
		this.name = MMUrlBuilder.formatedText(name);
		return this;
	}

	setBrand = (brand) => {
		this.brand = MMUrlBuilder.formatedText(brand);
		return this;
	}
	// use kebabCase to remove unnecessary characters
	static formatedText(text) {
		return kebabCase(text);
	}

	reset() {
		this.id = null;
		this.name = null;
		this.brand = null;
	}

	// spec: https://[MM_HOSTNAME]/p-[ID]/[NAME]
	buildPcp = () => {
		const temp = { ...this };
		this.reset();
		return `/p-${temp.id}/${temp.name}`;
	}

	// spec: https://[MM_HOSTNAME]/p-[ID]/[NAME]/[BRAND]
	buildFeatureBrand = () => {
		const temp = { ...this };
		this.reset();
		return `/p-${temp.id}/${temp.name}/${temp.brand}`;
	}

	// spec: https://[MM_HOSTNAME]/[NAME]-[ID].html
	buildPdp = (productName, productId) => {
		if (productName && productId) {
			return `/${kebabCase(productName)}-${productId}.html`;
		}
		if (this.name === null) throw new Error('urlBuilder: pdp required name');
		if (this.id === null) throw new Error('urlBuilder: pdp required id');
		const temp = { ...this };
		this.reset();
		return `/${temp.name}-${temp.id}.html`;
	}

	// spec: https://[MM_HOSTNAME]/brand/[ID]/[NAME]
	buildBrand = () => {
		const temp = { ...this };
		this.reset();
		return `/brand/${temp.id}/${temp.name}`;
	}

	// spec: https://[MM_HOSTNAME]/store/[ID]/[NAME]
	buildStore = () => {
		const temp = { ...this };
		this.reset();
		return `/store/${temp.id}/${temp.name}`;
	}

	buildPcpCommentUrl = (productId) => {
		return `product/comments/${productId}`;
	}

}

const urlBuilder = new MMUrlBuilder();
urlBuilder.replace = replace;

export default urlBuilder;