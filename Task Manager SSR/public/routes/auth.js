$("#signupBtn").on("click",function(){
  const username = $("#username").val();
  const first_name = $("#first-name").val();
  const last_name = $("#last-name").val();
  const email = $("#email").val();
  const password = $("#password").val();
  const confirm_password = $("#confirm-password").val();

  if (password !== confirm_password) {
    alert("incorrect password");
    return;
  }
  if (!first_name) {
    alert("First Name is required");
    return;
  }
  if (!last_name) {
    alert("Last Name is required");
    return;
  }
  if (!email) {
    alert("Email is required");
    return;
  }
  if (!password) {
    alert("Password is required");
    return;
  }

  axios
    .post("http://localhost:8000/signup", {
      username: username,
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
    })
    .then(function (res) {
      console.log("Signup successful:", res);
      alert("User registered successfully");
      window.location.href = 'http://localhost:8000/login';
    })
    .catch(function (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred during signup");
      }
    });
});

$("#login-btn").on("click",function(e){
    const email = $("#email").val();
    const password = $("#password").val();
    axios.post("http://localhost:8000/signin",{
        email : email ,
        password : password
    })
    .then(function(res){
        console.log("Login successful:", res);
        $('#errorMessage').html("User Login successfully <br> Redirecting to Home Page...");
        setTimeout(function(){
        window.location.href = 'http://localhost:8000/dashboard';
        },2000)
    }).catch(function(error){
      if(error.response && error.response.data){
        $('#errorMessage').html(error.response.data.massage);
      }else{
        alert("An error occurred during Login");
      }
    })
});