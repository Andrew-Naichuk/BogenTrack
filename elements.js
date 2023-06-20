// Global Pool
const allScreens = document.querySelectorAll('section');
const signOutButton = document.querySelector('#signOutBtn');
let currentSelectedSession;

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


// Create Session Screen
const createSessionScreen = document.querySelector('#createSessionScreen');
const createSessionDateField = document.querySelector('#newSessionDate');
const createSessionCommentField = document.querySelector('#newSessionComment');
const saveNewSessionButton = document.querySelector('#saveNewSessionBtn');
const cancelNewSessionButton = document.querySelector('#cancelNewSessionBtn');


// Open Session Screen
const SessionScreen = document.querySelector('#SessionScreen');
const backToSessionListButton = document.querySelector('#backToSessionListBtn');
const createRoundButton = document.querySelector('#createRoundBtn');
const roundsListContainer = document.querySelector('#roundsListContainer');


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