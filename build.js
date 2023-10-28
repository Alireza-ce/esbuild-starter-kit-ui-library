const { glob } = require('glob');
const path = require('path');
const { build } = require('esbuild');
const { sassPlugin, postcssModules } = require('esbuild-sass-plugin');
const { dependencies, peerDependencies } = require('./package.json');

const inputSrcs = [...glob.sync('./components/*/').map((el) => `components/${path.parse(el).name}`)];

// eslint-disable-next-line array-callback-return
inputSrcs.map((name) => {
  build({
    entryPoints: [`${name}/index.tsx`],
    outfile: `build/${name}/index.cjs.js`,
    format: 'cjs',
    platform: 'node',
    bundle: true,
    target: 'node14',
    sourcemap: true,
    minify: true,
    plugins: [
      sassPlugin({
        filter: /\.module\.scss$/,
        transform: postcssModules({ basedir: '/' }),
        type: 'style',
      }),
      sassPlugin({
        filter: /\.scss$/,
        type: 'style',
      }),
    ],
    external: Object.keys(dependencies || {}).concat(Object.keys(peerDependencies || {})),
  });

  build({
    entryPoints: [`${name}/index.tsx`],
    outfile: `build/${name}/index.js`,
    format: 'esm',
    bundle: true,
    sourcemap: true,
    minify: true,
    plugins: [
      sassPlugin({
        filter: /\.module\.scss$/,
        transform: postcssModules({ basedir: '/' }),
        type: 'style',
      }),
      sassPlugin({
        filter: /\.scss$/,
        type: 'style',
      }),
    ],
    external: Object.keys(dependencies || {}).concat(Object.keys(peerDependencies || {})),
  });
});

build({
  entryPoints: ['main.ts'],
  outfile: `build/main.cjs.js`,
  format: 'cjs',
  bundle: false,
  sourcemap: true,
  minify: true,
});

build({
  entryPoints: ['main.ts'],
  outfile: `build/main.js`,
  format: 'esm',
  bundle: false,
  sourcemap: true,
  minify: true,
});
