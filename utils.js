const { BASE_PATH } = require("./constants");
const path = require("path");

const experimentTemplateMapping = {
	next_poc: {
		path: "/",
		variation_1: "variant-one",
		variation_2: "variant-two"
	}
};

module.exports.getVariationTemplate = (expName, variantKey) => {
	try {
		if (variantKey && expName) {
			const templateName = experimentTemplateMapping[expName][variantKey];
			return path.join(__dirname, `./templates/${templateName}.html`);
		}
	} catch (err) {
		console.log(err);
	}

	return null;
};
