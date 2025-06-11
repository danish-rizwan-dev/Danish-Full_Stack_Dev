

async function getTasks() {
  try {
    let response = await axios.get("http://localhost:3000/tasks");
    let arr = response.data;
   console.log(arr);
    let html = '';
    arr.forEach(function (item) {
      html += `
        <div class="task mb-5 mt-5 ">
          <h3>${item.title}</h3>
          <p>${item.discription}</p>
          <button onclick="editTask(${item.id})" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#editTaskModal">Edit</button>
          <button onclick="deleteTask(${item.id})" class="btn btn-danger ">Delete</button> 
        </div>
        <hr>
      `;
    });
    
    
    document.getElementById("main").innerHTML = html;
  } catch (err) {
    console.log("error in js ",err);
    console.log(err.response.data.massage);
  }
}

async function deleteTask(id) {
  try {
    await axios.delete("http://localhost:3000/tasks", { data: { task_id: id } });
    console.log("Task deleted");
    getTasks();
  } catch (err) {
    console.error("Error deleting task", err);
  }
}

async function addTask() {
  const title = $("#taskTitle").val();
  const description = $("#taskDescription").val();
  console.log(description);
  const date = $("#Date").val();

  try {
    let response = await axios.post("http://localhost:3000/tasks", {
      task_title: title,
      task_description: description,
      taskCreated_at: date
    });
    console.log(response.data);
  } catch (err) {
    console.error("Error adding task", err);
  }  
}

$("#saveTask").on("click", function(event) {
  event.preventDefault();
  addTask();
  alert("Task Added Succesfully");
});

$("#AddtaskButton").on("click", function() {
  hideAllSections();
  $("#add").show();
});

$("#ShowtaskButton").on("click", function() {
  getTasks();
  hideAllSections();
  $("#allItems").show();
});

function hideAllSections() {
  $("#add, #allItems, #Upcoming, #Past, #deleted, #homepage").hide();
}

$("#homePageButton").on("click", function() {
  hideAllSections();
  $("#homepage").show();
});

$(document).ready(function() {
  getTasks();}
)

