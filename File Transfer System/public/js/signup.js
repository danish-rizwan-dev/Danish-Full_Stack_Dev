$("#signupbtn").on("click",function(e){

    e.preventDefault();
    const name = $("#name").val();
    const email = $("#email").val();
    const password = $("#password").val();
    const confirm_password = $("#confirm-password").val();
    $("#error-message").html("");

    if (!name || !email || !password || !confirm_password) {
      $("#error-message").html("All fields are required!").css("color", "red");
       return;
    }
    if (password !== confirm_password) {
    $("#error-message").html("Passwords do not match!").css("color", "red");
    return;
    }
    
    axios({
    method: "POST",
    url: "http://localhost:8000/signup",
    data: {
      name : name , 
      email : email,
      password :password
    }
  }).then(function(res){
    $("#error-message").html("SignUp SuccessFull... <br> Redircting to Login page....").css("color", "blue");
    console.log("User Registerd Successfully :",res); 
    setTimeout(function() {
            window.location.href = "http://localhost:8000/login";
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