
/**
 * this is your main processing - will be called with your access token
 * @param {string} accessToken - the accessToken
 */
function doSomething (accessToken) {
 
  return HtmlService.createTemplateFromFile('index.html')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('Library Tree');

}
