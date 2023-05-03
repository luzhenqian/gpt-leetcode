import * as path from 'path';
import * as glob from 'glob';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { Configuration } from 'webpack';

const baseConfig: Configuration = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  devtool: 'cheap-module-source-map',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
};

/**
 * Generates entry object for a specific file pattern
 *
 * @param {string} pattern - File pattern to match
 * @returns {Record<string, string>} - Entry object with keys as entry names and values as file paths
 */
const generateEntries = (pattern: string): Record<string, string> => {
  const files = glob.sync(path.resolve(__dirname, pattern));
  const entries = files.reduce((result, file) => {
    const entryName = path.basename(file, '.ts');
    const relativeFilePath = path.relative(__dirname, file);
    result[entryName] = `./${relativeFilePath}`;
    return result;
  }, {});

  return entries;
};

const contentEntries = generateEntries('./src/content/**/*.ts');
const backgroundEntries = generateEntries('./src/background/**/*.ts');

/**
 * Creates a sub-configuration for a given entry and output path
 *
 * @param {Record<string, string>} entry - Entry object with keys as entry names and values as file paths
 * @param {string} outputPath - Output path for generated files
 * @returns {Configuration} - Webpack sub-configuration
 */
function createSubConfig(
  entry: Record<string, string>,
  outputPath: string,
): Configuration {
  return {
    ...baseConfig,
    entry,
    output: {
      filename: '[name].js',
      path: outputPath,
    },
    plugins: [
      ...(baseConfig.plugins || []),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [path.resolve(outputPath, '**/*')],
      }),
    ],
  };
}

const config: Configuration[] = [
  createSubConfig(
    { popup: './src/popup/popup.tsx' },
    path.resolve(__dirname, 'dist/popup'),
  ),
  createSubConfig(contentEntries, path.resolve(__dirname, 'dist/content')),
  createSubConfig(
    backgroundEntries,
    path.resolve(__dirname, 'dist/background'),
  ),
];

export default config;
