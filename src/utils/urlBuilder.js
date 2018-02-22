class MMUrlBuilder {
	id = null;
	name = null;
	domain = process.env.MOBILE_URL;
	brand = null;

	setId = (id) => {
		if (!id) throw new Error('urlBuilder: use setName with value');
		this.id = id;
		return this;
	}

	setName = (name) => {
		if (!name) throw new Error('urlBuilder: use setName with value');
		this.name = MMUrlBuilder.formatedText(name);
		return this;
	}

	setBrand = (brand) => {
		if (!brand) throw new Error('urlBuilder: use setBrand with value');
		this.brand = MMUrlBuilder.formatedText(brand);
		return this;
	}

	static formatedText(text) {
		return text.toLowerCase().replace(/[^A-Za-z0-9\s]/g, '').replace(/ /g, '-');
	}

	// spec: https://[MM_HOSTNAME]/p-[ID]/[NAME]
	buildPcp = () => {
		if (this.name === null) throw new Error('urlBuilder: pcp required name');
		if (this.id === null) throw new Error('urlBuilder: pcp required id');
		return `/p-${this.id}/${this.name}`;
	}

	// spec: https://[MM_HOSTNAME]/p-[ID]/[NAME]/[BRAND]
	buildFeatureBrand = () => {
		if (this.name === null) throw new Error('urlBuilder: feature brand required name');
		if (this.id === null) throw new Error('urlBuilder: feature brand required id');
		if (this.brand === null) throw new Error('urlBuilder: feature brand required brand');
		return `/p-${this.id}/${this.name}/${this.brand}`;
	}

	// spec: https://[MM_HOSTNAME]/[NAME]-[ID].html
	buildPdp = () => {
		if (this.name === null) throw new Error('urlBuilder: pdp required name');
		if (this.id === null) throw new Error('urlBuilder: pdp required id');
		return `/${MMUrlBuilder.formatedText(this.name)}-${this.id}.html`;
	}

	// spec: https://[MM_HOSTNAME]/brand/[ID]/[NAME]
	buildBrand = () => {
		if (this.name === null) throw new Error('urlBuilder: brand required name');
		if (this.id === null) throw new Error('urlBuilder: brand required id');
		return `/brand/${this.id}/${this.name}`;
	}

	// spec: https://[MM_HOSTNAME]/store/[ID]/[NAME]
	buildStore = () => {
		if (this.id === null) throw new Error('urlBuilder: store required id');
		if (this.name === null) throw new Error('urlBuilder: brand required name');
		return `/store/${this.id}/${this.name}`;

	}
}

const urlBuilder = new MMUrlBuilder();

export default urlBuilder;