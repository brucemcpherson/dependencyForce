// stuff that get executed from the client but runs on the server

/**
 * this is called to get all the info file data for all known scripts
 * @param {string} start optional path to start looking for info files
 * @return {object[]} the info files
 */
function getData(start) {
  return Server.getInfos(start);
}

/**
 * server based processing
 */
var Server = (function (server) {
  'use strict';
  
  server.getInfos = function (start) {
    return Infos.initialize().getAllTheInfos (start);
  };
  
  return server;
}) (Server || {});
