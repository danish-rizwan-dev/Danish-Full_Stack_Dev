 $("#saveBtn").on("click", function (e) {
    e.preventDefault();
     const urlParams = new URLSearchParams(window.location.search);
     const resume_id = urlParams.get('resume_id');
    let professionalExperience = [];
    for (let i = 1; i <= count; i++) {
    const position_title = $(`#position-title-${i}`).val();
    const company_name = $(`#company-name-${i}`).val();
    const city = $(`#city-${i}`).val();
    const state = $(`#state-${i}`).val();
    const start_date = $(`#start-date-${i}`).val();
    const end_date = $(`#end-date-${i}`).val();
    const summary = $(`#summary-${i}`).val();
    if (!position_title || !company_name || !city || !state || !start_date || !end_date ) {
    alert(`Skill ${i} is empty.
      ALL FIELDS ARE REQUIRED`);
    return;
    }
    professionalExperience.push({resume_id,position_title ,company_name ,city ,state ,start_date ,end_date ,summary });
  }
  console.log(professionalExperience);

    axios({
      method: "post",
      url: "http://localhost:4000/professionalExperience",
      data: {
        professionalExperience
      }
    })
      .then(function (res) {
        console.log("Professional Experience Uploaded Successfully: ", res);
        alert("Professional Experience Uploaded Successfully!");
        $(".nextBtn").removeAttr("disabled");
        window.location.href = `http://localhost:4000/education?resume_id=${resume_id}`;

      })
      .catch(function (err) {
        console.error("Professional Experience Error: ", err);
        alert("Error Occurred while submitting Professional Experience: " + err);
      });
  });

$(".nextBtn").on("click", function (e) {
    e.preventDefault();
    window.location.href = `http://localhost:4000/education`;

  });

let count = 1;
$("#addBtn").on("click",function(e) {
    e.preventDefault(); 
    count ++;
    let html = `
       <div class="professionalExperience-${count} shadow p-4 mt-4 m" style="border-radius: 16px;">
        <div class="row">
        <label id="skill-${count}" class="text-success">${count}.Professional Experience</label>
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
        <label for="summary">Summary:</label>
        <textarea id="summary-${count}" rows="5" style="padding: 10px; border: 1px solid #c8e6c9; border-radius: 6px; font-size: 16px;"></textarea>
        </div>
        </div>`;
    $(".appendBox").append(html);
})

$(".removeBtn").on("click",function(e) { 
    console.log("remove" + count);
    e.preventDefault(); 
  $(`.professionalExperience-${count}`).remove();
    count --;    
    if(count < 1 ){
        count = 1
    }
})