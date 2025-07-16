const toast = $("#liveToast");

$(".createResumeBtn").on("click", async function(e) {
  e.preventDefault();
  const job_title = $("#job-name").val().trim();
  if (!job_title) {
    $(".toast-body").html("Please Enter a Job Title.");
    toast.show();
    setTimeout(function() {
    toast.hide();
  },2000);
   return;
  }
  try {
    console.log("Creating Resume with Job Title:", job_title);
    const res = await axios.post("http://localhost:4000/resume", {
      job_title
    }); 
    console.log("Resume Created Successfully:", res);
    window.location.href = `http://localhost:4000/personalDetails?resume_id=${res.data}`;
  } catch (error) {
    console.error("Error:", error);
    alert("An Error Occurred");
  }
});

$(".deleteResumeBtn").on("click", function(e) {
  e.preventDefault();
  const resume_id = $(this).attr("value");
  axios.delete(`http://localhost:4000/dashboard/deleteResume?resume_id=${resume_id}`)
  .then(function(res) {
  $(".toast-body").html(res.data);
  toast.show();
  setTimeout(function() {
  window.location.reload();
  },1000);
}).catch(function(error) {
    console.log("Error deleting resume:", error);
    $(".toast-body").html("Error While Delteing the Resume.");
    toast.show();
    setTimeout(function() {
    toast.hide();
  },1000);
  })
});
