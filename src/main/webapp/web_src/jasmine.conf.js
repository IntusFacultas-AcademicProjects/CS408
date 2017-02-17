
module.exports = function(config) {
config.set({
basePath = '../';
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'web_src/assets/js/angular-min.js',
  'web_src/assets/js/angular-mocks.js',   // for angular.mock.module and inject.
  'web_src/assets/js/*.js',
  'web_src/*.js'
];
autoWatch = true;
browsers = ['Chrome'];
})
}
