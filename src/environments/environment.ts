// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  frontEndUrl: 'https://samplebank.com',
  resourcesUrl : 'https://samplebank.com:8443/',
  accessConttrolAllowOrigin: ['https://auth.samplebank.com', 'https://samplebank.com', 'https://samplebank.com:8443'],
  authUrl: 'https://auth.samplebank.com/auth',
  authRealm: 'samplebankdev',
  authClientId: 'samplebankpub_ui',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

