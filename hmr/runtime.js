/*
    A standalone implementation of Webpack's hot module replacement (HMR) system.

    Provide the minimal implementation of Webpack's HMR API. We don't need any of the
    stuff related to Webpack's ability to bundle disparate types of modules (JS, CSS, etc.).

    For details on the Webpack HMR API, see https://webpack.js.org/api/hot-module-replacement/
    and the source code of `webpack-hot-middleware`
 */

// TODO [kl] stop hard-coding this URL
var serverUrl = "http://127.0.0.1:3000/injected.js";

// TODO [kl] cleanup the globals

// Listen for the server to tell us that an HMR update is available
var eventSource = new EventSource("stream");
eventSource.onmessage = function (evt) {
    console.log("got message: " + evt.data);
    console.log("pulling new code");
    var myRequest = new Request(serverUrl);
    myRequest.cache = "no-cache";
    fetch(myRequest).then(function (response) {
        console.log(response.status + " " + response.statusText);
        response.text().then(function (value) {
            jsModule.hot.myHotApply();
            delete Elm;
            eval(value)
        })
    })
};

// Expose the Webpack HMR API

var myDisposeCallback = null;

// TODO [kl] or alias it to module if running in Webpack
var jsModule = {
    hot: {
        accept: function () {
            console.log("hot.accept() called")
        },

        dispose: function (callback) {
            console.log("hot.dispose() called; storing callback")
            myDisposeCallback = callback
        },

        data: null,

        // only needed when running without webpack
        // TODO [kl] don't call this if you are running in a webpack environment
        myHotApply: function () {
            console.log("myHotApply()")
            var newData = {}
            myDisposeCallback(newData)
            console.log("storing disposed hot data " + JSON.stringify(newData))
            jsModule.hot.data = newData
        }

    }
}