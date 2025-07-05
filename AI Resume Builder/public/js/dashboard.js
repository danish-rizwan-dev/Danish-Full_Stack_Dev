$(".createResumeBtn").on("click", async function(e) {
  e.preventDefault();
  const job_title = $("#job-name").val().trim();

  if (!job_title) {
    alert("Enter Job Title");
    return;
  }

  try {
    const res = await axios.post("http://localhost:4000/resume", {
      job_title
    }); 
    console.log("Resume Created Successfully:", res);
    window.location.href = `http://localhost:4000/personal?resume_id=${res.data}`;
  } catch (error) {
    console.error("Error:", error);
    alert("An Error Occurred");
  }
});

// $(".details-card .view-btn").on("click", function (e) {
//   e.preventDefault();
//   const resumeId = $(this).closest(".details-card").data("resume-id");
// });