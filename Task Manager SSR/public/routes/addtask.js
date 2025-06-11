  $("#taskForm").on("submit", function(e) {
    e.preventDefault();

    const title = $("#title").val();
    const description = $("#description").val();
    const email = $("#email").val();
    const imgLink = $("#imgLink").val();

    axios.post("http://localhost:8000/addtask", {
      title,
      description,
      email,
      imgLink
    })
    .then(function(res) {
      alert("Task added successfully!");
      window.location.href = "http://localhost:8000/dashboard";
    })
    .catch(function(error) {
      console.log("an error occurred",error);
    });
  });
