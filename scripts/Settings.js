var Settings = (function(settings) {
  "use strict";

  settings.ENUMS = {
    
    TYPES: {  // extensiona to apply to script types
      server_js:"js",  
      html:"html"
    },
    
    FIELDS: {  // partial response fields to return based on query
      SCRIPT: "items(id)",
      PROJECT: "id,title,createdDate,modifiedDate,version,exportLinks",
      FEED: "",
      ROOT: "id",
      CHILDREN: "items(id)",
      PARENTS: "items(id)"
    },
    
    FILES: {
      README:'README.md',
      INFO:'info.json',
      DEPENDENCIES:'dependencies.md'
    }
    
  };

  settings.EXTRACT = {
    TO:"/Extraction/Scripts"
  };
  

  return settings;
  
})(Settings || {});
