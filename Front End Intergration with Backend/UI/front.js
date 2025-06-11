document.querySelector(".btn").addEventListener('click' , function(){
       axios.get('http://localhost:3000/random-name')
       .then(function(response){
        console.log(response.data);
        document.querySelector(".display").innerHTML = response.data;
       })
       .catch(function (err) {
        console.log(err);
      });
} )
