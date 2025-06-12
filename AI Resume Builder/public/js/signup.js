$(".signupBtn").on("click",function(e){
     e.preventDefault();
     console.log("hello from js")
      const name = $("#name").val();
      const email = $("#email").val();
      const password = $("#password").val();
      const confirmPassword = $("#confirmPassword").val();

      if (password !== confirmPassword) {
         $("#error").html("Passwords do not match.").css("color","red");
        return;
      }
      axios({
        method : "post",
        url : "http://localhost:4000/signup",
        data : {
            name : name ,
            email : email,
            password : password
        }
      }).then(function(res){
        $("#error").html("Account Created SuccessFully... <br> Redircting to Login page....").css("color", "green");
        console.log("User LoggedIn Successfully :",res); 
        setTimeout(function() {
            window.location.href="http://localhost:4000/login";
        }, 1000);
      }).catch(function(err) {
        if(error.response && error.response.data){
        console.log("Error Massage :",error); 
        $("#error-message").html(error.response.data.message).css("color", "Red");
      }else{
        alert("An error occurred during Signup");
      }
      })
});