/**
* client stuff that's specific to the type server
*/
var Client = (function(client) {

  client.getData = function () {

    spinCursor();
    
    google.script.run
    .withFailureHandler(function(error) {
   
        App.showNotification ("data retrieval error", error);
        resetCursor();
    })
    .withSuccessHandler(function(result){
    
        resetCursor();
        D3Force.initialize(result.data.content).render();
    })
    .getData();
  };
  
  function resetCursor() {
    Utils.el ('spinner').style.display = "none";
    
  }
  function spinCursor() {
    Utils.el ('spinner').style.display = "block";
  }
  
  return client;
  
})(Client || {});

