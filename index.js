// javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: 'https://test-bank-95dd2-default-rtdb.europe-west1.firebasedatabase.app/',
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const postInDB = ref(database, 'posts');


const inputField = document.querySelector('.input-field');
const publishBtn = document.querySelector('.btn');
const list = document.querySelector('.ul');
const fromInputField = document.querySelector('.from-input');
const toInputField = document.querySelector('.to-input');
const likeBtn = document.querySelector('.like-icon');


// Create List El
const createLiEl = function (array) {
    const itemID = array[0];
    const value = array[1]; 

    const newLiEl = document.createElement('li');

    newLiEl.innerHTML = `
        <p>To ${value.inputValueTo}</p> 
        <p>${value.inputValuePost}</p> 
        <div class="icon-container">
        <p>From ${value.inputValueFrom}</p>
        </div>
    `;
    newLiEl.addEventListener('click', function () {
        const exactLocationOfItemInDB = ref(database, `posts/${itemID}`)
        // console.log(exactLocationOfItemInDB);
        remove(exactLocationOfItemInDB);
    })
    
    const firstLi = list.firstChild; // Das erste Element in der Liste

    if (firstLi) {
        list.insertBefore(newLiEl, firstLi); // Füge das neue Element vor das erste Element ein
    } else {
        list.appendChild(newLiEl); // Wenn die Liste leer ist, füge es einfach hinzu
    }
}

// Clear Input Field
const clearInputField = function (obj) {
    inputField.value = '';
    fromInputField.value = '';
    toInputField.value = '';
}

// Clear List Field
const clearListField = function () {
    list.innerHTML = '';
}

onValue(postInDB, function (snapshot) {
    if (snapshot.exists()) {
        clearListField();
        let itemsArray = Object.entries(snapshot.val())
        itemsArray.forEach(item =>{
            const newItemsArray = item
            createLiEl(newItemsArray);
        })


    } else {
        list.innerHTML = "No items here... yet"
    }
})


// Publish
publishBtn.addEventListener('click', function () {
    const inputValues = {
        inputValuePost: '',
        inputValueFrom: '',
        inputValueTo: '',
        likes: 0,
    };

    inputValues.inputValuePost = inputField.value;
    inputValues.inputValueFrom = fromInputField.value;
    inputValues.inputValueTo = toInputField.value;


    if (!inputValues.inputValuePost || !inputValues.inputValueFrom || !inputValues.inputValueTo) return;

    push(postInDB, inputValues)

    clearInputField();
})

// Code for Like Fn
// <div style="display: flex; gap: 2px; align-items: center;">
// <svg class="like-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
// <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
// </svg>
// <span style="font-weight: 600;">1</span>
// </div>