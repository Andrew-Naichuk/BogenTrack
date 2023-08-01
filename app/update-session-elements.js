// Page elements:
const toastContainer = document.querySelector('#toastContainer');
const updateSessionScreen = document.querySelector('#updateSessionScreen');

const sessionCardColorPickers = document.querySelectorAll('.colorTile');
const updateSessionDateField = document.querySelector('#updateSessionDate');
const updateSessionDistanceField = document.querySelector('#updateSessionDistance');
const updateSessionConfigField = document.querySelector('#updateSessionConfig');
const updateSessionCommentField = document.querySelector('#updateSessionComment');
const updateSessionTotalGoalField = document.querySelector('#updateSessionTotalGoal');
const updateSessionAverageGoalField = document.querySelector('#updateSessionAverageGoal');

const saveUpdatedSessionButton = document.querySelector('#saveUpdatedSessionBtn');
const cancelUpdatedSessionButton = document.querySelector('#cancelUpdatedSessionBtn');
const deleteSessionModalButton = document.querySelector('#deleteSessionModalBtn');
const confirmDeleteSessionModal = document.querySelector('#confirmDeleteSessionModal');
const deleteSessionButton = document.querySelector('#deleteSessionBtn');
const cancelDeleteSessionButton = document.querySelector('#cancelDeleteSessionBtn');

// Page service variables:
let sessionCardColor;