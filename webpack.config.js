const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        game: './client/game/main.js'
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, './client'),
        ]
    },
    //plugins: [
    //    // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
    //    new CleanWebpackPlugin(),
    //    new HtmlWebpackPlugin({
    //        title: 'Development'
    //    })
    //],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public/scripts')
    }
};