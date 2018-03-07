
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

const Home = loadable(() => import('@/containers/Mobile/Home'));

const Page404 = loadable(() => import('@/containers/Mobile/404'));

// Service Discovery
const Search = loadable(() => import('@/containers/Mobile/Discovery/Search'));
const SearchResults = loadable(() => import('@/containers/Mobile/Discovery/SearchResults'));
const SearchNotFound = loadable(() => import('@/containers/Mobile/Discovery/SearchNotFound'));

const Lovelist = loadable(() => import('@/containers/Mobile/Discovery/Lovelist'));

const Category = loadable(() => import('@/containers/Mobile/Discovery/Category'));
const SubCategory = loadable(() => import('@/containers/Mobile/Discovery/Category/SubCategory'));
const ProductCategory = loadable(() => import('@/containers/Mobile/Discovery/Category/Product'));
const CatalogCategory = loadable(() => import('@/containers/Mobile/Discovery/Category/Catalog'));

const Brands = loadable(() => import('@/containers/Mobile/Discovery/Brands'));
const BrandsDetail = loadable(() => import('@/containers/Mobile/Discovery/Brands/detail'));

const Seller = loadable(() => import('@/containers/Mobile/Discovery/Seller'));

const Hashtags = loadable(() => import('@/containers/Mobile/Discovery/Hashtags'));
const HashtagsDetails = loadable(() => import('@/containers/Mobile/Details/HashtagsDetails'));

const SampleFilters = loadable(() => import('@/containers/Mobile/SampleFilters')); // we used this ?


// PDP
const Products = loadable(() => import('@/containers/Mobile/Details/Products'));
const ProductsComments = loadable(() => import('@/containers/Mobile/Details/Products/Comments'));
const ProductsGuide = loadable(() => import('@/containers/Mobile/Details/Products/Guide'));

// Shopping-bag
const Cart = loadable(() => import('@/containers/Mobile/Cart'));
const CartEmpty = loadable(() => import('@/containers/Mobile/Cart/empty'));

// Users
const UserLogin = loadable(() => import('@/containers/Mobile/Users/Login'));
const ForgotPassword = loadable(() => import('@/containers/Mobile/Users/Login/forgotPassword'));
const UserRegister = loadable(() => import('@/containers/Mobile/Users/Register'));
const UserRegistered = loadable(() => import('@/containers/Mobile/Users/Register/registered'));
const UserRegisteredPhoneValidation = loadable(() => import('@/containers/Mobile/Users/Register/registeredPhoneValidation'));
const UserProfile = loadable(() => import('@/containers/Mobile/Users/Profile'));
const UserProfileEdit = loadable(() => import('@/containers/Mobile/Users/Profile/edit'));
const UserProfileEditOVO = loadable(() => import('@/containers/Mobile/Users/Profile/editOVO'));
const UserProfileEditHP = loadable(() => import('@/containers/Mobile/Users/Profile/editHP'));
const UserProfileEditEmail = loadable(() => import('@/containers/Mobile/Users/Profile/editEmail'));
const UserProfileEditPassword = loadable(() => import('@/containers/Mobile/Users/Profile/editPassword'));
const MyOrder = loadable(() => import('@/containers/Mobile/Users/Profile/myOrder'));
const MyOrderDetail = loadable(() => import('@/containers/Mobile/Users/Profile/myOrderDetail'));
const MyOrderTracking = loadable(() => import('@/containers/Mobile/Users/Profile/myOrderTracking'));
const MyOrderConfirm = loadable(() => import('@/containers/Mobile/Users/Profile/myOrderConfirm'));


// promo
const Promo = loadable(() => import('@/containers/Mobile/Discovery/Promo'));
const PromoList = loadable(() => import('@/containers/Mobile/Discovery/Promo/PromoList'));

export default {
	parent: [
		{
			path: '/',
			component: Home,
			exact: true
		},
		{
			path: '/mau-gaya-itu-gampang',
			component: Hashtags,
			exact: true
		},
		{
			path: '/mau-gaya-itu-gampang/:campaign_id/:post_id',
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
			path: '/sub-category/',
			component: SubCategory,
		},
		{
			path: '/category/',
			component: Category,
		},
		{
			path: '/p-:categoryId([0-9]+)/:categoryTitle([a-zA-Z0-9-]+)',
			component: ProductCategory,
			exact: true
		},
		{
			path: '/p-:categoryId:([0-9]+)}/:categoryTitle([a-zA-Z0-9-]+):brandTitle(/[a-zA-Z0-9-]+)?',
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
			path: '/brand/:brandId/:brandTitle',
			component: BrandsDetail,
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
			path: '/forgot-password',
			component: ForgotPassword,
			exact: true
		},
		{
			path: '/promo',
			component: PromoList,
			exact: true
		},
		{
			path: '/promo/:type',
			component: Promo
		},
		{
			path: '/profile',
			component: UserProfile
		},
		{
			path: '/profile-edit',
			exact: true,
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
			component: Lovelist,
		},
		{
			path: '/store/:store_id/:store_name',
			component: Seller,
			exact: true
		},
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
		},
		{
			path: '/profile-edit-password',
			component: UserProfileEditPassword
		},
		{
			path: '/profile-my-order',
			component: MyOrder,
			exact: true,
		},
		{
			path: '/profile-my-order/:so_number([a-zA-Z0-9-]+)',
			component: MyOrderDetail
		},
		{
			path: '/profile-my-order-tracking',
			component: MyOrderTracking
		},
		{
			path: '/profile-my-order-confirm',
			component: MyOrderConfirm
		},
		{
			path: '/*', // Page not found handling.
			component: Page404,
			exact: true
		},
	]
};

