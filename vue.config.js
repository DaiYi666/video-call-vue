let {defineConfig} = require("@vue/cli-service");
let {VantResolver} = require("unplugin-vue-components/resolvers");
let ComponentsPlugin = require("unplugin-vue-components/webpack");

module.exports = defineConfig({
    publicPath: "./",
    transpileDependencies: true,
    configureWebpack: {
        plugins: [ComponentsPlugin({
            resolvers: [VantResolver()]
        })]
    }
});