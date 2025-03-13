const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Path ke entry point aplikasi
  output: {
    filename: 'bundle.js', // Nama output bundle
    path: path.resolve(__dirname, 'dist'), // Folder output
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Memproses file JavaScript
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Menggunakan Babel untuk transpile JavaScript
          options: {
            presets: ['@babel/preset-env'], // Menggunakan preset-env untuk transpile ke versi ES yang lebih kompatibel
          },
        },
      },
      {
        test: /\.css$/, // Memproses file CSS
        use: ['style-loader', 'css-loader'], // Load dan inject CSS ke dalam JavaScript
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Path ke template HTML
      filename: 'index.html', // Nama file output
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'), // Properti baru yang menggantikan contentBase
    compress: true, // Mengaktifkan kompresi untuk server
    port: 9000, // Port untuk server dev
    hot: true, // Mengaktifkan Hot Module Replacement
  },
  mode: 'development', // Mode untuk development
};
