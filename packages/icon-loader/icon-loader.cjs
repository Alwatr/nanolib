const {readFile} = require('fs/promises');
const {definePackage} = require('@alwatr/logger');

const logger = definePackage('@alwatr/icon-loader', '1.0.0');

const iconContentCache = {};

/**
 * Load an icon from the icon set and return it's svg as a string.
 *
 * @param {string} icon icon name
 * @param {string} customClass custom class added to svg span container
 * @returns {Promise<string>} svg content inside of a span
 */
async function iconLoader(icon, customClass = '') {
  logger.logMethodArgs?.('iconLoader', {icon, customClass});
  if (icon.indexOf('/') === -1) {
    icon = 'material/' + icon;
  }

  if (icon.indexOf(':') === -1) {
    icon = icon + ':main';
  }

  if (iconContentCache.hasOwnProperty(icon) === false) {
    const [iconPack, iconExtra] = icon.split('/');
    const [iconName, iconType] = iconExtra.replace(/\_/, '-').split(':');

    try {
      const path = require.resolve(`@alwatr/icon-set-${iconPack}/svg/${iconType}/${iconName}.svg`);
      iconContentCache[icon] = await readFile(path, 'utf8');
    } catch {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`@alwatr/icon-loader: icon ${icon} not found`);
      }

      logger.error('iconLoader', 'icon_not_found', icon);
      iconContentCache[icon] = 'N!';
    }
  }

  return `<span class="alwatr-icon ${customClass}">${iconContentCache[icon]}</span>`;
}

module.exports = {iconLoader};
