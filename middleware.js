const { OPT_USER_ID_REF } = require("./constants");
const { getVariationTemplate } = require("./utils");

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

		const decision = user && user.decide("next_poc");
		const variantKey = (decision && decision.variationKey) || null;

		const variantTemplate = getVariationTemplate("next_poc", variantKey);

		res.sendFile(variantTemplate);
	});

	// next();
};
