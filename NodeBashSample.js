// ## readerStatus ##
// ## All code by Yoni Harris ##

// refresh RF system if detected lock on table and reader shutdown

// PACKAGES
const pool = require('../db');
const sh = require('shelljs');

// LOCAL MODULES
const startSystem = require('./startSystem');
const systemConfig = require ('../config/systemConfig.json');

// VARIABLES
const instanceCount = systemConfig.instanceCount;

module.exports = function refreshReader(location) {

    // grab number of instances running for MonsoonReader not including itself i.e []
    const { stdout, stderr, code } = sh.exec('ps aux | grep [M]onsoonReader -c', { silent: true })
    var count = parseInt(stdout)
    
    if (instanceCount != count ){
      console.log('READER OFF - RESTART ALL READERS!')
      startSystem(location)
    }

} // END module export
