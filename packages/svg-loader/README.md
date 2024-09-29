# SVG Loader

A utility provides a convenient way to retrieve the content of SVG icon files as strings. You can use in any html/site builder, for example in 11ty, where it can streamline the process of embedding SVGs directly into your HTML. This can enhance performance by reducing HTTP requests and providing immediate rendering of icons.

## Installation

```bash
yarn add @alwatr/svg-loader

# install icon package like Alwatr's icon sets package:
yarn @alwatr/icon-set-material \
     @alwatr/icon-set-extra \
     @alwatr/icon-set-ionic
```

## Usage

```js
// .eleventy.config.js

const {iconLoader} = require('@alwatr/svg-loader');

module.exports = function (eleventyConfig) {
  eleventyConfig.addAsyncShortcode('icon', iconLoader);
};
```
