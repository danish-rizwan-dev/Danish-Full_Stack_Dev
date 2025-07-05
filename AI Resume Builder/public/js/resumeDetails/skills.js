let count = 1;
$("#addBtn").on("click",function(e) {
    e.preventDefault(); 
    count ++;
    let html = `
        <div class="skills-${count} shadow p-4 mt-4 m" style="border-radius: 16px;">
        <div class="input-group">   
          <label id="skill-${count}" >${count}.Skill</label>
          <label for="skill-name">Name :</label>
          <input type="text" id="skill-name-${count}" value="" />
        </div>
        <div class="input-group">
          <label for="description">Description:</label>
          <textarea id="description-${count}" rows="5" style="padding: 10px; border: 1px solid #c8e6c9; border-radius: 6px; font-size: 16px;"></textarea>
        </div>
         </div>
        `
    $(".appendBox").append(html);
})

$(".removeBtn").on("click",function(e) { 
     console.log("remove" + count);
    e.preventDefault(); 
  $(`.skills-${count}`).remove();
    count --;    
    if(count < 1 ){
        count = 1
    }
})

$("#saveBtn").on("click", function (e) {
  e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const resume_id = urlParams.get('resume_id');
    console.log("resume id for skills" +resume_id);
  let skills = [];
  for (let i = 1; i <= count; i++) {
    const name = $(`#skill-name-${i}`).val().trim();
    const description = $(`#description-${i}`).val().trim();
    if (!name || !description) {
      alert(`Skill ${i} is empty.`);
      return;
    }
    skills.push({ resume_id, name, description });
  }
  console.log(skills);
  axios.post("http://localhost:4000/skills", { skills })
    .then(function (res) {
      console.log("Skills saved:", res.data);
      $(".nextBtn").removeAttr("disabled");
      window.location.href = `http://localhost:4000/preview?resume_id=${resume_id}`;
    })
    .catch(function (err) {
      console.error("Error saving skills:", err);
      alert("An error occurred while saving skills.");
    });
});

$(".nextBtn").on("click", function (e) {
  e.preventDefault();
    window.location.href = "http://localhost:4000/Preview";
});

