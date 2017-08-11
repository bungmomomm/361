
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
		.map((x, y) => {
			const prodRel = x.relationships.products.data;
			const prods = jsoApiResponse.included.filter(e => e.type === 'products')
				.find(e => e.type === prodRel.type && e.id === prodRel.id);
			return {
				name: prods.attributes.title,
				price: 299000,
				qty: 1,
				maxQty: parseInt(prods.attributes.max_quantity, 10),
				image: prods.attributes.thumbnail_url,
				attribute: [
					'packing yang rapih tolong hati hati karena ini barang mewah',
					'color: white'
				],
			};
		});
		
		const x = {
			store: {
				id: value.id,
				name: attr.store_name,
				location: 'mesti di update di api',
				total_items: attr.total_items,
				store_image: attr.store_image,
				price: {
					final_delivery_cost: attr.total_price.final_delivery_cost,
					sub_total: attr.total_price.sub_total,
					total: attr.total_price.total,
				},
				products
			}
		};

		return x;
	});
};

export default{
	setPayloadPlaceOrder,
	setCartModel
};