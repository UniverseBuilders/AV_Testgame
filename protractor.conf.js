exports.config = {
    capabilities: {
        "browserName": "chrome",
        "chromeOptions": {
            binary: "/usr/bin/chromium-browser",
            args: [],
            extensions: []
        }
    },
    baseUrl:"http://localhost:8080",
    specs: ['protractorTests/basic-ui-test.js']
};