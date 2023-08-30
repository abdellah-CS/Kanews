const express = require("express");
const request = require("request");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {

    // Get data from the signup form
    const firstName = req.body.first;
    const lastName = req.body.last;
    const email = req.body.email;

    // the object data contains members which is in the structure you provided is specific to Mailchimp's API
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }              
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    
    // the url should contain the last numbers in the API key and the list id in the end of the url
    const url = "https://us21.api.mailchimp.com/3.0/lists/2bbc4171ad";

    const options = {
        method: "POST",
        auth: "Abdellah5:139696e7d8e895801f8f3bd6a711cfc0-us21"
    }

    const request = https.request(url, options, function(response) {
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000.");
});

//API key: 139696e7d8e895801f8f3bd6a711cfc0-us21
// list id: 2bbc4171ad