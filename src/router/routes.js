
import loadable from 'loadable-components';
import { isMobile } from '@/utils';

// const Page = loadable(() => import('@/containers/Page'));

/**
 * cannot using like this
 * const type = isMobile() ? 'Mobile' : 'Desktop';
 * const Home = loadable(() => import(`@/containers/${type}/Home`));
 * since genereated js file will mix dekstop & mobile
 */

const defRoute = loadable(() => import('@/containers/NotFound'));

let Page404 = defRoute;
let Home = defRoute;
let Search = defRoute;
let SearchNotFound = defRoute;
let Category = defRoute;
let SubCategory = defRoute;
let Brands = defRoute;
let CatalogCategory = defRoute;
let Lovelist = defRoute;
let Hashtags = defRoute;
let HashtagsDetails = defRoute;
let Products = defRoute;
let UserLogin = defRoute;
let UserRegister = defRoute;
let UserRegistered = defRoute;
let UserRegisteredPhoneValidation = defRoute;
let NewArrival = defRoute;
let ForgotPassword = defRoute;
let FilterCategory = defRoute;

if (isMobile()) {
	/**
	 * Require main mobile styles
	 */
	import('@/styles/mobile');

	Home = loadable(() => import('@/containers/Mobile/Home'));

	// Service Discovery
	Page404 = loadable(() => import('@/containers/Mobile/404'));
	Search = loadable(() => import('@/containers/Mobile/Discovery/Search'));
	SearchNotFound = loadable(() => import('@/containers/Mobile/Discovery/SearchNotFound'));
	Lovelist = loadable(() => import('@/containers/Mobile/Discovery/Lovelist'));
	Hashtags = loadable(() => import('@/containers/Mobile/Discovery/Hashtags'));
	Category = loadable(() => import('@/containers/Mobile/Discovery/Category'));
	SubCategory = loadable(() => import('@/containers/Mobile/Discovery/Category/SubCategory'));
	Brands = loadable(() => import('@/containers/Mobile/Discovery/Brands'));
	CatalogCategory = loadable(() => import('@/containers/Mobile/Discovery/Category/Catalog'));
	NewArrival = loadable(() => import('@/containers/Mobile/Discovery/NewArrival'));
	FilterCategory = loadable(() => import('@/containers/Mobile/Discovery/Category/Catalog/filter'));

	// Service Details
	HashtagsDetails = loadable(() => import('@/containers/Mobile/Details/HashtagsDetails'));

	// PDP
	Products = loadable(() => import('@/containers/Mobile/Details/Products'));
	// Users
	UserLogin = loadable(() => import('@/containers/Mobile/Users/Login'));
	ForgotPassword = loadable(() => import('@/containers/Mobile/Users/Login/forgotPassword'));
	UserRegister = loadable(() => import('@/containers/Mobile/Users/Register'));
	UserRegistered = loadable(() => import('@/containers/Mobile/Users/Register/registered'));
	UserRegisteredPhoneValidation = loadable(() => import('@/containers/Mobile/Users/Register/registeredPhoneValidation'));
} else {
	/**
	 * Require main desktop styles
	 */
	import('@/styles');
	Home = loadable(() => import('@/containers/Desktop/Home'));
}

export default [
	{
		path: '/',
		component: Home,
		exact: true
	},
	{
		path: '/hashtags',
		component: Hashtags
	},
	{
		path: '/hashtags/details',
		component: HashtagsDetails
	},
	{
		path: '/search',
		component: Search
	},
	{
		path: '/searchnotfound', // This path only for displaying search not found SearchNotFound Container
		component: SearchNotFound
	},
	{
		path: '/category',
		component: Category,
		exact: true
	}, {
		path: '/category/:categoryId',	// for temporary PCP 
		component: Category,
	}, {
		path: '/subcategory/:categoryId',
		component: SubCategory,
	}, {
		path: '/brands',
		component: Brands,
		exact: true
	}, {
		path: '/catalogcategory',
		component: CatalogCategory
	}, {
		path: '/filterCategory',
		component: FilterCategory
	}, {
		path: '/lovelist',
		component: Lovelist,
		exact: true
	}, {
		path: '/product/:id',
		component: Products,
		exact: true
	},
	{
		path: '/login',
		component: UserLogin,
		exact: true
	},
	{
		path: '/register',
		component: UserRegister,
		exact: true
	},
	{
		path: '/registered',
		component: UserRegistered,
		exact: true
	},
	{
		path: '/phoneValidation',
		component: UserRegisteredPhoneValidation,
		exact: true
	},
	{
		path: '/forgotPassword',
		component: ForgotPassword,
		exact: true
	},
	{
		path: '/newarrival',
		component: NewArrival,
		exact: true
	},
	{
		path: '/*', // Page not found handling.
		component: Page404,
		exact: true
	}
];