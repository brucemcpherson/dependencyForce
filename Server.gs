// stuff that get executed from the client but runs on the server

/**
 * this is called to get all the info file data for all known scripts
 * @param {object} params this is what was passed to the the webapp
 * @return {object[]} the info files
 */
function getData(params) {
  return Server.getInfos(params);
}

/**
 * server based processing
 */
var Server = (function (server) {
  'use strict';
  
  server.getInfos = function (params) {
    return Infos.initialize().getAllTheInfos (params);
  };
  
  return server;
}) (Server || {});
