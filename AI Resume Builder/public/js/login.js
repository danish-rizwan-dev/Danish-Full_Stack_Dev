$(".loginBtn").on("click", function (e) {
    e.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();

    if (!email || !password) {
      $("#login-error").html("Please enter both email and password.").css("color", "red");
      return;
    }
    axios({
      method: "post",
      url: "http://localhost:4000/login",
      data: {
        email: email,
        password: password
      }
    })
    .then(function (res) {
      $("#login-error").html("Login successful! Redirecting...").css("color", "green");
      console.log("Login response:", res);
     setTimeout(function () {
        window.location.href = "http://localhost:4000/dashboard"; 
      },1500);
    })
    .catch(function (error) {
      console.log("Login error:", error);
      if (error.response.data.message) {
        $("#login-error").html(error.response.data.message).css("color", "red");
      } else {
        $("#login-error").html("Login failed. Please try again.").css("color", "red");
      }
    });
  });
