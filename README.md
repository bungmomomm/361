# Isomorphic React Redux Front End MatahariMall Components

* Webpack v3
* HMR (also for reducers) in development mode
* React router v4
* Redux for state management
* CSS Modules
* Optional static build
* Long term caching for static assets
* Images optimization ([libpngissue fix for OSX user](https://github.com/tcoopman/image-webpack-loader#libpng-issues))
* React component creation wizard
* Flexbox grid
* Eslint

## How it works

This boilerplate uses React Router v4, with server side rendering.
SSR for CSS modules use `css-loader/locals`, no extra wrapper function for component is needed.

* [Installation](#installation)
* [Development](#development)
* [Production](#production)
* [Static](#static)
* [Component](#component)
* [After deploy](#after-deploy)
* [External Modules Reference] (#external-modules-reference)

## Installation
```javascript
npm install
```
...as usual...

## Development

Run website in development mode on `localhost:3001`, with Hot Module Replacement for Reducers and Components

```javascript
npm run dev
```

## Production

### Build

Run build server and client ( SSR and Styled Components Active )

```
npm run build
```

Run build Static ( CSS Modules and PWA )

```
npm run build-static
```

### Start 

Run website in production mode on `localhost:3000`

```
npm run start
```

## Static

This command runs a static build, that contains plain html files.
The navigation will use hash router, instead of browser history.

```
npm run build:static
```

## Component

This command launches simple wizard for the creation of a react component.
The component will be created on `src/components`.

```
npm run component

Type the name of the component: Test

What kind of component do you need? (Use arrow keys)
> functional
  stateless
  
Component succesfully created. Do you need another component? (Y/n)
```

## After deploy

After deploy, you can run these commands for a complete live environment on `localhost:3000`:
 
```
npm install --production
npm run build
npm start
```

## External Modules Reference
Input validation [ree-validate](https://github.com/moeen-basra/ree-validate)
Google Map React Component [google-maps-react](https://github.com/fullstackreact/google-maps-react)
JavaScript library to validate credit card numbers using luhn algorithm [luhn-cc](https://www.npmjs.com/package/luhn-cc)
Masked input React component for Credit Card [maskedinput](https://github.com/insin/react-maskedinput)
A library for determining credit card type [credit-card-type](https://github.com/braintree/credit-card-type)

## Contributing
[https://github.com/vinensiuswibowo](https://github.com/vinensiuswibowo)