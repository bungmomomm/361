import humps from 'lodash-humps';

const setPayloadPlaceOrder = (address, billing = false) => {
	let attributes;

	let id;
	if (billing) {
		id = billing.id;
	} else {
		attributes = {
			address: address.attributes.address,
			address_label: address.attributes.addressLabel ? address.attributes.addressLabel : (address.attributes.address_label ? address.attributes.address_label : ''),
			city: address.attributes.city,
			district: !address.attributes.district ? '' : address.attributes.district,
			fullname: !address.attributes.fullname ? '' : address.attributes.fullname,
			phone: address.attributes.phone,
			province: address.attributes.province,
			zipcode: address.attributes.zipcode
		};
	}

	return {
		attributes: {
			delivery_method: address.type,
			latitude: !address.attributes.latitude ? '' : address.attributes.latitude,
			longitude: !address.attributes.longitude ? '' : address.attributes.longitude,
			dropship_name: !address.attributes.dropship_name ? '' : address.attributes.dropship_name,
			dropship_phone: !address.attributes.dropship_phone ? '' : address.attributes.dropship_phone,
			is_dropshipper: !address.attributes.is_dropshipper ? 0 : 1,
		},
		relationships: {
			address: {
				data: [
					{
						id: address.id,
						type: address.type === 'pickup' ? 'pickup_location' : address.type
					},
					{
						attributes,
						id,
						type: 'billing'
					}
				]
			}
		},
		type: 'order'
	};
};

const setCartModel = (jsoApiResponse) => {
	return jsoApiResponse.included.filter(e => e.type === 'store_items').map((value, index) => {
		const attr = value.attributes;
		const products = value.relationships.items.data.map((x, y) => {
			return x;
		})
		.map((x, y) => {
			const cartItems = jsoApiResponse.included.filter(e => e.type === 'cart_items')
				.find(e => e.type === x.type && e.id === x.id);
			return cartItems;
		})
		.map((a, b) => {
			const prodRel = a.relationships.products.data;
			const prods = jsoApiResponse.included.filter(e => e.type === 'products')
				.find(e => e.type === prodRel.type && e.id === prodRel.id);
			const idVarians = a.attributes.variants.map((v) => { return v.id; });
			const attributes = [];
			idVarians.forEach(element => {
				const sizeVarian = prods.attributes.variants.find(v => v.id === '103');
				if (sizeVarian && sizeVarian.options.find(e => e.id === element)) {
					const title = 'Size : ';
					attributes.push(title.concat(sizeVarian.options.find(e => e.id === element).name));
				}
			});

			return {
				name: prods.attributes.title,
				price: parseInt(a.attributes.purchase_price.unit, 10),
				qty: parseInt(a.attributes.quantity, 10),
				maxQty: parseInt(prods.attributes.max_quantity, 10),
				image: prods.attributes.thumbnail_url,
				id: parseInt(prodRel.id, 10),
				fgLocation: prods.attributes.fg_location,
				brand: prods.attributes.brand_name,
				o2o_supported: a.attributes.o2o_supported,
				category: prods.attributes.product_category_names,
				attribute: attributes
			};
		}).sort((a, b) => {
			return b.price - a.price;
		});

		const shipping = {
			note: attr.shipping_note[0],
			o2oSupported: attr.o2o_supported === '1',
			gosend: {
				gosendSupported: attr.gosend_supported === '1',
				gosendActivated: attr.gosend_activated === '1',
				gosendApplicable: attr.gosend_applicable === '1',
			}
		};

		let isJabodetabekArea = false;
		const jabodetabek = ['jakarta', 'bogor', 'tangerang', 'bekasi', 'depok'];
		jabodetabek.forEach((city) => {
			if (attr.store_location.toLowerCase().includes(city)) {
				isJabodetabekArea = true;
			}
		});
		

		const x = {
			store: {
				id: value.id,
				name: attr.store_name,
				location: attr.store_location,
				total_items: attr.total_items,
				store_image: attr.store_image,
				isJabodetabekArea,
				price: {
					final_delivery_cost: attr.total_price.final_delivery_cost === '' ? 0 : parseInt(attr.total_price.final_delivery_cost, 10),
					sub_total: parseInt(attr.total_price.sub_total, 10),
					total: parseInt(attr.total_price.total, 10),
				},
				products,
				shipping
			}
		};
		return x;
	}).sort((a, b) => {
		return b.store.price.total - a.store.price.total;
	})
	.sort((a, b) => {
		return a.store.shipping.o2oSupported - b.store.shipping.o2oSupported;
	})
	.sort((a, b) => {
		return b.store.products[0].fgLocation - a.store.products[0].fgLocation;
	});
};

const setProductModel = (jsoApiResponse) => {
	return jsoApiResponse.included.filter(e => e.type === 'products').map((value, index) => {
		const attr = value.attributes;
		const cartItem = jsoApiResponse.included.filter(e => e.type === 'cart_items' && e.id === value.id)[0];
		return {
			name: attr.title,
			price: parseInt(cartItem.attributes.purchase_price.unit, 10),
			qty: parseInt(cartItem.attributes.quantity, 10),
			id: parseInt(value.id, 10),
			brand: attr.brand_name,
			category: attr.product_category_names,
		};
	}).sort((a, b) => {
		return b.price - a.price;
	});
};

const getCartPaymentData = (data, type) => {
	let defaultData = {
		count: 0,
		coupon: 0,
		couponId: null,
		currency: 'IDR',
		deliveryCost: 0,
		deliveryCostDiscount: 0,
		finalDeliveryCost: 0,
		subTotal: 0,
		total: 0
	};
	switch (type) {
	case 'order':
		defaultData = {
			...defaultData,
			...humps(data)
		};
		break;
	case 'cart':
		defaultData = {
			...defaultData,
			subTotal: data.effective_price,
			total: data.effective_price
		};
		break;
	default:
		break;
	}

	return defaultData;
};

export default{
	setPayloadPlaceOrder,
	setCartModel,
	getCartPaymentData,
	setProductModel,
};