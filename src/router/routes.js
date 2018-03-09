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

const Home = loadable(() => import('@/containers/Mobile/Home'), defaultOptions);

const Page404 = loadable(() => import('@/containers/Mobile/404'), defaultOptions);

// Service Discovery
const Search = loadable(() => import('@/containers/Mobile/Discovery/Search'), defaultOptions);
const SearchResults = loadable(() => import('@/containers/Mobile/Discovery/SearchResults'), defaultOptions);
const SearchNotFound = loadable(() => import('@/containers/Mobile/Discovery/SearchNotFound'), defaultOptions);

const Lovelist = loadable(() => import('@/containers/Mobile/Discovery/Lovelist'), defaultOptions);
const LovelistLogin = loadable(() => import('@/containers/Mobile/Discovery/Lovelist/login'), defaultOptions);

const Category = loadable(() => import('@/containers/Mobile/Discovery/Category'), defaultOptions);
const SubCategory = loadable(() => import('@/containers/Mobile/Discovery/Category/SubCategory'), defaultOptions);
const ProductCategory = loadable(() => import('@/containers/Mobile/Discovery/Category/Product'), defaultOptions);
const CatalogCategory = loadable(() => import('@/containers/Mobile/Discovery/Category/Catalog'), defaultOptions);

const Brands = loadable(() => import('@/containers/Mobile/Discovery/Brands'), defaultOptions);
const BrandsDetail = loadable(() => import('@/containers/Mobile/Discovery/Brands/detail'), defaultOptions);

const Seller = loadable(() => import('@/containers/Mobile/Discovery/Seller'), defaultOptions);

const Hashtags = loadable(() => import('@/containers/Mobile/Discovery/Hashtags'), defaultOptions);
const HashtagsDetails = loadable(() => import('@/containers/Mobile/Details/HashtagsDetails'), defaultOptions);

const SampleFilters = loadable(() => import('@/containers/Mobile/SampleFilters'), defaultOptions); // we used this ?


// PDP
const Products = loadable(() => import('@/containers/Mobile/Details/Products'), defaultOptions);
const ProductsComments = loadable(() => import('@/containers/Mobile/Details/Products/Comments'), defaultOptions);
const ProductsGuide = loadable(() => import('@/containers/Mobile/Details/Products/Guide'), defaultOptions);

// Shopping-bag
const Cart = loadable(() => import('@/containers/Mobile/Cart'), defaultOptions);
const CartEmpty = loadable(() => import('@/containers/Mobile/Cart/empty'), defaultOptions);

// Users
const UserLogin = loadable(() => import('@/containers/Mobile/Users/Login'), defaultOptions);
const ForgotPassword = loadable(() => import('@/containers/Mobile/Users/Login/forgotPassword'), defaultOptions);
const UserRegister = loadable(() => import('@/containers/Mobile/Users/Register'), defaultOptions);
const UserRegistered = loadable(() => import('@/containers/Mobile/Users/Register/registered'), defaultOptions);
const UserRegisteredPhoneValidation = loadable(() => import('@/containers/Mobile/Users/Register/registeredPhoneValidation'), defaultOptions);
const UserProfile = loadable(() => import('@/containers/Mobile/Users/Profile'), defaultOptions);
const UserProfileEdit = loadable(() => import('@/containers/Mobile/Users/Profile/edit'), defaultOptions);
// const UserProfileEditOVO = loadable(() => import('@/containers/Mobile/Users/Profile/editOVO'), defaultOptions);
// const UserProfileEditHP = loadable(() => import('@/containers/Mobile/Users/Profile/editHP'), defaultOptions);
// const UserProfileEditEmail = loadable(() => import('@/containers/Mobile/Users/Profile/editEmail'), defaultOptions);
// const UserProfileEditPassword = loadable(() => import('@/containers/Mobile/Users/Profile/editPassword'), defaultOptions);
const MyOrder = loadable(() => import('@/containers/Mobile/Users/Profile/myOrder'), defaultOptions);
const MyOrderDetail = loadable(() => import('@/containers/Mobile/Users/Profile/myOrderDetail'), defaultOptions);
const MyOrderTracking = loadable(() => import('@/containers/Mobile/Users/Profile/myOrderTracking'), defaultOptions);
const MyOrderConfirm = loadable(() => import('@/containers/Mobile/Users/Profile/myOrderConfirm'), defaultOptions);
const CreditCard = loadable(() => import('@/containers/Mobile/Users/Profile/creditCard'), defaultOptions);
const Address = loadable(() => import('@/containers/Mobile/Users/Address'), defaultOptions);
const AddAddress = loadable(() => import('@/containers/Mobile/Users/Address/add'), defaultOptions);
const EditAddress = loadable(() => import('@/containers/Mobile/Users/Address/edit'), defaultOptions);

// promo
const Promo = loadable(() => import('@/containers/Mobile/Discovery/Promo'), defaultOptions);
const PromoList = loadable(() => import('@/containers/Mobile/Discovery/Promo/PromoList'), defaultOptions);

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
			path: '/([^/]+)-:id([0-9]+).html',
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
			exact: true,
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
			path: '/lovelist-login',
			component: LovelistLogin
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
		// {
		// 	path: '/profile-edit-ovo',
		// 	component: UserProfileEditOVO
		// },
		// {
		// 	path: '/profile-edit-hp',
		// 	component: UserProfileEditHP
		// },
		// {
		// 	path: '/profile-edit-email',
		// 	component: UserProfileEditEmail
		// },
		// {
		// 	path: '/profile-edit-password',
		// 	component: UserProfileEditPassword
		// },
		{
			path: '/profile/my-order',
			component: MyOrder,
			exact: true,
		},
		{
			path: '/profile/my-order/:so_number([a-zA-Z0-9-]+)',
			component: MyOrderDetail
		},
		{
			path: '/track/:provider/:so_number([a-zA-Z0-9-]+)',
			component: MyOrderTracking
		},
		{
			path: '/profile-my-order-confirm',
			component: MyOrderConfirm
		},
		{
			path: '/profile-credit-card',
			component: CreditCard
		},
		{
			path: '/address',
			exact: true,
			component: Address,
		},
		{
			path: '/address/add',
			exact: true,
			component: AddAddress,
		},
		{
			path: '/address/edit/:id',
			exact: true,
			component: EditAddress,
		},
		{
			path: '/*', // Page not found handling.
			component: Page404,
			exact: true
		},
	]
};

