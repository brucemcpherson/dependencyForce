var Infos = (function(infos){
  "use strict";
  
  /**
   * get an extractor object
   * @return {ScriptExtractor} the extractor
   */
   
  infos.initialize = function () {
    infos.dapi = new cDriveJsonApi.DriveJsonApi().setAccessToken(getAccessToken('script'));
    return infos;
  };

  /**
   * @param {string} infoId id of the info.json file
   * @param {string} folderTitle project title for error message
   * @return {object} regular result object
   */
  infos.getInfoContent = function (infoId, folderTitle) {
    return infos.getFileContent (infoId , folderTitle , Settings.ENUMS.FILES.INFO);
  };
  
  /**
   * @param {string}  id of the  file
   * @param {string} folderTitle project title for error message
   * @param {string} fileName
   * @return {object} regular result object
   */
  infos.getFileContent = function (id, folderTitle, fileName) {
    // now get the media content
    var content = infos.dapi.getContentById(id);
    if (!content.success) {
      throw "error getting " + fileName + " content for " + folderTitle + ":" + JSON.stringify(content);
    }
    return content;
  };
  
  /**
   * get all the scripts on drive belonging to me
   * @param {object} e this is what was passed to teh web app
   * @return {object} a standard drivejsonapi result
   */
  infos.getAllTheInfos = function (e) {
    

    var startingFolder = e && e.params && e.params.parameter && e.params.parameter.start ? e.params.parameter.start : Settings.EXTRACT.TO;
    var noCache = e && e.params && e.params.parameter && e.params.parameter.nocache;

    
    // get the folder where the scripts start from
    var scriptRoot = infos.dapi.getFolderFromPath (startingFolder);
    if(!scriptRoot) {
      throw 'could not find starting folder for infos ' + startingFolder;
    }
    
   // we can use cache
    var result,cacheHandler,cached;
    cacheHandler = new cCacheHandler.CacheHandler(Settings.ENUMS.CACHE.EXPIRATION,'dependencyForce',true);    
    
    if (!noCache) { 
      cached = result = cacheHandler.getCache(scriptRoot.id);
    }
    
    if (!result) {
      // get all the info.jsons below this
      result = infos.dapi.getRecursiveChildItems (scriptRoot.id, undefined ,  "title='"+Settings.ENUMS.FILES.INFO+"'");
  
      if (result.success) {
        result.data.content = result.data.items.map (function (d) {
          var r = infos.getInfoContent (d.id, Settings.EXTRACT.TO);
          if (!r.success || !r.data) {
            throw 'failed to get info content for ' + d.id;
          }
          return r.data;
        });
      }
    }    
    if (result.success) {
      cacheHandler.putCache (result,scriptRoot.id);
    }
    result.cached = {hit: cached ? true : false , noCache:noCache}
    return result;

  };
  
  return infos;
  
})(Infos || {});


