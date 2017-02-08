axios.get('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(function (response){
        console.log(response.data.data);
    })
    .catch(function (error) {
        console.log(error);
    });