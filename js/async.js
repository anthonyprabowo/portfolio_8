// ---------------------
// VARIABLES
// ---------------------
const employees = document.getElementById('employee-container')
const wait = document.getElementById('wait-container')
const employeesArray = [];
const employeesDetailArray = [];
const modalClose = document.querySelector(".close");
const cards = document.getElementsByClassName("card");
const modalContainer = document.getElementById("modal-container");
const modalContent = document.querySelector('.modal-content').children;
const modal = document.querySelector('.modal-content');
const nextArrow = document.getElementById('next-arrow');
const backArrow = document.getElementById('back-arrow');
let modalClicked = 0;

// ---------------------
//  FETCH FUNCTIONS
// ---------------------


fetchData('https://randomuser.me/api');

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
    wait.innerHTML="LOADING..."
    for(let i = 0; i < 12; i++){
        await fetch(url)
            .then(response => checkStatus(response))
            .then(data => data.json()) // parse the data to json
            .then(obj => obj.results)
            .then(results => results[0])
            .then(employee => {
                generateHTML(employee);
                employeesDetailArray.push(employee);
            })
            .catch(err => {
                wait.innerHTML = "Something Went Wrong! :(";
                console.log(err);
            });
    }
    // if everything sucessfully load 
    if(wait.innerHTML === "LOADING..."){
        wait.style.display="none";
        displayHTML();
        employees.style.display = '';
        modalEventListener();
    }
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
    employees.style.display = 'none';
    let htmlBuilder = ''
    for(let i = 0; i < employeesArray.length; i++) {
        htmlBuilder += employeesArray[i];
    }
    employees.innerHTML = htmlBuilder;
}

function createModal(num) {
    const employeesDetail = employeesDetailArray[num]
    const birthday = employeesDetail.dob.date.toString();
    modalContainer.style.display = 'block';
    modalContent[1].src = employeesDetail.picture.large;
    modalContent[2].innerHTML = `${employeesDetail.name.first} ${employeesDetail.name.last}`;
    modalContent[3].innerHTML = `${employeesDetail.email}`;
    modalContent[4].innerHTML = `${employeesDetail.location.city}`;
    modalContent[6].innerHTML = `${employeesDetail.phone}`;
    modalContent[7].innerHTML = `${employeesDetail.location.street.number} ${employeesDetail.location.street.name}, ${employeesDetail.location.state} ${employeesDetail.location.postcode}`
    modalContent[8].innerHTML = `Birthday: ${birthday.substring(5,7)}/${birthday.substring(8,10)}/${birthday.substring(0,4)}`;
}

// ---------------------
//  EVENT LISTENER
// ---------------------

function modalEventListener() {
    for(let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click', () => {
            modal.style.animation = 'pull-down .3s ease-in-out forwards';
            createModal(i);
            modalClicked = i;
        })
    }
}

// When the user clicks the x button
modalClose.addEventListener('click', () => {
    modal.style.animation = 'pull-up .3s ease-in-out forwards';
    setTimeout(() => modalContainer.style.display = 'none', 300);

})

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modalContainer) {
        modal.style.animation = 'pull-up .3s ease-in-out forwards';
        setTimeout(() => modalContainer.style.display = 'none', 300);
    }
}

// When the user clicks the next button on modal
nextArrow.addEventListener('click', () => {
    setTimeout(() => {
        // if the last modal is clicked, clicking the next arrow will return to number 0
        if(modalClicked === 11){
            modalClicked = 0;
        } else { // else, increase the modal number by 1
            modalClicked += 1;
        }
        createModal(modalClicked);
    }, 500);
    modal.style.animation = 'slide-right 1s ease-in-out forwards';
    setTimeout(() => modal.style.animation = 'none', 1000);
})

backArrow.addEventListener('click', () => {
    setTimeout(() => {
        if(modalClicked === 0) {
            modalClicked = 11;
        } else {
            modalClicked -= 1;
        }
        createModal(modalClicked);
    }, 500);
    modal.style.animation = 'slide-left 1s ease-in-out forwards';
    setTimeout(() => modal.style.animation = 'none', 1000);
})


