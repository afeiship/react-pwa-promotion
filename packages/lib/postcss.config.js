/** @type {import('postcss-load-config').Config} */
const config = {
  map: { inline: false },
  plugins: [require('autoprefixer'), require('cssnano')]
};

module.exports = config;
