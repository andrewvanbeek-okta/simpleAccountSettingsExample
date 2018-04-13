signIn.session.get(function (res) {
  $("#portalUserName").text(res.login)
  console.log("yeah yeah yeah")
  if (res.status === 'ACTIVE') {
    console.log(res)
    $("#send").on("submit", function(e){
      e.preventDefault()
      var data = {oldPassword: $("#oldpass").val(), newPassword: $("#newpass").val(), userId: res.userId}
      $("#oldpass").val('')
      $("#newpass").val('')
      $.ajax({
        url: '/changePassword',
        type: 'GET',
        dataType: 'json',
        data: data
      }).done(function(data) {
        console.log("success");
        window.alert("User Created!")
      }).always(function(data) {
        console.log("complete");
        window.alert("Password Reset")
      });
    })

    $("#mfaReset").on("submit", function(e){
      console.log("test")
      e.preventDefault()
      var data = {userId: res.userId}
      $.ajax({
        url: '/resetMfa',
        type: 'GET',
        dataType: 'json',
        data: data
      }).done(function(data) {
        console.log("success");
        window.location.href = "https://vanbeektech.okta.com/home/bookmark/0oa6orxqao3CCY5sS1t7/2557"
      }).always(function(data) {
        console.log("complete");
        window.location.href = "https://vanbeektech.okta.com/home/bookmark/0oa6orxqao3CCY5sS1t7/2557"
      });
    })
  }
});
