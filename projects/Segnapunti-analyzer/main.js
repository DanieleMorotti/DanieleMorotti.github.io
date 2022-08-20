function readFile() {
    $('[data-toggle="popover"]').popover();
    var file = document.getElementById("fileReader").files[0];
    if(file){
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function () {
            let data =  reader.result;
            getAndProcessData(data);
        };
        reader.onerror = function () {
            $("#preview").html("Errore durante la lettura del file");
        }
    }
};

$("#fileReader").change(readFile);

// Get the data from the json file and initialize the data structures to analyze the scores
function getAndProcessData(json) {
    let data = JSON.parse(json);
    let players = [];
    let scores = {};
    let info = [];
    // Create the array for every player to sore his scores
    for (let i=0; i < data.length;i++){
        players.push(data[i]['name'])
        scores[players[i]] = data[i]['pLog'];
    }

    analyzeGame(players, scores, info);
}


function analyzeGame(players, scores, info){
    for(let i=0; i < players.length; i++){
        let min = Math.min(...scores[players[i]]);
        let max = Math.max(...scores[players[i]]);
        // Get the differences between all the numbers to retrieve information about the game
        let differences = scores[players[i]].map((score, j) => {
            let prev = scores[players[i]][j-1]?scores[players[i]][j-1]:0;
            return score - prev;
        });
        let maxWin = Math.max(...differences); 
        let maxLose = Math.min(...differences);
        if (maxLose > 0){
            maxLose = 0
        }
        let win = differences.filter(sc => sc > 0).length;
        let lose = scores[players[i]].length - win;
        let counts = {};
        for (const num of differences) {
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
        info.push({name:players[i], points:scores, max:max, min:min, win:win, lose: lose, maxWin:maxWin, maxLose:maxLose, valOccurr: counts});
    }

    /* Get the winner and find the ranking */
    let ranking = [], rank=1;
    for(const pl of players){
        // Insert the final score for every player
        ranking.push({name:pl,lastScore:scores[pl].slice(-1)[0]});
    }    
    ranking.sort( function(a, b){
        return b.lastScore - a.lastScore;
    });
    for (let i = 0; i < ranking.length; i++) {
        // Set the rank for every object
        if (i > 0 && ranking[i].lastScore != ranking[i - 1].lastScore) {
            rank++;
        }
        ranking[i].rank = rank;
    }

    /* Generate summary string */
    let summary = `Il vincitore è ${ranking[0].name} con un punteggio di ${ranking[0].lastScore}. `;
    for(let i=1; i < ranking.length; i++){
        summary += `${ranking[i].name} è ${ranking[i].rank}&deg; con ${ranking[i].lastScore} punti. `;
    }
    summary += "\n";
    for(const pl of info){
        summary += `\nLe statistiche di ${pl['name']}:\n - ha raggiunto massimo ${pl['max']} punti ed è arrivato ad un minimo di ${pl['min']} punti;\n - ha vinto ${pl['win']} partite e ne ha perse ${pl['lose']};\n - in una partita ha guadagnato massimo ${pl['maxWin']} e ne ha persi un massimo di ${pl['maxLose']}\n - questi sono i punteggi fatti e le loro occorrenze:\n`;
        for (const [value, occurr] of Object.entries(pl['valOccurr'])) {
            summary += `\tpunti:${value}\tocc:${occurr}\n`;
        }
    }
    document.getElementById('summaryDwn').href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(summary);
    $('#preview').html(summary);
    $('#summaryMenu').show();
    generateGraphs(players,scores);
    $('#graphsMenu').show();
}

function randomColorGenerator() { 
    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8); 
};
// Generate charts with Chart.js
function generateGraphs(players,scores){
    // Creating the label with number of games
    let games = [], dataset = [], imUrls = [];
    for(let i=0; i < scores[players[0]].length; i++){
        games.push(`${i+1}`);
    }
    // Set the color of the background for saving images
    const pluginColor = {
        id: "backgroundColorPlugin",
        beforeDraw: (chart) =>{
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over',
            ctx.fillStyle = 'white';
            ctx.fillRect(0,0,chart.width,chart.height);
            ctx.restore();
        }
    }
    for(let i=0; i < players.length; i++){
        $('#graphsArea').append(`<canvas id="chart${i}" class="charts"></canvas>`);
        let tmpColor = randomColorGenerator();
        let newChart = new Chart(document.getElementById(`chart${i}`), {
            type: 'line',
            data: {labels: games, datasets:[{label:players[i], data:scores[players[i]], borderColor: tmpColor, backgroundColor: tmpColor}]},
            options: {
                responsive: true,
                maintainAspectRatio: false,
                events: ["click"],
                animation: {
                    onComplete: function() {
                        imUrls.push(newChart.toBase64Image());
                    }
                }
            },
            plugins: [pluginColor]
        });
        dataset.push({label: players[i], data: scores[players[i]], borderColor:tmpColor, backgroundColor:tmpColor});
    }
    const data = {labels: games, datasets: dataset};
    let genChart = new Chart(document.getElementById('chart'), {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            events: ["click"],
            animation: {
                // The function is fired multiple times with no reason so i need to filter invalid url
                onComplete: function() {
                    imUrls.unshift(genChart.toBase64Image());
                    imUrls = imUrls.filter(function(item) { 
                        return item.length > 6;
                    });
                    for(let i=0; i < imUrls.length; i++){
                        if(i == 0){
                            // Disable after rendering
                            this.options.animation.onComplete = null; 
                            players.unshift('generale');
                        }
                        $('.charts').eq(i).after(`<center><a href="${imUrls[i]}" target="_blank" download="grafico-${players[i]}.png" class="btn btn-primary">Download immagine</a></center>`)
                    }
                }
            }
        },
        plugins: [pluginColor]
    });
}


/* 
    Manage icons change
*/

let infoIcon = $('#infoIcon');
let summaryIcon = $('#summaryIcon');
let graphsIcon = $('#graphsIcon');

let info = "fas fa-info-circle fa-2x";
let infoUpArrow = "fas fa-arrow-circle-up fa-2x";
let summArrowUp = "fas fa-chevron-up fa-lg";
let summArrowDown = "fas fa-chevron-down fa-lg";

let currentInfoState = "info";
let currentSummState = "up";
let currentGraphState = "up";

// Change the class of @element from @toRemove to @toAdd 
function toggleIcon(element, toRemove, toAdd){
	element.removeClass(toRemove);
	element.addClass(toAdd);
}

// Manage the icon for the info section
function toggleInfo(){
    if(currentInfoState === 'info'){
        toggleIcon(infoIcon, info, infoUpArrow);
        currentInfoState = 'arrow';
    }
    else{
        toggleIcon(infoIcon, infoUpArrow, info);
        currentInfoState = 'info';
    }
}

// Manage the icon for the summary section
function toggleSumm(){
    if(currentSummState === 'up'){
        toggleIcon(summaryIcon, summArrowUp, summArrowDown);
        currentSummState = 'down';
    }
    else{
        toggleIcon(summaryIcon, summArrowDown, summArrowUp);
        currentSummState = 'up';
    }
}

// Manage the icon for the graphs section
function toggleGraphs(){
    if(currentGraphState === 'up'){
        toggleIcon(graphsIcon, summArrowUp, summArrowDown);
        currentGraphState = 'down';
    }
    else{
        toggleIcon(graphsIcon, summArrowDown, summArrowUp);
        currentGraphState = 'up';
    }
}