const { BASE_PATH } = require("./constants");
const path = require("path");
const { experimentTemplateMapping } = require("./experiment-template-config");

// Only find one experiment for now
module.exports.getActiveExperiments = path => {
  return experimentTemplateMapping.find(experiment => {
    return path === experiment.path;
  });
};
