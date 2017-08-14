
const setPayloadPlaceOrder = (address) => {
	return {
		attributes: {
			delivery_method: address.type,
			latitude: address.attributes.latitude,
			longitude: address.attributes.longitude
		},
		relationships: {
			address: {
				data: [
					{
						id: address.id,
						type: address.type
					},
					{
						attributes: {
							address: address.attributes.address,
							address_label: address.attributes.address_label,
							city: address.attributes.city,
							district: address.attributes.district,
							fullname: address.attributes.fullname,
							phone: address.attributes.phone,
							province: address.attributes.province,
							zipcode: address.attributes.zipcode
						},
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
			return {
				name: prods.attributes.title,
				price: parseInt(a.attributes.purchase_price.unit, 10),
				qty: parseInt(a.attributes.quantity, 10),
				maxQty: parseInt(prods.attributes.max_quantity, 10),
				image: prods.attributes.thumbnail_url,
				attribute: [
					'packing yang rapih tolong hati hati karena ini barang mewah',
					'color: white'
				],
			};
		});
		
		const shipping = {
			note: attr.shipping_note[0],
			o2oSupported: attr.o2o_supported === '1',
			gosend: {
				gosendSupported: attr.gosend_supported === '1',
				gosendActivated: attr.gosend_supported === '1',
			}
		};
		const x = {
			store: {
				id: value.id,
				name: attr.store_name,
				location: 'mesti di update di api',
				total_items: attr.total_items,
				store_image: attr.store_image,
				price: {
					final_delivery_cost: parseInt(attr.total_price.final_delivery_cost, 10),
					sub_total: parseInt(attr.total_price.sub_total, 10),
					total: parseInt(attr.total_price.total, 10),
				},
				products,
				shipping
			}
		};
		return x;
	});
};

export default{
	setPayloadPlaceOrder,
	setCartModel
};