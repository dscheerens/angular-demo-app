# Angular Demo Application

This is just a simple Angular demo application.

## Getting started

1. Make sure you have Node.js version 12 (or higher) installed (download from [https://nodejs.org/en/download/](https://nodejs.org/en/download/)).
2. Download or clone this repository to your machine.
3. Open a terminal and navigate to the directory in which you downloaded / cloned the repository.
4. Run `npm install` to download the NPM dependencies required to run the application.
5. Run `npm start` to run the application.
   It will take a short time to compile the application.
   Once finished you can access the application by opening a browser and navigating to [http://localhost:4200](http://localhost:4200).

### Unit tests & linting

Unit tests can be run using the following command (executed with the current working directory set to root of the project):

```shell
npm test
```

Similarly you can run linting over the code base by executing the following command:

```shell
npm run lint
```

## Possible improvements

* Responsive design for smaller screen sizes.
* Structural directive that combines the *ngIf directive and app-validation-error-message component functionality.
* State management + route guards to disallow signing up multiple times / accessing the welcome page without signing up.
* Configurable backend URL.
* JSDoc for the common code base.
* E2E tests.
