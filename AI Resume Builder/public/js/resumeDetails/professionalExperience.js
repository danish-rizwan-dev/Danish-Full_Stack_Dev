const toast = $("#liveToast");
$("#saveBtn").on("click", function (e) {
  e.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const resume_id = urlParams.get("resume_id");
  let professionalExperience = [];

  for (let i = 1; i <= count; i++) {
    const position_title = $(`#position-title-${i}`).val().trim();
    const company_name = $(`#company-name-${i}`).val().trim();
    const city = $(`#city-${i}`).val().trim();
    const state = $(`#state-${i}`).val().trim();
    const start_date = $(`#start-date-${i}`).val();
    const end_date = $(`#end-date-${i}`).val();
    const summary = $(`#summary-${i}`).val().trim();

    if (
      !position_title ||
      !company_name ||
      !city ||
      !state ||
      !start_date ||
      !end_date
    ) {
      alert(`Skill ${i} is empty.
      ALL FIELDS ARE REQUIRED`);
      return;
    }
    professionalExperience.push({
      resume_id,
      position_title,
      company_name,
      city,
      state,
      start_date,
      end_date,
      summary,
    });
  }
  console.log(professionalExperience);

  axios({
    method: "post",
    url: "http://localhost:4000/professionalExperience",
    data: {
      professionalExperience,
    },
  })
    .then(function (res) {
      console.log("Professional Experience Uploaded Successfully: ", res);
      $(".toast-body").html(res.data);
      toast.show();
      setTimeout(function () {
        window.location.href = `http://localhost:4000/education?resume_id=${resume_id}`;
      }, 1000);
    })
    .catch(function (err) {
      console.error("Professional Experience Error: ", err);
      alert("Error Occurred while submitting Professional Experience: " + err);
    });
});

$(".previousBtn").on("click", function (e) {
  e.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const resume_id = urlParams.get("resume_id");
  window.location.href = `http://localhost:4000/personalDetails?resume_id=${resume_id}`;
});

let count = $(".professionalExperience").length;
$("#addBtn").on("click", function (e) {
  e.preventDefault();
  count++;
  let html = `
    <div class="professionalExperience shadow p-4 mt-4 m" style="border-radius: 16px;">
      <div class="row">
        <label class="text-success">${count}.Professional Experience</label>
        <div class="input-group"> 
            <label for="position-title">Position Title:</label>
            <input type="text" id="position-title-${count}" value="" />
        </div>
        <div class="input-group">
            <label for="company-name">Company Name:</label>
            <input type="text" id="company-name-${count}" value="" />
        </div>
      </div>

      <div class="row">
        <div class="input-group">
            <label for="city">City:</label>
            <input type="text" id="city-${count}" value="" />
        </div>
        <div class="input-group">
            <label for="state">State:</label>
            <input type="text" id="state-${count}" value="" />
        </div>
      </div>

      <div class="row">
        <div class="input-group">
            <label for="start-date">Start Date:</label>
            <input type="date" id="start-date-${count}" placeholder="dd-mm-yyyy" />
        </div>
        <div class="input-group">
            <label for="end-date">End Date:</label>
            <input type="date" id="end-date-${count}" placeholder="dd-mm-yyyy" />
        </div>
      </div>

      <div class="input-group">
            <div class="d-flex justify-content-between " style="justify-content: space-between;">
              <label class="mt-2">Summary:</label>
              <button class="btn btn-success btn-sm mb-2 mt-1 genAi" value="${count}">Generate from AI ✨</button>
            </div>
            <textarea id="summary-${count}" rows="5" style="
                  padding: 10px;
                  border: 1px solid #c8e6c9;
                  border-radius: 6px;
                  font-size: 16px;
                "></textarea>
     </div>
     </div>
     `;
     
  $(".appendBox").append(html);
});

$(".removeBtn").on("click", function (e) {
  e.preventDefault();
  if (count > 1) {
    $(`.professionalExperience`).last().remove();
    count--;
  }
});

$(document).on("click", ".genAi", function (e) {
  e.preventDefault();
  const i = $(this).attr("value");
  const position_title = $(`#position-title-${i}`).val().trim();
  const company_name = $(`#company-name-${i}`).val().trim();
  const city = $(`#city-${i}`).val().trim();
  const state = $(`#state-${i}`).val().trim();
  const start_date = $(`#start-date-${i}`).val();
  const end_date = $(`#end-date-${i}`).val();
  const summary = $(`#summary-${i}`).val();

  if (
    !position_title ||
    !company_name ||
    !city ||
    !state ||
    !start_date ||
    !end_date
  ) {
    alert("All Fields Are Required of " + [i] + ".Professional Exprinece");
    return;
  }
  $(".toast-body").html("Wait while AI is getting your summary....");
  toast.show();

  axios
    .post("http://localhost:4000/genAI/experience", {
      position_title,
      company_name,
      city,
      state,
      start_date,
      end_date,
      summary,
    })
    .then(function (res) {
      console.log("Gen AI response : " + res.data);
      $(`#summary-${i}`).html("");
      $(`#summary-${i}`).html(res.data.message);
      $(".toast-body").html("Summery is generated successfully");
      setTimeout(function () {
        toast.hide();
      }, 1000);
    })
    .catch(function (err) {
      $(".toast-body").html(err.data.message).css("color", "red");
      setTimeout(function () {
        toast.hide();
      }, 1000);
      console.log("Gen AI Error : " + err);
    });
});
