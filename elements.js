// Global Pool
const allScreens = document.querySelectorAll('section');
let currentSelectedSession;
let sessionsSnapshot;
let arrowsNumber = 6;


const iconsBundle = {
    counter: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="#ABAEB1" d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m0 2v12h7V6H4m16 12V6h-1.24c.24.54.19 1.07.19 1.13c-.07.67-.54 1.37-.71 1.62l-2.33 2.55l3.32-.02l.01 1.22l-5.2-.03l-.04-1s3.05-3.23 3.2-3.52c.14-.28.71-1.95-.7-1.95c-1.23.05-1.09 1.3-1.09 1.3l-1.54.01s.01-.66.38-1.31H13v12h2.58l-.01-.86l.97-.01s.91-.16.92-1.05c.04-1-.81-1-.96-1c-.13 0-1.07.05-1.07.87h-1.52s.04-2.06 2.59-2.06c2.6 0 2.46 2.02 2.46 2.02s.04 1.25-1.11 1.72l.52.37H20M8.92 16h-1.5v-5.8l-1.8.56V9.53l3.14-1.12h.16V16Z"/></svg>',
    arrows: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="#ABAEB1" d="m19 16l3 3l-2 1l-1 2l-3-3v-1.94l-4-4l-4 4V19l-3 3l-1-2l-2-1l3-3h1.94l4-4l-5.97-5.97L4 7L2 2l5 2l-.97.97L12 10.94l5.97-5.97L17 4l5-2l-2 5l-.97-.97L13.06 12l4 4H19Z"/></svg>',
    target: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="#ABAEB1" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10c0-1.16-.21-2.31-.61-3.39l-1.6 1.6c.14.59.21 1.19.21 1.79a8 8 0 0 1-8 8a8 8 0 0 1-8-8a8 8 0 0 1 8-8c.6 0 1.2.07 1.79.21L15.4 2.6C14.31 2.21 13.16 2 12 2m7 0l-4 4v1.5l-2.55 2.55C12.3 10 12.15 10 12 10a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2c0-.15 0-.3-.05-.45L16.5 9H18l4-4h-3V2m-7 4a6 6 0 0 0-6 6a6 6 0 0 0 6 6a6 6 0 0 0 6-6h-2a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4V6Z"/></svg>',
    repeat: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="#ABAEB1" d="m19 8l-4 4h3a6 6 0 0 1-6 6c-1 0-1.97-.25-2.8-.7l-1.46 1.46A7.93 7.93 0 0 0 12 20a8 8 0 0 0 8-8h3M6 12a6 6 0 0 1 6-6c1 0 1.97.25 2.8.7l1.46-1.46A7.93 7.93 0 0 0 12 4a8 8 0 0 0-8 8H1l4 4l4-4"/></svg>',
    user: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="#abaeb1" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2M7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.5.88 4.93 1.78A7.893 7.893 0 0 1 12 20c-1.86 0-3.57-.64-4.93-1.72m11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33A7.928 7.928 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.5-1.64 4.83M12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6m0 5a1.5 1.5 0 0 1-1.5-1.5A1.5 1.5 0 0 1 12 8a1.5 1.5 0 0 1 1.5 1.5A1.5 1.5 0 0 1 12 11Z"/></svg>',

}

// It's important for screen variable name and its id in html to be the same 
// since logic of show-hide screen function relies on it so hard.


// Entry Screen
const entryScreen = document.querySelector('#entryScreen');
// ---- Login Form
const logInForm = document.querySelector('#loginForm');
const logInEmailField = document.querySelector('#loginEmail');
const logInPasswordField = document.querySelector('#loginPassword');
const logInButton = document.querySelector('#mainLoginBtn');
const logInGoogleButton = document.querySelector('#googleLoginBtn');
const toSignUpForm = document.querySelector('#toSignUpBtn');
// ---- Sign Up Form
const signUpForm = document.querySelector('#signupForm');
const signUpemailField = document.querySelector('#signupEmail');
const signUppasswordField = document.querySelector('#signupPassword');
const signUpButton = document.querySelector('#mainSignupBtn');
const toLogInForm = document.querySelector('#toLoginBtn');


// Sessions List Screen
const sessionsListScreen = document.querySelector('#sessionsListScreen');
const sessionsListContainer = document.querySelector('#sessionsListContainer');
const createSessionButton = document.querySelector('#createSessionBtn');
const profileButton = document.querySelector('#profileBtn');


// Create Session Screen
const createSessionScreen = document.querySelector('#createSessionScreen');
const createSessionDateField = document.querySelector('#newSessionDate');
const createSessionDistanceField = document.querySelector('#newSessionDistance');
const createSessionCommentField = document.querySelector('#newSessionComment');
const saveNewSessionButton = document.querySelector('#saveNewSessionBtn');
const cancelNewSessionButton = document.querySelector('#cancelNewSessionBtn');


// Update Session Screen
const updateSessionScreen = document.querySelector('#updateSessionScreen');
const updateSessionDateField = document.querySelector('#updateSessionDate');
const updateSessionDistanceField = document.querySelector('#updateSessionDistance');
const updateSessionCommentField = document.querySelector('#updateSessionComment');
const saveUpdatedSessionButton = document.querySelector('#saveUpdatedSessionBtn');
const cancelUpdatedSessionButton = document.querySelector('#cancelUpdatedSessionBtn');
const deleteSessionModalButton = document.querySelector('#deleteSessionModalBtn');
const confirmDeleteSessionModal = document.querySelector('#confirmDeleteSessionModal');
const deleteSessionButton = document.querySelector('#deleteSessionBtn');
const cancelDeleteSessionButton = document.querySelector('#cancelDeleteSessionBtn');


// Open Session Screen
const SessionScreen = document.querySelector('#SessionScreen');
const sessionNameIndicator = document.querySelector('#SessionName');
const backToSessionListButton = document.querySelector('#backToSessionListBtn');
const createRoundButton = document.querySelector('#createRoundBtn');
const roundsListContainer = document.querySelector('#roundsListContainer');
const editSessionButton = document.querySelector('#editSessionBtn');


// Create Round Screen
const createRoundScreen = document.querySelector('#createRoundScreen');
const saveNewRoundButton = document.querySelector('#saveNewRoundBtn');
const cancelNewRoundButton = document.querySelector('#cancelNewRoundBtn');
const arrowsCounter = document.querySelector('#arrowsCount');
const removeArrowButton = document.querySelector('#removeArrowBtn');
const addArrowButton = document.querySelector('#addArrowBtn');
const arrowsScoreList = document.querySelector('#arrowsScoreList');
const createRoundTimeField = document.querySelector('#newRoundTime');
const createRoundCommentField = document.querySelector('#newRoundComment');


// Profile Screen
const profileScreen = document.querySelector('#profileScreen');
const backHomeButton = document.querySelector('#backHomeBtn');
const signOutButton = document.querySelector('#signOutBtn');
const userEmailIndicator = document.querySelector('#currentUserEmail');
const userSessionsIndicator = document.querySelector('#currentNumberOfSessions');