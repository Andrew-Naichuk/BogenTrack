// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const providerGoogle = new firebase.auth.GoogleAuthProvider();
const analytics = firebase.analytics();

// Auth status observer
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        updatePageOnAuth();
    } else {
        let redirectLocation = loadedLocation + '/app/signin.html'
        window.location.replace(redirectLocation);
    }
});


// Page content handler
async function updatePageOnAuth(){
    showLoading();
    await getSessionsSnapshot();
    isLoading = false;
    updateSessionsChart();
    updateShotsChart();
};


// Sessions stats chart functionality
function updateSessionsChart () {
    // Preparing arrays for chart visualization
    let sessionsNames = [];
    let sessionsScores = [];

    sessionsSnapshot.forEach (session => {
        // Filtering only live sessions with some scores
        if (session.status === 'live' && session.rounds.length > 0) {
            // Populating x-axis array with date
            sessionsNames.push(session.date);
            // Calculating average result of session
            let sessionTotalScore = 0;
            let sessionArrowsNumber = 0;
            session.rounds.forEach(round => {
                // Filtering only live rounds within session
                if (!round.status || round.status === 'live') {
                    sessionArrowsNumber = sessionArrowsNumber + round.arrows.length;
                    round.arrows.forEach(arrow => {
                    sessionTotalScore = sessionTotalScore + Number(arrow);
                });
                };
            });
            // Populating y-axis array with session average result
            sessionsScores.push(sessionTotalScore / sessionArrowsNumber);
        };
    });
    
    // E-Charts Rendering
    const chart = echarts.init(document.getElementById('sessionsChart'));
    window.addEventListener('resize', function() {
        chart.resize();
    });
    let option = {
        xAxis: {
          type: 'category',
          data: sessionsNames
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: sessionsScores,
            type: 'line',
            smooth: true,
            sampling: 'lttb',
        itemStyle: {
            color: '#0D99FF'
        },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
                offset: 0,
                color: '#7AC7FF'
            },
            {
                offset: 1,
                color: 'rgba(122, 199, 255, 0.3)'
            }
            ])
        }
          }
        ]
      };
    chart.setOption(option);
};


// Shots Scores Distribution Chart Functionality
function updateShotsChart () {
    // Preparing object of arrows scores
    let scoresDistribution = {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
        "10": 0,
    };
    sessionsSnapshot.forEach (session => {
        // Filtering only live sessions with some scores
        if (session.status === 'live' && session.rounds.length > 0) {
            session.rounds.forEach(round => {
                // Filtering only live rounds within session
                if (!round.status || round.status === 'live') {
                    // Counting the amount of arrows of each score
                    round.arrows.forEach(arrow => {
                        if (Number(arrow) === 0) {
                            scoresDistribution[0] = ++scoresDistribution[0];
                        };
                        if (Number(arrow) === 1) {
                            scoresDistribution[1] = ++scoresDistribution[1];
                        };
                        if (Number(arrow) === 2) {
                            scoresDistribution[2] = ++scoresDistribution[2];
                        };
                        if (Number(arrow) === 3) {
                            scoresDistribution[3] = ++scoresDistribution[3];
                        };
                        if (Number(arrow) === 4) {
                            scoresDistribution[4] = ++scoresDistribution[4];
                        };
                        if (Number(arrow) === 5) {
                            scoresDistribution[5] = ++scoresDistribution[5];
                        };
                        if (Number(arrow) === 6) {
                            scoresDistribution[6] = ++scoresDistribution[6];
                        };
                        if (Number(arrow) === 7) {
                            scoresDistribution[7] = ++scoresDistribution[7];
                        };
                        if (Number(arrow) === 8) {
                            scoresDistribution[8] = ++scoresDistribution[8];
                        };
                        if (Number(arrow) === 9) {
                            scoresDistribution[9] = ++scoresDistribution[9];
                        };
                        if (Number(arrow) === 10) {
                            scoresDistribution[10] = ++scoresDistribution[10];
                        };
                    })
                }
            })
        }
    });
    // E-Charts Rendering
    const chart = echarts.init(document.getElementById('shotsChart'));
    window.addEventListener('resize', function() {
        chart.resize();
    });
    let option = {
        xAxis: {
          type: 'category',
          data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [scoresDistribution[0], scoresDistribution[1], scoresDistribution[2], scoresDistribution[3], scoresDistribution[4], scoresDistribution[5], scoresDistribution[6], scoresDistribution[7], scoresDistribution[8], scoresDistribution[9], scoresDistribution[10]],
            type: 'bar',
        itemStyle: {
            color: '#61B0FF'
        },
          }
        ]
      };
    chart.setOption(option);
};