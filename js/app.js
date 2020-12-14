// ---------------------
// VARIABLES
// ---------------------
const employees = document.getElementById('employee')
const wait = document.getElementById('wait-container')

// ---------------------
//  FETCH FUNCTIONS
// ---------------------
    fetchData('https://randomuser.me/api/?results=12');



// ---------------------
//  HELPER FUNCTIONS
// ---------------------

async function fetchData(url) {
    let i = 0;
    wait.innerHTML="LOADING..."
    await fetch(url)
        .then(data => data.json()) // parse the data to json
        .then(obj => obj.results)
        .then(result => console.log(result))
        // .then(result => result[0]);
        .catch(err => console.log(err));
    wait.style.display="none";
}

function generateHTML(obj) {
    const html = `
            <div class=card>
                <img src=${obj.picture.large} alt="">
                <div class="employee-details">
                    <h2>${obj.name.first} ${employee.name.last}</h2>
                    <p>${obj.email}</p>
                    <p>${obj.location.city}
                </div>
            </div>
        `
        employees.innerHTML = html;
}

