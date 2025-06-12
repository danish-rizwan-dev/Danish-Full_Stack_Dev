$("#saveBtn").on("click", function (e) {
  e.preventDefault();

  const first_name = $("#first-name").val();
  const last_name = $("#last-name").val();
  const job_title = $("#job-title").val();
  const address = $("#address").val();
  const phone = $("#phone").val();
  const email = $("#email").val();

  if (!first_name || !last_name || !job_title || !address || !phone || !email) {
    alert("ALL FIELD ARE REQUIRED");
    return;
  }

  let name = first_name + " " + last_name;
  axios({
    method: "post",
    url: "http://localhost:4000/personalDetails",
    data: {
      name: name,
      job_title: job_title,
      address: address,
      phone: phone,
      email: email,
    },
  })
    .then(function (res) {
      console.log("Personal Details Uploaded Successfully: " + res);
      alert("Personal Details Uploaded Successfully: ");
      $(".nextBtn").removeAttr("disabled");
    })
    .catch(function (err) {
      console.log("Personal Details Error Occurred: " + err);
      alert("Error Occurred while Personal Details : " + err);
    });
});

$(".nextBtn").submit(function (e) {
  e.preventDefault();
  axios.get("http://localhost:4000/ProfessionalExperience");
});
