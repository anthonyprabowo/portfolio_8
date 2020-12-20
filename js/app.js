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
const search = document.getElementById('search');
const names = document.getElementsByClassName('name');
let modalDisplayed = [];
let visited = 0;
let modalClicked = 0;
let index = 0;



// ---------------------
//  FETCH FUNCTIONS
// ---------------------

fetchData('https://randomuser.me/api/?results=12');



// ---------------------
//  HELPER FUNCTIONS
// ---------------------

function checkStatus(response) {
    if(response.ok === true) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}


async function fetchData(url) {
    wait.innerHTML="LOADING..."
    await fetch(url)
        .then(response => checkStatus(response))
        .then(data => data.json()) // parse the data to json
        .then(obj => obj.results)
        .then(result => {
            for(let i = 0; i < 12; i++) {
                generateHTML(result[i])
                employeesDetailArray.push(result[i]);
                employeesDetailArray[i].display = true;
            }
            displayHTML();
        })
        .catch(err => {
            wait.innerHTML = "Something Went Wrong! :(";
            console.log(err);
        });
    modalEventListener();
    if(wait.innerHTML === "LOADING..."){
        wait.style.display="none";
    }
}

function generateHTML(obj) {
    const html = `
            <div class="card">
                <div id="employee">
                    <img src=${obj.picture.large} alt="">
                    <div class="employee-details">
                        <h2 class="name">${obj.name.first} ${obj.name.last}</h2>
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

function findIndex() {
    for(let i = 0; i < modalDisplayed.length; i++) {
        if(modalDisplayed[i] === visited){
            index = i;
            break;
        } else {
            // continue
        }
    }
}

// ---------------------
//  EVENT LISTENER
// ---------------------

function populateModalDisplayed() {
    modalDisplayed = [];
    for(let i = 0; i < 12; i++) {
        if(employeesDetailArray[i].display) {
            modalDisplayed.push(i);
        } else {
            // do nothing
        }
    }
}

function modalEventListener() {
    for(let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click', () => {
            modal.style.animation = 'pull-down .3s ease-in-out forwards';
            createModal(i);
            visited = i;
            populateModalDisplayed();
        })
    }
}

// When the user clicks the x button
modalClose.addEventListener('click', () => {
    modal.style.animation = 'pull-up .3s ease-in-out forwards';
    setTimeout(() => modalContainer.style.display = 'none', 300);

});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modalContainer) {
        modal.style.animation = 'pull-up .3s ease-in-out forwards';
        setTimeout(() => modalContainer.style.display = 'none', 300);
    }
}

// When the user clicks the next button on modal
nextArrow.addEventListener('click', () => {
    findIndex();
    setTimeout(() => {
        for(let i = 0; i < 12; i++){
            if(modalDisplayed[index+1] === visited){
                createModal(visited);
                break;
            } else if(visited === modalDisplayed[modalDisplayed.length-1]) {
                visited = 0;
                index = -1;
            } else {
                visited++;
            }
        }
    }, 250);
    modal.style.animation = 'slide-right 0.5s ease-in-out forwards';
    setTimeout(() => modal.style.animation = 'none', 500);
})

backArrow.addEventListener('click', () => {
    findIndex();
    setTimeout(() => {
        for(let i = 0; i < 12; i++){
            if(modalDisplayed[index-1] === visited){
                createModal(visited);
                break;
            } else if(visited === modalDisplayed[0]) {
                visited = modalDisplayed[modalDisplayed.length-1];
                index = modalDisplayed.length;
            } else {
                visited--;
            }
        }
    }, 250);
    modal.style.animation = 'slide-left 0.5s ease-in-out forwards';
    setTimeout(() => modal.style.animation = 'none', 500);
})

search.addEventListener('keyup', () => {
    for(let i = 0; i < names.length; i++){
        if(search.value === '') {
            cards[i].style.display = '';
            employeesDetailArray[i].display = true;
            populateModalDisplayed();
        } else if(names[i].innerHTML.toLowerCase().includes(search.value.toLowerCase())) {
            cards[i].style.display = '';
            employeesDetailArray[i].display = true;
            populateModalDisplayed();
        } else {
            cards[i].style.display = 'none';
            employeesDetailArray[i].display = false;
            populateModalDisplayed();
        }
    }
});