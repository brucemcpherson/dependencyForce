/**
 * becoming a little defunct
 * but here for backwards compat
 */
function getLibraryInfo () {

  return { 
    info: {
      name:'dependencyForce',
      version:'0.0.1',
      key:"MbsyWJdAy58-9R9Up5xxJIqi_d-phDA33",
      description:'visualize extracted source dependencies',
      share:'https://script.google.com/d/192CBDKMfUok6kNTN7XJwr_Oy9dln2ZnsBf_CWJ_FBPfUY-VAmjqhIF4I/edit?usp=sharing'
    },
    dependencies:[
      cUseful.getLibraryInfo(),
      cUrlResult.getLibraryInfo(),
      cEzyOauth2.getLibraryInfo(),
      cDriveJsonApi.getLibraryInfo()
    ]
  }; 
}


function showMyScriptAppResource(s) {
  try {
    return ScriptApp.getResource(s);
  }
  catch (err) {
    throw err + " getting script " + s;
  }
}
