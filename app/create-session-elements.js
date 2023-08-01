// Page elements:
const toastContainer = document.querySelector('#toastContainer');
const createSessionScreen = document.querySelector('#createSessionScreen');

const sessionCardColorPickers = document.querySelectorAll('.colorTile');
const createSessionDateField = document.querySelector('#newSessionDate');
const createSessionDistanceField = document.querySelector('#newSessionDistance');
const createSessionCommentField = document.querySelector('#newSessionComment');
const newSessionConfigField = document.querySelector('#newSessionConfig');
const newSessionTotalGoalField = document.querySelector('#newSessionTotalGoal');
const newSessionAverageGoalField = document.querySelector('#newSessionAverageGoal');

const saveNewSessionButton = document.querySelector('#saveNewSessionBtn');
const cancelNewSessionButton = document.querySelector('#cancelNewSessionBtn');

// Page service variables:
let sessionCardColor = 'white';