const {readFile} = require('fs/promises');

// const resolve = createRequire(import.meta.resolve).resolve;

const cache = {};

async function alwatrIcon(icon, customClass = '') {
  if (icon.indexOf('/') === -1) {
    icon = 'material/' + icon;
  }

  if (icon.indexOf(':') === -1) {
    icon = icon + ':main';
  }

  // @ts-expect-error es2020
  if (Object.hasOwn(cache, icon)) return cache[icon];

  // icon = material/home:main
  const [iconPack, iconExtra] = icon.split('/');
  const [iconName, iconType] = iconExtra.replaceAll('_', '-').split(':');

  let iconContext;

  try {
    const path = require.resolve(`@alwatr/icon-set-${iconPack}/svg/${iconType}/${iconName}.svg`);
    iconContext = await readFile(path, 'utf8');
  } catch {
    const err = new Error(`alwatrIcon: icon ${icon} not found`);

    if (process.env.NODE_ENV === 'production') {
      throw err;
    }

    console.error(err);
    iconContext = 'N!';
  }

  cache[icon] = `<span class="alwatr-icon ${customClass}">${iconContext}</span>`;

  return cache[icon];
}

module.exports = {alwatrIcon};
