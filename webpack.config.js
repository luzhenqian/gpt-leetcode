module.exports = {
  mode: 'production',
  entry: {
    popup: './src/popup/popup.tsx',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist/popup',
  },
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
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  devtool: 'cheap-module-source-map',
};
