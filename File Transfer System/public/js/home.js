function uploadFile(event) {
    event.preventDefault();
    const files = event.target.imageFile.files;
    const formData = new FormData();
     $("#link").html(" ");
    for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i]); 
    }
    axios({
        method: "POST",
        url: "http://localhost:8000/upload",
        data: formData 
    }).then(function (res) {
        console.log("Upload successful:", res.data);
        $("#link").append(`${res.data}`);
        setTimeout(function() {
            window.location.reload();
        },1000);
    }).catch(function (err) {
      console.error("Upload failed:", err);
     $("#link").append("Upload failed. Try Uploading Again ").css("color", "Red");
    });
};

$(".share-btn").on("click",function(e){
  e.preventDefault();
  console.log(e);
  
  const documentId = $(this).closest('form').find('input[name="document_id"]').val();
  const email = $(this).closest('form').find('input[name="email"]').val();

  console.log("document id:", documentId);
  console.log("Email:", email);

      axios.post("http://localhost:8000/home/share", {
        document_id: documentId,
        email: email
      })
      .then(function (res) {
        alert("File shared successfully.");
        window.location.reload(); 
      })
      .catch(function (err) {
        alert("Sharing failed");
      });
  });

$(".delete-btn").on("click", function(e) {
  e.preventDefault();
  const documentId = $(this).closest('form').find('input[name="delete_id"]').val();

  console.log("document id:", documentId);
  axios.post("http://localhost:8000/delete", {
    document_id: documentId,
  })
  .then(function (res) {
    alert("File deleted successfully.");
    window.location.reload();
  })
  .catch(function (err) {
    console.log("Failed: " + (err.response?.data || err.message));
    alert("An error occurred.");
  });
});



function hideDivs(){
  $("#uploaded-files").hide()
  $("#received-files").hide()
  $("#shared-files").hide()
}
hideDivs();
$("#uploadedBtn").on("click",function(){
  hideDivs();
  $("#uploaded-files").show()
})
$("#receivedBtn").on("click",function(){
  hideDivs();
  $("#received-files").show()
})
$("#sharedBtn").on("click",function(){
  hideDivs();
  $("#shared-files").show()
});