# Diago UI

## Development Environment

You need to have node version 10.13.0 on your local machine. Consider using [nvm](https://github.com/nvm-sh/nvm#installation) to switch node versions between different projects.

After cloning the project, run

```
$ npm install
```

to install all the required dependencies.

Then, run

```
$ npm install -g concurrently 
```

to install the concurrently module globally, which is required to run / build the app.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Styling

Create sass files as stylesheets, but use the .css extension when importing them in JavaScript. This is because the sass file is compiled into a CSS file at runtime, which is what ends up being used.

## Importing modules

All JavaScript and CSS files as well as images can be imported. When importing a file, you may use a relative path or an absolute path (which is relative to `src/`).
