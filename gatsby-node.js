/**
 * Takes the current loader, determines if it's using a string or an array
 * and replaces localIdentName's value with newIdent
 *
 * @param {object} current
 * @param {string} newIdent
 */

const identMatch = /(localIdentName=)(.+?)(?=&|!|$)/;

const replaceLoaderIdentName = (current, newIdent) => {
  if (current.hasOwnProperty('loaders')) {
    const index = current.loaders.findIndex(loader => loader.startsWith('css?'));
    const loader = current.loaders[index];

    current.loaders[index] = loader.replace(identMatch, `$1${newIdent}`);
  } else if (current.hasOwnProperty('loader')) {
    current.loader = current.loader.replace(identMatch, `$1${newIdent}`);
  }

  return current;
};

/**
 * Modify the cssModules loader with a new localIdentName
 */
module.exports.modifyWebpackConfig = ({
  config,
  stage
}, pluginOptions) => {
  const includeSASS = pluginOptions.includeSASS || false;

  config.loader(`cssModules`, current => {
    return replaceLoaderIdentName(current, pluginOptions.localIdentName);
  });

  if (includeSASS) {
    config.loader(`sassModules`, current => {
      return replaceLoaderIdentName(current, pluginOptions.localIdentName);
    });
  }
  return config;
};
