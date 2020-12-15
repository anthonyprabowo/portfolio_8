// ---------------------
// VARIABLES
// ---------------------
const employees = document.getElementById('employee-container')
const wait = document.getElementById('wait-container')
const employeesArray = [];

// ---------------------
//  FETCH FUNCTIONS
// ---------------------

fetchData('https://randomuser.me/api')


    



// ---------------------
//  HELPER FUNCTIONS
// ---------------------

function checkStatus(response) {
    if(response.ok === true) {
        return Promise.resolve(response);
    } else {
        wait.innerHTML = "Something went wrong! :(";
        return Promise.reject(new Error(response.statusText));
    }
}

async function fetchData(url) {
    wait.innerHTML = 'LOADING...'
    for(let i = 0; i < 12; i++){
        await fetch(url)
                .then(response => checkStatus(response))
                .then(data => data.json())
                .then(obj => obj.results)
                .then(results => results[0])
                .then(employee => generateHTML(employee));
    }
    await displayHTML();
    wait.style.display = 'none';
}

function generateHTML(obj) {
    const html = `
        <div class="card">
            <div id="employee">
                <img src=${obj.picture.large} alt="">
                <div class="employee-details">
                    <h2>${obj.name.first} ${obj.name.last}</h2>
                    <p>${obj.email}</p>
                    <p>${obj.location.city}
                </div>
            </div>
        </div>
        `
    employeesArray.push(html);
}

function displayHTML() {
    let htmlBuilder = ''
    for(let i = 0; i < employeesArray.length; i++) {
        htmlBuilder += employeesArray[i];
    }
    employees.innerHTML = htmlBuilder;
}


