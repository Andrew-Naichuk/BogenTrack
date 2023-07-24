// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const providerGoogle = new firebase.auth.GoogleAuthProvider();
const analytics = firebase.analytics();

// Auth status observer
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        getSessionsSnapshot();
        setTimeout(function(){
            updateRoundsChart();
            updateShotsChart();
        }, 400);
    } else {
        let redirectLocation = loadedLocation + '/app/signin.html'
        window.location.replace(redirectLocation);
    }
});


// Back to session navigation
closeSessionStatsButton.addEventListener('click', function(){
    let redirectLocation = loadedLocation + '/app/session.html?' + window.location.search.replace('?','');
    window.location.href = redirectLocation;
});


// Rounds stats chart functionality
function updateRoundsChart () {
    // Preparing arrays for chart visualization
    let roundsNames = [];
    let roundsScores = [];
    sessionsSnapshot.forEach (session => {
        // Filtering only selected session
        if (session.uid === window.location.search.replace('?','')) {
            session.rounds.forEach(round => {
                // Filtering only live rounds
                if (!round.status || round.status === 'live') {
                    // Populating x-axis array with round time
                    roundsNames.push(round.time);
                    // Calculating average result of round
                    let roundTotalScore = 0;
                    round.arrows.forEach(arrow => {
                        roundTotalScore = roundTotalScore + Number(arrow);
                    });
                    // Populating y-axis array with round average result
                    roundsScores.push(roundTotalScore / round.arrows.length)
                };
            });
        };
    });
    
    // E-Charts Rendering
    const chart = echarts.init(document.getElementById('roundsChart'));
    window.addEventListener('resize', function() {
        chart.resize();
    });
    let option = {
        xAxis: {
          type: 'category',
          data: roundsNames
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: roundsScores,
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
        // Filtering only selected session
        if (session.uid === window.location.search.replace('?','')) {
            session.rounds.forEach(round => {
                // Filtering only live rounds
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