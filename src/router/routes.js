import { home, category, search } from '@/utils/tracking/lucidworks';
import Loading from './loading';
import loadable from 'loadable-components';

/**
 * cannot using like this
 * const type = isMobile() ? 'Mobile' : 'Desktop';
 * const Home = loadable(() => import(`@/containers/${type}/Home`));
 * since genereated js file will mix dekstop & mobile
 */

// const defRoute = loadable(() => import('@/containers/NotFound'));
/**
 * Require main mobile styles
 */
import('@/styles/mobile');

const defaultOptions = { LoadingComponent: Loading };

export default {
	parent: [
		{
			path: '/',
			component: loadable(() => import('@/containers/Mobile/Home'), defaultOptions),
			exact: true,
			group: home
		},
		{
			path: '/361style',
			component: loadable(() => import('@/containers/Mobile/Discovery/Hashtags'), defaultOptions),
			exact: true
		},
		{
			path: '/mau-gaya-itu-gampang/:campaign_name-:campaign_id/:post_id/:icode',
			component: loadable(() => import('@/containers/Mobile/Details/HashtagsDetails'), defaultOptions)
		},
		{
			path: '/search',
			component: loadable(() => import('@/containers/Mobile/Discovery/Search'), defaultOptions),
			group: search
		},
		{
			path: '/products',
			component: loadable(() => import('@/containers/Mobile/Discovery/SearchResults'), defaultOptions),
			group: search
		},
		{
			path: '/searchnotfound', // This path only for displaying search not found SearchNotFound Container
			component: loadable(() => import('@/containers/Mobile/Discovery/SearchNotFound'), defaultOptions),
			group: search
		},
		{
			path: '/sub-category/',
			component: loadable(() => import('@/containers/Mobile/Discovery/Category/SubCategory'), defaultOptions),
			group: category
		},
		{
			path: '/category/',
			component: loadable(() => import('@/containers/Mobile/Discovery/Category'), defaultOptions),
			group: category
		},
		{
			path: '/p-:categoryId([0-9]+)/:categoryTitle([a-zA-Z0-9-]+)',
			component: loadable(() => import('@/containers/Mobile/Discovery/Category/Product'), defaultOptions),
			exact: true,
			group: category
		},
		{
			path: '/p-:categoryId([0-9]+)/:categoryTitle([a-zA-Z0-9-]+)/:brandTitle([a-zA-Z0-9-]+)',
			component: loadable(() => import('@/containers/Mobile/Discovery/Category/Product'), defaultOptions),
			group: category
		},
		{
			path: '/subcategory/:categoryId',
			component: loadable(() => import('@/containers/Mobile/Discovery/Category/SubCategory'), defaultOptions),
			group: category
		},
		{
			path: '/brands',
			component: loadable(() => import('@/containers/Mobile/Discovery/Brands'), defaultOptions),
			exact: true
		},
		{
			path: '/brand/:brandId/:brandTitle',
			component: loadable(() => import('@/containers/Mobile/Discovery/Brands/detail'), defaultOptions),
			exact: true
		},
		{
			path: '/catalogcategory',
			component: loadable(() => import('@/containers/Mobile/Discovery/Category/Catalog'), defaultOptions),
			group: category
		},
		{
			path: '/product/comments/:id',
			component: loadable(() => import('@/containers/Mobile/Details/Products/Comments'), defaultOptions),
			exact: true
		},
		{
			path: '/product/reviews/:id',
			component: loadable(() => import('@/containers/Mobile/Details/Products/Reviews'), defaultOptions),
			exact: true
		},
		{
			path: '/product/guide',
			component: loadable(() => import('@/containers/Mobile/Details/Products/Guide'), defaultOptions),
			exact: true
		},
		{
			path: '/([^/]+)-p:id([0-9]+).html',
			component: loadable(() => import('@/containers/Mobile/Details/Products'), defaultOptions),
			exact: true
		},
		{
			path: '/([^/]+)-:id([0-9]+).html',
			component: loadable(() => import('@/containers/Mobile/Details/Products'), defaultOptions),
			exact: true
		},
		{
			path: '/login',
			component: loadable(() => import('@/containers/Mobile/Users'), defaultOptions),
			exact: true
		},
		{
			path: '/logout',
			component: loadable(() => import('@/containers/Mobile/Users/Login/Logout'), defaultOptions),
			exact: true
		},
		{
			path: '/register',
			component: loadable(() => import('@/containers/Mobile/Users'), defaultOptions),
			exact: true
		},
		{
			path: '/registered',
			component: loadable(() => import('@/containers/Mobile/Users/Register/registered'), defaultOptions),
			exact: true
		},
		{
			path: '/forgot-password',
			component: loadable(() => import('@/containers/Mobile/Users/Login/forgotPassword'), defaultOptions),
			exact: true
		},
		{
			path: '/user/newpassword',
			component: loadable(() => import('@/containers/Mobile/Users/Login/newPassword'), defaultOptions),
			exact: true
		},
		{
			path: '/promo',
			component: loadable(() => import('@/containers/Mobile/Discovery/Promo/PromoList'), defaultOptions),
			exact: true
		},
		{
			path: '/promo/:type',
			component: loadable(() => import('@/containers/Mobile/Discovery/Promo'), defaultOptions)
		},
		{
			path: '/profile',
			exact: true,
			component: loadable(() => import('@/containers/Mobile/Users/Profile'), defaultOptions)
		},
		{
			path: '/profile-edit',
			exact: true,
			component: loadable(() => import('@/containers/Mobile/Users/Profile/edit'), defaultOptions),
		},
		{
			path: '/lovelist',
			component: loadable(() => import('@/containers/Mobile/Discovery/Lovelist'), defaultOptions)
		},
		{
			path: '/cart',
			exact: true,
			component: loadable(() => import('@/containers/Mobile/Cart'), defaultOptions)
		},
		{
			path: '/cart/empty',
			exact: true,
			component: loadable(() => import('@/containers/Mobile/Cart/empty'), defaultOptions)
		},
		{
			path: '/store/:store_id/:store_name',
			component: loadable(() => import('@/containers/Mobile/Discovery/Seller'), defaultOptions),
			exact: true
		},
		{
			path: '/profile/my-order',
			component: loadable(() => import('@/containers/Mobile/Users/Profile/myOrder'), defaultOptions),
			exact: true,
		},
		{
			path: '/profile/my-order/add-review',
			component: loadable(() => import('@/containers/Mobile/Users/Profile/addReview'), defaultOptions)
		},
		{
			path: '/profile/my-order/:so_number([a-zA-Z0-9-]+)',
			component: loadable(() => import('@/containers/Mobile/Users/Profile/myOrderDetail'), defaultOptions)
		},
		{
			path: '/track/:provider/:so_number([a-zA-Z0-9-]+)',
			component: loadable(() => import('@/containers/Mobile/Users/Profile/myOrderTracking'), defaultOptions)
		},
		{
			path: '/profile/my-order-confirm/:so_number([a-zA-Z0-9-]+)',
			component: loadable(() => import('@/containers/Mobile/Order/Confirmation'), defaultOptions)
		},
		{
			path: '/profile/credit-card',
			component: loadable(() => import('@/containers/Mobile/Users/Profile/creditCard'), defaultOptions)
		},
		{
			path: '/address',
			exact: true,
			component: loadable(() => import('@/containers/Mobile/Users/Address'), defaultOptions),
		},
		{
			path: '/address/add',
			exact: true,
			component: loadable(() => import('@/containers/Mobile/Users/Address/add'), defaultOptions),
		},
		{
			path: '/address/edit/:id',
			exact: true,
			component: loadable(() => import('@/containers/Mobile/Users/Address/edit'), defaultOptions),
		},
		{
			path: '/tentang',
			exact: true,
			component: loadable(() => import('@/containers/Mobile/Static'), defaultOptions),
		},
		{
			path: '/bantuan/:detail',
			exact: true,
			component: loadable(() => import('@/containers/Mobile/Static/details'), defaultOptions),
		},
		{
			path: '/*', // Page not found handling.
			component: loadable(() => import('@/containers/Mobile/404'), defaultOptions),
			exact: true
		},
	]
};

