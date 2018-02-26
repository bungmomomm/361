class MMUrlBuilder {
	id = null;
	name = null;
	domain = process.env.MOBILE_URL;
	brand = null;

	setId = (id) => {
		if (typeof id !== 'number') throw new TypeError(`urlBuilder: use setId with number value, given: ${id} [${typeof id}]`);
		this.id = id;
		return this;
	}

	setName = (name) => {
		if (typeof name !== 'string') throw new TypeError(`urlBuilder: use setName with string value, given: ${name} [${typeof name}]`);
		this.name = MMUrlBuilder.formatedText(name);
		return this;
	}

	setBrand = (brand) => {
		if (typeof brand !== 'string') throw new TypeError(`urlBuilder: use setBrand with brand value, given: ${brand} [${typeof brand}]`);
		this.brand = MMUrlBuilder.formatedText(brand);
		return this;
	}

	static formatedText(text) {
		return text.toLowerCase().replace(/[^A-Za-z0-9\s]/g, '').replace(/ /g, '-');
	}

	reset() {
		this.id = null;
		this.name = null;
		this.brand = null;
	}

	// spec: https://[MM_HOSTNAME]/p-[ID]/[NAME]
	buildPcp = () => {
		if (this.name === null) throw new TypeError('urlBuilder: pcp required name');
		if (this.id === null) throw new TypeError('urlBuilder: pcp required id');
		const temp = { ...this };
		this.reset();
		return `/p-${temp.id}/${temp.name}`;
	}

	// spec: https://[MM_HOSTNAME]/p-[ID]/[NAME]/[BRAND]
	buildFeatureBrand = () => {
		if (this.name === null) throw new Error('urlBuilder: feature brand required name');
		if (this.id === null) throw new Error('urlBuilder: feature brand required id');
		if (this.brand === null) throw new Error('urlBuilder: feature brand required brand');
		const temp = { ...this };
		this.reset();
		return `/p-${temp.id}/${temp.name}/${temp.brand}`;
	}

	// spec: https://[MM_HOSTNAME]/[NAME]-[ID].html
	buildPdp = () => {
		if (this.name === null) throw new Error('urlBuilder: pdp required name');
		if (this.id === null) throw new Error('urlBuilder: pdp required id');
		const temp = { ...this };
		this.reset();
		return `/${temp.name}-${temp.id}.html`;
	}

	// spec: https://[MM_HOSTNAME]/brand/[ID]/[NAME]
	buildBrand = () => {
		if (this.name === null) throw new Error('urlBuilder: brand required name');
		if (this.id === null) throw new Error('urlBuilder: brand required id');
		const temp = { ...this };
		this.reset();
		return `/brand/${temp.id}/${temp.name}`;
	}

	// spec: https://[MM_HOSTNAME]/store/[ID]/[NAME]
	buildStore = () => {
		if (this.id === null) throw new Error('urlBuilder: store required id');
		if (this.name === null) throw new Error('urlBuilder: brand required name');
		const temp = { ...this };
		this.reset();
		return `/store/${temp.id}/${temp.name}`;
	}


}

const urlBuilder = new MMUrlBuilder();

export default urlBuilder;