// ## ZONES JS ROUTE ##
// ## All code by Yoni Harris ##

// ## Description: Backend script which uses Socket.IO to send and receive
// ## data to populate datatables from PostgreSQL DB through routes

// PACKAGES
const express = require('express');
const pool = require('../db');
const router = express.Router();

// LOCAL MODULES
const updateZonesData = require('../local_modules/updateZonesData.js');
const authenticationMiddleware = require('../local_modules/authenticationMiddleware');
const socketApi = require('../local_modules/socketApi.js');
const systemConfig = require ('../config/systemConfig.json');

// VARIABLES
const io = socketApi.io;
const languageConfig = require (`../locales/${systemConfig.clientLanguage}.json`);

// ## SOCKET DATA ##

io.on('connection', function(socket){

  updateZonesData(socket)

  // ## FORM ACTIONS

  // NEW FORM
  socket.on('newZoneModal', function(data, socketId){

    var q_data = `SELECT public."fn_AddZone"('${systemConfig.application_name}', '${data.zone}','${data.status}', '${data.user}','${data.type}')`;
    
    pool.query(q_data, (err, res) => {
        if (err){ console.log(err); emitFailure(err.message) }
        else { console.log('success'); io.emit("update table zones"); emitSuccess(languageConfig.successMessage) }
    });

    function emitSuccess(poolMsg) { io.to(`${socketId}`).emit("success message", {msg: poolMsg}) }
    function emitFailure(poolMsg) { io.to(`${socketId}`).emit("danger message", {msg: poolMsg}) }
  }); // end emit

  // EDIT FORM
  socket.on('editZoneModal', function(data, socketId){

    var q_data = `SELECT public."fn_EditZone"('${systemConfig.application_name}', '${data.current_zone_id}','${data.zone_id}','${data.zone}','${data.status}', '${data.user}','${data.type}')`;

    pool.query(q_data, (err, res) => {
        if (err){ console.log(err); emitFailure(err.message) }
        else { console.log('success'); io.emit("update table zones"); emitSuccess(languageConfig.successMessage) }
    });

    function emitSuccess(poolMsg) { io.to(`${socketId}`).emit("success message", {msg: poolMsg}) }
    function emitFailure(poolMsg) { io.to(`${socketId}`).emit("danger message", {msg: poolMsg}) }
  }); // end emit

  // EDIT MULTIPLE FORM
  socket.on('editZonesModal', function(data, socketId){

    var current_ids = data.current_zone_id.split(",");
    var form_ids = data.zone_id.split(",");

    var q_data = '';
    for (var i=0;i<form_ids.length;i++){
      q_data += `SELECT public."fn_EditZone"('${systemConfig.application_name}', '${current_ids[i]}','${form_ids[i]}','${data.zone}','${data.status}', '${data.user}','${data.type}');`;
    }

    pool.query(q_data, (err, res) => {
        if (err){ console.log(err); emitFailure(err.message) }
        else { console.log('success'); io.emit("update table zones"); emitSuccess(languageConfig.successMessage) }
    });

    function emitSuccess(poolMsg) { io.to(`${socketId}`).emit("success message", {msg: poolMsg}) }
    function emitFailure(poolMsg) { io.to(`${socketId}`).emit("danger message", {msg: poolMsg}) }
  }); // end emit

}); // end io

// ## PAGES ##

// zones page
router.get('/zones', authenticationMiddleware(), function(request, response){

  // profile authentication
  if (request.user.profile_id == 1 || request.user.profile_id == 2){
    response.render('zones', { full_name: request.user.full_name, user_id: request.user.user_id, user_photo: request.user.photo, profile_id: request.user.profile_id });
  }else{
    response.redirect('/unauth')
  }

});

// Data route for datatables
router.get('/zones_data', authenticationMiddleware(), function(request, response, next){

  var q_data = `SELECT * FROM public."vw_Zones"`

  pool.query(q_data, (err, res) => {
    if (err) return console.log(err);
      response.send( { data: res.rows } )
    });
});

module.exports = router;
