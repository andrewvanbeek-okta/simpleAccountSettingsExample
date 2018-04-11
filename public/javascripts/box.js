

var boxToken = $.cookie("token");
var folderId = '0';
var username =  $.cookie("user");
  $("#portalUserName").text(username);
      var accessToken = 'abc';
      var contentExplorer = new Box.ContentExplorer();
      contentExplorer.show(folderId, boxToken, {
          container: '#boxExplorer',
          logoUrl: "http://www.ohainvestmentcorporation.com/sites/g/files/knoqqb9991/themes/site/nir_pid922/client/images/OHA_logo_white_sml_RGB.PNG"
      });
