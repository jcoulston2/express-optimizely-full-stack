const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const optimizelyExpressSdk = require("@optimizely/optimizely-sdk");
const cookieParser = require("cookie-parser");
const { optimizelyBucketMiddleware, optimizelyTemplateMiddleware } = require("./middleware");
const { BASE_PATH, OPT_USER_ID_REF } = require("./constants");

require("dotenv").config();

const optimizelyClient = optimizelyExpressSdk.createInstance({
	sdkKey: process.env.OPT_SDK_ID,
	datafileOptions: {
		autoUpdate: true,
		updateInterval: 600000 // 10 minutes
	}
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(BASE_PATH));
app.use(optimizelyBucketMiddleware());
app.get("/*", optimizelyTemplateMiddleware(optimizelyClient), (req, res) => {
	res.sendFile(BASE_PATH);
});

app.listen(8080, () => {
	console.log(`server is running on 8080`);
});
