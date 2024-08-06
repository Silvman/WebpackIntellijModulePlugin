const AliasPlugin = require("enhanced-resolve/lib/AliasPlugin");
const path = require("path");

class WebpackIntellijModulePlugin {
    constructor(userOptions) {
        const options = {
            configPath: path.resolve(process.env.INIT_CWD, "./webpack.intellij-module.config.json"),
            logConfig: false,
        }
        for (let userOptionsKey in userOptions) {
            options[userOptionsKey] = userOptions[userOptionsKey]
        }

        this.plugins = [];

        let config = {};
        try {
            let name = require.resolve(options.configPath);
            config = require(name) || {};
            options.logConfig && console.log('found extra', config);
        } catch (e) {
            options.logConfig && console.log('not found extra');
        }

        if (config.resolve) {
            if (config.resolve.alias) {
                const alias = [];
                for (let module in config.resolve.alias) {
                    alias.push({
                        name: module,
                        onlyModule: false,
                        alias: config.resolve.alias[module],
                    })
                }
                if (alias.length > 0) {
                    this.plugins.push(new AliasPlugin("raw-resolve", alias, "internal-resolve"));
                }
            }
        }
    }

    apply(resolver) {
        this.plugins.forEach(p => p.apply(resolver));
    }
}

module.exports = WebpackIntellijModulePlugin;