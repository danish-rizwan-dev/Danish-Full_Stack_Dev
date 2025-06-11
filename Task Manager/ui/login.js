$("#login-btn").on("click",function(e){
    e.preventDefault(); 
    const email = $("#email").val();
    const password = $("#password").val();
    axios.post("http://localhost:3000/login",{
        email : email ,
        password : password
    })
    .then(function(res){
        console.log("Login successful:", res);
        $('#errorMessage').html("User Login successfully <br> Redirecting to Home Page...");
        setTimeout(function(){
        window.location.href = './index.html';
        },2000)
    }).catch(function(error){
      if(error.response && error.response.data){
        $('#errorMessage').html(error.response.data.massage);
      }else{
        alert("An error occurred during Login");
      }
    })
})