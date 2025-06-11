$("#loginbtn").on("click",function(e){
    e.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();
    $("#error-message").html("");

    if ( !email || !password) {
      $("#error-message").html("All fields are required!").css("color", "red");
       return;
    }    console.log("User LoggedIn Successfully :"); 

    axios({
    method: "POST",
    url: "http://localhost:8000/login",
    data: {
      email : email,
      password :password
    }
  }).then(function(res){
    $("#error-message").html("LoggedIn SuccessFully... <br> Redircting to Home page....").css("color", "blue");
    console.log("User LoggedIn Successfully :",res); 
    setTimeout(function() {
            window.location.href = "http://localhost:8000/home";
        }, 1000);
  }).catch(function(error){
      if(error.response && error.response.data){
        console.log("Error Massage :",error); 
        $("#error-message").html(error.response.data.message).css("color", "Red");
      }else{
        alert("An error occurred during Login");
      }
    })
});