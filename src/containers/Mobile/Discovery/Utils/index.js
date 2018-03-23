import _ from 'lodash';
import {
	urlBuilder
} from '@/utils';
const mapProducts = (products, comments, lovelists) => {
	products = _.map(products, (product) => {
		const commentExists = !_.isEmpty(comments.data) ? _.find(comments.data, { product_id: product.product_id }) : false;
		const lovelistExists = !_.isEmpty(lovelists.bulkieCountProducts) ? _.find(lovelists.bulkieCountProducts, { product_id: product.product_id }) : false;
		if (commentExists) {
			product.commentTotal = commentExists.total;
			product.comments = commentExists;
		}

		if (lovelistExists) {
			product.lovelistTotal = lovelistExists.total;
			product.lovelistStatus = lovelistExists.status;
		}
		return {
			...product,
			url: urlBuilder.buildPdp(product.product_title, product.product_id),
			commentUrl: `/${urlBuilder.buildPcpCommentUrl(product.product_id)}`
		};
	});

	return products;
};

const mapPromoProducts = (products, lovelists) => {
	products = _.map(products, (product) => {
		const productFound = !_.isEmpty(lovelists.bulkieCountProducts) ? _.find(lovelists.bulkieCountProducts, { product_id: product.product_id }) : false;
		product.lovelistStatus = 0;
		if (productFound) product.lovelistStatus = productFound.status;
		return product;
	});

	return products;
};

export default {
	mapProducts,
	mapPromoProducts
};