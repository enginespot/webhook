var argv, exec, http, items, webhook;
http = require("http");
exec = require("child_process").exec;
argv = process.argv;
if (argv.length < 3) {
    console.log("Usage: node app.js <ConfigFile>\n");
    return;
}
webhook = require("./" + argv[2]);
items = webhook.items;
http.createServer(function (req, res) {
    var postData;
    postData = "";
    req.setEncoding("utf8");
    req.addListener("data", function (data) {
        postData += data;
    });
    req.addListener("end", function () {
        var item, payload, script;
        payload = JSON.parse(postData);
        for (item in items) {
            if (item.repo === payload.repository.url && "refs/heads/" + item.branch === payload.ref) {
                script = "./";
                script += item.script;
                exec(script, function (error, stdout, stderr) {
                    console.log(error, stdout, stderr);
                });
            }
        }
    });
}).listen(webhook.bind, "127.0.0.1");
