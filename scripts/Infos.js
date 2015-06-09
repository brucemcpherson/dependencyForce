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
   * @param {string} startingFolder optional starting folder
   * @return {object} a standard drivejsonapi result
   */
  infos.getAllTheInfos = function (startingFolder) {
    
    // get the folder where the scripts start from
    var scriptRoot = infos.dapi.getFolderFromPath (startingFolder || Settings.EXTRACT.TO);
    
   // we can use cache
    var cacheHandler = new cCacheHandler.CacheHandler(120,'dependencyForce',true);
    var cached = cacheHandler.getCache(scriptRoot.id);
    if (cached) return cached;

    
    if(!scriptRoot) {
      throw 'could not find starting folder for infos ' + Settings.EXTRACT.TO;
    }
    
    // get all the info.jsons below this
    var result = infos.dapi.getRecursiveChildItems (scriptRoot.id, undefined ,  "title='"+Settings.ENUMS.FILES.INFO+"'");

    if (result.success) {
      result.data.content = result.data.items.map (function (d) {
        var r = infos.getInfoContent (d.id, Settings.EXTRACT.TO);
        if (!r.success || !r.data) {
          throw 'failed to get info content for ' + d.id;
        }
        return r.data;
      });
    }
        
    cacheHandler.putCache (result,scriptRoot.id);
    return result;

  };
  
  return infos;
  
})(Infos || {});


