$(".nextBtn").on("click",function (e) {
  e.preventDefault();
  window.location.href = "http://localhost:4000/skills";
});
let count = 1;
$("#saveBtn").on("click", function (e) {
  e.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const resume_id = urlParams.get("resume_id");
  let educationDetails = [];

  for (let i = 1; i <= count; i++) {
    const institute_name = $(`#institute-name-${i}`).val();
    const degree = $(`#degree-${i}`).val();
    const state = $(`#state-${i}`).val();
    const start_date = $(`#start-date-${i}`).val();
    const end_date = $(`#end-date-${i}`).val();
    const description = $(`#description-${i}`).val();

    if (!institute_name || !degree || !state || !start_date || !end_date) {
      alert(`Education entry ${i} is incomplete. ALL FIELDS ARE REQUIRED.`);
      return;
    }

    educationDetails.push({
      resume_id,
      institute_name,
      degree,
      state,
      start_date,
      end_date,
      description,
    });
  }

  console.log(educationDetails);

  axios({
    method: "post",
    url: "http://localhost:4000/education",
    data: {
      educationDetails,
    },
  })
    .then(function (res) {
      console.log("Education Details Uploaded Successfully: ", res);
      alert("Education Details Uploaded Successfully!");
      $(".nextBtn").removeAttr("disabled");
      window.location.href = `http://localhost:4000/skills?resume_id=${resume_id}`;
    })
    .catch(function (err) {
      console.error("Education Submission Error: ", err);
      alert("Error submitting education details: " + err.message);
    });
});

$("#addBtn").on("click",function(e) {
    e.preventDefault(); 
    count ++;
    let html = `
       <div class="education-${count} shadow p-4 mt-4 m" style="border-radius: 16px;">
        <div class="input-group">
          <label id="skill-${count}" class="text-success">${count}.Education </label>
          <label for="institute-name">Name of Institute:</label>
          <input type="text" id="institute-name-${count}" value="" />
        </div>

        <div class="row">
          <div class="input-group">
            <label for="degree">Degree:</label>
            <input type="text" id="degree-${count}" value="" />
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
          <label for="description">Description:</label>
          <textarea id="description-${count}" rows="5" style="padding: 10px; border: 1px solid #c8e6c9; border-radius: 6px; font-size: 16px;"></textarea>
        </div>
        </div>`;
    $(".appendBox").append(html);
})

$(".removeBtn").on("click",function(e) { 
    console.log("remove" + count);
    e.preventDefault(); 
  $(`.education-${count}`).remove();
    count --;    
    if(count < 1 ){
        count = 1
    }
})