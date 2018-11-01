/**
 * runs every now and again to keep cache fresh
 */
function triggerCache () {
  return Infos.initialize().getAllTheInfos();
}
/**
 * trigger once a day
 */
function triggerNoCache () {
  return Infos.initialize().getAllTheInfos({parameter:{nocache:1}});
}
/**
 * this is your main processing - will be called with your access token
 * @param {string} accessToken - the accessToken
 */
function doSomething (accessToken, e) {

  var index = HtmlService.createTemplateFromFile('index.html')
      .evaluate()
      .getContent();

  var html =  
    HtmlService.createTemplate(index + "<script>\ndoIt(" +
      JSON.stringify({
        "params":e,
      }) +
      ");\n</script>")
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('Dependency force')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);      

  return html;

}
