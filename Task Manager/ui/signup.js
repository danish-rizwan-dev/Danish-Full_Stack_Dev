$("#signupBtn").click(function () {
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
    .post("http://localhost:3000/signup", {
      username: username,
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
    })
    .then(function (res) {
      console.log("Signup successful:", res);
      alert("User registered successfully");
      window.location.href = './login.html';
    })
    .catch(function (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred during signup");
      }
    });
});
