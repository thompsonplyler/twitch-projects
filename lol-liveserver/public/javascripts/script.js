const button = document.getElementById("button")

const getData = async()=>{


fetch("https://localhost:2999/liveclientdata/allgamedata")
  .then(response => {
    response.text()
    console.log(response)  
  })
  .then(result => console.log("Result:",result))
  .catch(error => console.log('error', error));
    
}

button.addEventListener('click',getData)

