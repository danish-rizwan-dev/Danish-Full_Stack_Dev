const toast = $("#liveToast");
$("#saveBtn").on("click", function (e) {
  e.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const resume_id = urlParams.get('resume_id');
  const first_name = $("#first-name").val();
  const last_name = $("#last-name").val();
  const job_title = $("#job-title").val();
  const address = $("#address").val();
  const phone = $("#phone").val();
  const email = $("#email").val();

  if (!resume_id||!first_name || !last_name || !job_title || !address || !phone || !email) {
    alert("ALL FIELD ARE REQUIRED");
    return;
  }

  let name = first_name.trim() + " " + last_name.trim();
  axios({
    method: "post",
    url: "http://localhost:4000/personalDetails",
    data: {
      resume_id : resume_id,
      name: name,
      job_title: job_title,
      address: address,
      phone: phone,
      email: email,
    },
  })
    .then(function (res) {
      console.log("Personal Details Uploaded Successfully: " + resume_id);
      console.log(res.data);
      $(".toast-body").html(res.data.message);
      toast.show();
      setTimeout(function(){
         window.location.href = `http://localhost:4000/ProfessionalExperience?resume_id=${resume_id}`;
      },1000)
    })
    .catch(function (err) {
      console.log("Personal Details Error Occurred: " + err);
      alert("Error Occurred while Personal Details : " + err);
    });
});
