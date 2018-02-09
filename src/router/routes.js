
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
let SearchResults = defRoute;
let SearchNotFound = defRoute;
let Category = defRoute;
let SubCategory = defRoute;
let ProductCategory = defRoute;
let Brands = defRoute;
let CatalogCategory = defRoute;
let Lovelist = defRoute;
let Hashtags = defRoute;
let HashtagsDetails = defRoute;
let Products = defRoute;
let ProductsComments = defRoute;
let ProductsGuide = defRoute;
let UserLogin = defRoute;
let UserRegister = defRoute;
let UserRegistered = defRoute;
let UserRegisteredPhoneValidation = defRoute;
// let NewArrival = defRoute;
// let Recommended = defRoute;
let ForgotPassword = defRoute;
let SampleFilters = defRoute;
let Promo = defRoute;
let UserProfile = defRoute;
let UserProfileEdit = defRoute;
let UserProfileEditOVO = defRoute;
let UserProfileEditHP = defRoute;
let UserProfileEditEmail = defRoute;
let Seller = defRoute;
let Cart = defRoute;
let CartEmpty = defRoute;

if (isMobile()) {
	/**
	 * Require main mobile styles
	 */
	import('@/styles/mobile');

	Home = loadable(() => import('@/containers/Mobile/Home'));

	// Service Discovery
	Page404 = loadable(() => import('@/containers/Mobile/404'));
	Search = loadable(() => import('@/containers/Mobile/Discovery/Search'));
	SearchResults = loadable(() => import('@/containers/Mobile/Discovery/SearchResults'));
	SearchNotFound = loadable(() => import('@/containers/Mobile/Discovery/SearchNotFound'));
	Lovelist = loadable(() => import('@/containers/Mobile/Discovery/Lovelist'));
	Hashtags = loadable(() => import('@/containers/Mobile/Discovery/Hashtags'));
	Category = loadable(() => import('@/containers/Mobile/Discovery/Category'));
	SubCategory = loadable(() => import('@/containers/Mobile/Discovery/Category/SubCategory'));
	ProductCategory = loadable(() => import('@/containers/Mobile/Discovery/Category/Product'));
	Brands = loadable(() => import('@/containers/Mobile/Discovery/Brands'));
	Seller = loadable(() => import('@/containers/Mobile/Discovery/Seller'));
	CatalogCategory = loadable(() => import('@/containers/Mobile/Discovery/Category/Catalog'));

	SampleFilters = loadable(() => import('@/containers/Mobile/SampleFilters'));

	// Service Details
	HashtagsDetails = loadable(() => import('@/containers/Mobile/Details/HashtagsDetails'));

	// PDP
	Products = loadable(() => import('@/containers/Mobile/Details/Products'));

	// Shopping-bag
	Cart = loadable(() => import('@/containers/Mobile/Cart'));
	CartEmpty = loadable(() => import('@/containers/Mobile/Cart/empty'));

	ProductsComments = loadable(() => import('@/containers/Mobile/Details/Products/Comments'));
	ProductsGuide = loadable(() => import('@/containers/Mobile/Details/Products/Guide'));

	// Users
	UserLogin = loadable(() => import('@/containers/Mobile/Users/Login'));
	ForgotPassword = loadable(() => import('@/containers/Mobile/Users/Login/forgotPassword'));
	UserRegister = loadable(() => import('@/containers/Mobile/Users/Register'));
	UserRegistered = loadable(() => import('@/containers/Mobile/Users/Register/registered'));
	UserRegisteredPhoneValidation = loadable(() => import('@/containers/Mobile/Users/Register/registeredPhoneValidation'));
	// promo
	Promo = loadable(() => import('@/containers/Mobile/Discovery/Promo'));
	UserProfile = loadable(() => import('@/containers/Mobile/Users/Profile'));
	UserProfileEdit = loadable(() => import('@/containers/Mobile/Users/Profile/edit'));
	UserProfileEditOVO = loadable(() => import('@/containers/Mobile/Users/Profile/editOVO'));
	UserProfileEditHP = loadable(() => import('@/containers/Mobile/Users/Profile/editHP'));
	UserProfileEditEmail = loadable(() => import('@/containers/Mobile/Users/Profile/editEmail'));
} else {
	/**
	 * Require main desktop styles
	 */
	import('@/styles');
	Home = loadable(() => import('@/containers/Desktop/Home'));
}

export default {
	parent: [
		{
			path: '/',
			component: Home,
			exact: true
		},
		{
			path: '/hashtags',
			component: Hashtags,
			exact: true
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
			path: '/products',
			component: SearchResults
		},
		{
			path: '/searchnotfound', // This path only for displaying search not found SearchNotFound Container
			component: SearchNotFound
		},
		{
			path: '/category/:categoryLvl1/:categoryLvl2/:categoryLvl3',
			component: SubCategory,
		},
		{
			path: '/category/:categoryLvl1/:categoryLvl2',
			component: SubCategory,
		},
		{
			path: '/category/:categoryLvl1',
			component: Category,
		},
		{
			path: '/category/',
			component: Category,
		},
		{
			path: '/p-:categoryId([0-9]+)/:categoryTitle([a-zA-Z0-9]+)',
			component: ProductCategory
		},
		{
			path: '/subcategory/:categoryId',
			component: SubCategory,
		},
		{
			path: '/brands',
			component: Brands,
			exact: true
		},
		{
			path: '/catalogcategory',
			component: CatalogCategory
		},
		{
			path: '/samplefilters',
			component: SampleFilters
		},
		{
			path: '/lovelist',
			component: Lovelist,
		},
		{
			path: '/product/comments/:id',
			component: ProductsComments,
			exact: true
		}, {
			path: '/product/guide',
			component: ProductsGuide,
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
			path: '/promo/:type',
			component: Promo
		},
		// {
		// 	path: '/promo',
		// 	component: Promo
		// },
		// {
		// 	path: '/new_arrival',
		// 	component: Promo,
		// 	exact: true
		// },
		// {
		// 	path: '/best_seller',
		// 	component: Promo
		// },
		// {
		// 	path: '/recommended_products',
		// 	component: Promo
		// },
		// {
		// 	path: '/recent_view',
		// 	component: Promo
		// },
		{
			path: '/profile',
			component: UserProfile
		},
		{
			path: '/profile-edit',
			component: UserProfileEdit,
		},
		{
			path: '/profile-edit-*',
			component: UserProfileEdit,
		},
		{
			path: '/lovelist',
			component: Lovelist
		},
		{
			path: '/cart',
			exact: true,
			component: Cart
		},
		{
			path: '/cart/empty',
			exact: true,
			component: CartEmpty
		},
		{
			path: '/lovelist',
			component: Lovelist
		},
		{
			path: '/store/:store_id',
			component: Seller
		},
		{
			path: '/*', // Page not found handling.
			component: Page404,
			exact: true
		}
	],
	child: [
		{
			path: '/profile-edit-ovo',
			component: UserProfileEditOVO
		},
		{
			path: '/profile-edit-hp',
			component: UserProfileEditHP
		},
		{
			path: '/profile-edit-email',
			component: UserProfileEditEmail
		}
	]
};
