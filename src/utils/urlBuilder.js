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
	buildPdp = () => {
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


}

const urlBuilder = new MMUrlBuilder();

export default urlBuilder;