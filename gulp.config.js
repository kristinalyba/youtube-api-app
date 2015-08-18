module.exports = function () {
    var client = './src/';
    var clientApp = client + 'app/';
    var root = './';
    var vendor = './vendor/';
    var temp = './.tmp/';

    var config = {
        build: './build/',
        client: client,
        css: [
            client + 'styles/style.css',
            vendor + '**/*.css'],
        index: 'index.html',
        fonts: vendor + 'bootstrap/fonts/*.*',
        html: clientApp + '**/*.html',
        htmltemplates: clientApp + '**/*.html',
        js: clientApp + '**/*.js',
        root: root,
        temp: temp,

        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'ytApp',
                standAlone: false,
                root: 'src/app/'
            }
        },
    };

    return config;
}
