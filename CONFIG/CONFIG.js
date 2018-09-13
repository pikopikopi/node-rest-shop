const DEV_CONFIG = require('./DEV_CONFIG.JS');
// const PRD_CONFIG = require('./PRD_CONFIG.JS');

const BASE_CONFIG = {};

const CONFIG = Object.assign(BASE_CONFIG, DEV_CONFIG);

module.exports = CONFIG;
