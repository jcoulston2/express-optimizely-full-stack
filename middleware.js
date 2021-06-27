const { OPT_USER_ID_REF } = require("./constants");
const { getVariationTemplate, getActiveExperiments } = require("./utils");
const { experimentTemplateMapping } = require("./experiment-template-config");
const path = require("path");
const uuid = require("uuid");

module.exports.optimizelyBucketMiddleware = () => (req, res, next) => {
	const optUserId = req.cookies[OPT_USER_ID_REF];
	if (!optUserId) {
		const assignableOptUserId = uuid.v4();
		res.cookie(OPT_USER_ID_REF, assignableOptUserId);
		req.optCookieKey = assignableOptUserId;
	}

	next();
};

module.exports.optimizelyTemplateMiddleware = (optimizelyClient) => (req, res, next) => {
	optimizelyClient.onReady().then(() => {
		const optUserId = Object.keys(req.cookies).length
			? req.cookies[OPT_USER_ID_REF]
			: req.optCookieKey;
		const user = optimizelyClient.createUserContext(optUserId);

		// Just one for now (POC)
		const experiment = getActiveExperiments(req.path);

		if (experiment) {
			const decision = user && user.decide(experiment.name);
			const variantKey = (decision && decision.variationKey) || null;
			const variantPath = experiment[variantKey];
			const variantTemplate = path.join(__dirname, `./templates/${variantPath}.html`);

			if (variantTemplate) {
				res.sendFile(variantTemplate);
			} else {
				next();
			}
		} else {
			// No active experiment for the given path name found
			next();
		}
	});
};
