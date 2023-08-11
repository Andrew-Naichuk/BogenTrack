// Initial location prescription:
const loadedLocation = window.location.origin;

// Global Pool
let userPreferences;
let currentSelectedSession;
let currentSelectedRound;
let sessionsSnapshot;
let isLoading = true;
let appScreen = document.querySelector('body');

const iconsBundle = {
    counter: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="#ABAEB1" d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m0 2v12h7V6H4m16 12V6h-1.24c.24.54.19 1.07.19 1.13c-.07.67-.54 1.37-.71 1.62l-2.33 2.55l3.32-.02l.01 1.22l-5.2-.03l-.04-1s3.05-3.23 3.2-3.52c.14-.28.71-1.95-.7-1.95c-1.23.05-1.09 1.3-1.09 1.3l-1.54.01s.01-.66.38-1.31H13v12h2.58l-.01-.86l.97-.01s.91-.16.92-1.05c.04-1-.81-1-.96-1c-.13 0-1.07.05-1.07.87h-1.52s.04-2.06 2.59-2.06c2.6 0 2.46 2.02 2.46 2.02s.04 1.25-1.11 1.72l.52.37H20M8.92 16h-1.5v-5.8l-1.8.56V9.53l3.14-1.12h.16V16Z"/></svg>',
    arrows: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#ABAEB1" d="m19 16l3 3l-2 1l-1 2l-3-3v-1.94l-4-4l-4 4V19l-3 3l-1-2l-2-1l3-3h1.94l4-4l-5.97-5.97L4 7L2 2l5 2l-.97.97L12 10.94l5.97-5.97L17 4l5-2l-2 5l-.97-.97L13.06 12l4 4H19Z"/></svg>',
    target: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#ABAEB1" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10c0-1.16-.21-2.31-.61-3.39l-1.6 1.6c.14.59.21 1.19.21 1.79a8 8 0 0 1-8 8a8 8 0 0 1-8-8a8 8 0 0 1 8-8c.6 0 1.2.07 1.79.21L15.4 2.6C14.31 2.21 13.16 2 12 2m7 0l-4 4v1.5l-2.55 2.55C12.3 10 12.15 10 12 10a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2c0-.15 0-.3-.05-.45L16.5 9H18l4-4h-3V2m-7 4a6 6 0 0 0-6 6a6 6 0 0 0 6 6a6 6 0 0 0 6-6h-2a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4V6Z"/></svg>',
    repeat: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#ABAEB1" d="m19 8l-4 4h3a6 6 0 0 1-6 6c-1 0-1.97-.25-2.8-.7l-1.46 1.46A7.93 7.93 0 0 0 12 20a8 8 0 0 0 8-8h3M6 12a6 6 0 0 1 6-6c1 0 1.97.25 2.8.7l1.46-1.46A7.93 7.93 0 0 0 12 4a8 8 0 0 0-8 8H1l4 4l4-4"/></svg>',
    user: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="#ABAEB1" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2M7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.5.88 4.93 1.78A7.893 7.893 0 0 1 12 20c-1.86 0-3.57-.64-4.93-1.72m11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33A7.928 7.928 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.5-1.64 4.83M12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6m0 5a1.5 1.5 0 0 1-1.5-1.5A1.5 1.5 0 0 1 12 8a1.5 1.5 0 0 1 1.5 1.5A1.5 1.5 0 0 1 12 11Z"/></svg>',
    google: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#ABAEB1" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"/></svg>',
    box: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#ABAEB1" d="M2 10.96a.985.985 0 0 1-.37-1.37L3.13 7c.11-.2.28-.34.47-.42l7.83-4.4c.16-.12.36-.18.57-.18c.21 0 .41.06.57.18l7.9 4.44c.19.1.35.26.44.46l1.45 2.52c.28.48.11 1.09-.36 1.36l-1 .58v4.96c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18c-.21 0-.41-.06-.57-.18l-7.9-4.44A.991.991 0 0 1 3 16.5v-5.54c-.3.17-.68.18-1 0m10-6.81v6.7l5.96-3.35L12 4.15M5 15.91l6 3.38v-6.71L5 9.21v6.7m14 0v-3.22l-5 2.9c-.33.18-.7.17-1 .01v3.69l6-3.38m-5.15-2.55l6.28-3.63l-.58-1.01l-6.28 3.63l.58 1.01Z"/></svg>',
    bow: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="#ABAEB1" d="M19.03 6.03L20 7l2-5l-5 2l.97.97l-1.82 1.82C10.87 2.16 3.3 3.94 2.97 4L2 4.26l.5 1.94l.79-.2l6.83 6.82L6.94 16H5l-3 3l2 1l1 2l3-3v-1.94l3.18-3.18L18 20.71l-.19.79l1.93.5l.26-.97c.06-.33 1.84-7.9-2.79-13.18l1.82-1.82M4.5 5.78c2.05-.28 6.78-.5 10.23 2.43l-3.91 3.91L4.5 5.78M18.22 19.5l-6.34-6.32l3.91-3.91c2.93 3.45 2.71 8.18 2.43 10.23Z"/></svg>',
    distance: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M1.27441 16.83L2.89691 15.2167L4.19858 16.5L5.17025 15.5375L3.86858 14.245L5.17025 12.9433L7.43441 15.2167L8.40608 14.245L6.14191 11.9717L7.43441 10.6792L8.73608 11.9717L9.70775 11L8.40608 9.7075L9.70775 8.40584L11.9719 10.6792L12.9436 9.7075L10.6794 7.43417L11.9719 6.14167L13.2644 7.43417L14.2452 6.4625L12.9436 5.17L14.2452 3.86834L16.5002 6.14167L17.4811 5.17L15.2169 2.89667L16.8302 1.27417L20.7261 5.17L5.17025 20.7258L1.27441 16.83Z" fill="#ABAEB1"/></svg>',
    sum: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M16.5 5.49996H8.09417L13.5942 11L8.09417 16.5H16.5V18.3333H5.5V16.5L11 11L5.5 5.49996V3.66663H16.5V5.49996Z" fill="#ABAEB1"/></svg>',
    average: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M3.1125 16.095L4.1025 14.685C3.28575 13.98 2.63051 13.1073 2.18141 12.1262C1.73231 11.1452 1.4999 10.0789 1.5 8.99998C1.5 7.01086 2.29018 5.1032 3.6967 3.69668C5.10322 2.29016 7.01088 1.49998 9 1.49998C10.335 1.49998 11.58 1.84498 12.6675 2.45248L13.6575 1.04248L14.8875 1.90498L13.8975 3.31498C15.4875 4.69498 16.5 6.72748 16.5 8.99998C16.5 10.9891 15.7098 12.8968 14.3033 14.3033C12.8968 15.7098 10.9891 16.5 9 16.5C7.665 16.5 6.42 16.155 5.3325 15.5475L4.3425 16.9575L3.1125 16.095ZM9 2.99998C7.4087 2.99998 5.88258 3.63212 4.75736 4.75734C3.63214 5.88256 3 7.40868 3 8.99998C3 10.7625 3.75 12.345 4.9725 13.4475L11.7975 3.68998C10.9358 3.2339 9.97499 2.99693 9 2.99998ZM9 15C10.5913 15 12.1174 14.3678 13.2426 13.2426C14.3679 12.1174 15 10.5913 15 8.99998C15 7.23748 14.25 5.65498 13.0275 4.55248L6.2025 14.31C7.035 14.7525 7.9875 15 9 15Z" fill="#ABAEB1"/></svg>',

};

// Web app's Firebase configuration:
const firebaseConfig = {
    apiKey: "AIzaSyAHY-cawV60DzQIbS21E7atrU6BAdyVtGg",
    authDomain: "bogentrack.firebaseapp.com",
    projectId: "bogentrack",
    storageBucket: "bogentrack.appspot.com",
    messagingSenderId: "673595653369",
    appId: "1:673595653369:web:06cef8e7e7e4d4dfbf7628",
    measurementId: "G-QR4TSG9K78"
};


// Global functions


// Showing loading state
function showLoading(){
    let loadInterval;
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loadingScreen';
    loadingScreen.innerHTML = `
        <h3 class="accented">Loading...</h3>
    `
    appScreen.appendChild(loadingScreen);

    loadInterval = setInterval(()=>{
        // Loading screen will be shown on top of the page content
        // till the moment global state isLoading is switched to false
        // within the code this function is used in
        if (isLoading === true) {
            loadingScreen.classList.add('loadingActive');
        } else {
            clearInterval(loadInterval);
            loadingScreen.classList.remove('loadingActive');
        }
    }, 10);
};


// Getting Sessions Snapshot From Database
async function getSessionsSnapshot(){
    // Reference to specific document in the database
    const docRef = db.collection("btUsers").doc(auth.currentUser.uid);
    try {
        // Trying to fetch data from the document
        const doc = await docRef.get();
        if (doc.exists) {
            // Updating snapshot to the latest state
            sessionsSnapshot = doc.data().sessions;
        }
    } catch (error) {
        window.alert(error);
    }
};


// Generating UUIDs
function generateUID() {
    // Get the current timestamp in milliseconds
    const timestamp = Date.now();

    // Generate a random number between 0 and 99999
    const random = Math.floor(Math.random() * 100000);

    // Combine the timestamp and random number to create a unique identifier (UID)
    const uid = `${timestamp}-${random}`;

    // Return the generated UID
    return uid;
};


// Generating toast message
function createToastMessage (type, message) {
    const newToast = document.createElement('div');
    newToast.classList.add('toastMessage');
    newToast.classList.add('fadeIn');
    if (type === 'success') {
        newToast.classList.add('success');
    }
    if (type === 'fail') {
        newToast.classList.add('fail');
    }
    newToast.innerHTML = `
    <h5>${message}</h5>
    `;
    toastContainer.appendChild(newToast);
    setTimeout(function(){
        newToast.classList.remove('fadeIn');
        newToast.classList.add('fadeOut');
        setTimeout(function(){
            toastContainer.removeChild(newToast);
        }, 400)
    }, 2000);
};


// Generating current date
function getCurrentDate(){
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;

    let dayString = day.toString();
    let monthString = month.toString();

    if (dayString.length < 2) {
        day = '0' + dayString;
    };
    if ( monthString.length < 2) {
        month = '0' + monthString;
    };
    let year = date.getFullYear();
    let currentDate = `${year}-${month}-${day}`;
    return currentDate;
};


// Generating current time
function getCurrentTime(){
    const time = new Date();
    let hours = time.getHours();
    let minutes = time.getMinutes();

    let hoursString = hours.toString();
    let minutesString = minutes.toString();

    if (hoursString.length < 2) {
        hoursString = '0' + hoursString;
    };
    if (minutesString.length < 2) {
        minutesString = '0' + minutesString;
    };
    let currentTime = hoursString + ':' + minutesString;
    return currentTime;
};