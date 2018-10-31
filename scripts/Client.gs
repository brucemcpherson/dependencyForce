/**
* client stuff that's specific to the type server
*/
var Client = (function(client) {

  client.getData = function (params) {

    spinCursor();
    
    google.script.run
    .withFailureHandler(function(error) {
   
        App.showNotification ("data retrieval error", error);
        resetCursor();
    })
    .withSuccessHandler(function(result){
    
        resetCursor();
        resetCacheMark(result);
        D3Force.initialize(result.data.content).render();
    })
    .getData(params);
  };
  
  function resetCacheMark(result) {
    Utils.el('cached').style.display = result.cached.hit ? 'block' : 'none';
  }
  function resetCursor() {
    Utils.el ('spinner').style.display = "none";
    
  }
  function spinCursor() {
    Utils.el ('spinner').style.display = "block";
  }
  
  return client;
  
})(Client || {});

