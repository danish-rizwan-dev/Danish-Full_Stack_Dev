 $("#saveBtn").on("click", function (e) {
    e.preventDefault();

    const position_title = $("#position-title").val();
    const company_name = $("#company-name").val();
    const city = $("#city").val();
    const state = $("#state").val();
    const start_date = $("#start-date").val();
    const end_date = $("#end-date").val();
    const summary = $("#summary").val();

    if (!position_title || !company_name || !city || !state || !start_date || !end_date || !summary) {
      alert("ALL FIELDS ARE REQUIRED");
      return;
    }

    axios({
      method: "post",
      url: "http://localhost:4000/professionalExperience",
      data: {
        position_title: position_title,
        company_name: company_name,
        city: city,
        state: state,
        start_date: start_date,
        end_date: end_date,
        summary: summary
      }
    })
      .then(function (res) {
        console.log("Professional Experience Uploaded Successfully: ", res);
        alert("Professional Experience Uploaded Successfully!");
        $(".nextBtn").removeAttr("disabled");
      })
      .catch(function (err) {
        console.error("Professional Experience Error: ", err);
        alert("Error Occurred while submitting Professional Experience: " + err);
      });
  });

  $(".nextBtn").on("click", function (e) {
    e.preventDefault();
    axios.get("http://localhost:4000/education");
  });
