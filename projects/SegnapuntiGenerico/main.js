/* Vue app */
const app = Vue.createApp({
	data(){
		return {
			col:'red',
			winnerOption:'greaterPoints',
			currPartInd:0,
			back:[],
			partNum:2,
			numOfGames: 0,
			maxIntValue: 2100000,
			partList:[],
			localSave: 0,
			savedGroup:{},
			useLocal: false,
			maxIndex:0,
			minIndex:0,
			initialHref:window.location.href,
			tutorial: null,
			tutorialInd: 0
		}
	},
	methods:{
		/* Title editing */
		doEdit:function(txtArea,el,icon,edit) {
			let subject =$(txtArea).val();
			$(el).html(subject);
			
			$(el).show();
			$(icon).show();
			$(edit).hide();
			this.checkBoundCSS();
		},
		toggleEditor:function(txtArea,el,icon,edit) {
			if(el) var subject = $(el).text();
			$(txtArea).val(subject);
			
			if(el) $(el).hide();
			$(icon).hide();
			$(edit).css('display', 'inline-block');
		},

		/* Insert partecipants and game options */
		startIns:function(){
			$('#insMenu').hide();
			$('#insertPart').show();
		},
		checkPointsInput:function(e){
			let val = e.target.value;
			
			if (val > 10) {
				e.target.value = val.slice(0,10); 
			}
			// To avoid bug on safari
			e.target.setCustomValidity('');
		},
		savePart:function(){
			/* If i load the data from localstorage i remove the player to push it again 
			(i need it to have also the last player of group visible if i use back button)*/
			if(this.useLocal && (this.currPartInd == this.partNum-1)){
				this.partList.pop();
			}
			let n = $("#name").val()?$("#name").val():"Undefined";
			let col = $("#color").val()?$("#color").val():'#000000';
			let isBack = this.back.includes(this.currPartInd);
			// If I'm here from the back button
			if(isBack){
				this.back.splice(this.back.indexOf(this.currPartInd),1);
				this.partList[this.currPartInd].name = n;
				this.partList[this.currPartInd].color = col;
			}
			else {
				this.partList.push({name:n,color:col,points:0,pLog:[]});
			}
			// Check if the partecipant is the last one
			if(this.currPartInd == this.partNum-1){
				// Initialize all log popovers
				this.$nextTick(() => {
					$('.popLog').popover();
					this.startGame();
				});
			}
			else{
				if(this.currPartInd == (this.partNum-2)){
					$('#savePartBtn').show();
					$('#readyBtn').text("INIZIA");
				}
				// Reset the form or compile with the next saved partecipant
				$("#name").val(this.partList[this.currPartInd+1]?this.partList[this.currPartInd+1].name:"");
				$("#color").val(this.partList[this.currPartInd+1]?this.partList[this.currPartInd+1].color:"#000000");

				this.currPartInd++;
				if(this.currPartInd == 1){
					$("#backInsBtn").css('display','inline');
				}
			}
		},
		backInsertPlayer:function(){
			this.currPartInd--;
			if(this.currPartInd == 0){
				$("#backInsBtn").css('display','none');
			}
			if(this.currPartInd+1 != this.partNum && ($('#readyBtn').text() === "INIZIA")){
				$('#savePartBtn').hide();
				$('#readyBtn').text("AVANTI");
			}
			$("#name").val(this.partList[this.currPartInd].name);
			$("#color").val(this.partList[this.currPartInd].color);
			this.back.push(this.currPartInd);
		},
		startGame:function(oldGame=false){
			if(oldGame === false){
				$('#insMenu').hide();
				$('#partTable').show();
			} else{
				$('#contHeader').show();
				$('#refreshBtn').show();
			}
			$('#insertPart').hide();
			$('#partTable').show();
			$('#saveGameBtn').show();
			this.checkBoundCSS();
		},

		/* Game management */
		colorBestWorse:function(){
			// Find the min and max points to color the background
			let min = Math.min.apply(null, this.partList.map(item => item.points));
			let max = Math.max.apply(null, this.partList.map(item => item.points));
			
			// TODO: small bug, if all the players have the same points then the last one
			// has both the classes
			for(let j=0; j < this.partNum; j++){
				if(this.partList[j].points == min) this.minIndex = j;
				else if(this.partList[j].points == max) this.maxIndex = j;
			}
			// Removing all the classes (only the background color is activated) to clean the old value
			$('td').removeClass();

			if(this.winnerOption == 'greaterPoints'){
				$('td:nth-child(2)').eq(this.maxIndex).addClass('table-success');
				$('td:nth-child(2)').eq(this.minIndex).addClass('table-danger');
			}else{
				$('td:nth-child(2)').eq(this.minIndex).addClass('table-success');
				$('td:nth-child(2)').eq(this.maxIndex).addClass('table-danger');
			}
		},
		addPoints:function(){
			// Update points
			let actualPoints;
			for(let i=0; i< this.partNum; i++){
				actualPoints = ($('.pointsToAdd').eq(i).val() != '')?parseInt($('.pointsToAdd').eq(i).val().slice(0,14)):0;
				this.partList[i].points += actualPoints;
				if (this.partList[i].points > this.maxIntValue){
					this.partList[i].points = this.maxIntValue;
				}
				$('.namePoints').eq(i).text(this.partList[i].points);
				$('.pointsToAdd').eq(i).val('');
				// Update the log of every player
				this.partList[i].pLog.push(this.partList[i].points);
			}
			this.colorBestWorse();
			this.numOfGames += 1;
		},
		refresh:function(){
			window.location = this.initialHref;
		},

		/* Save data or reload old games */
		saveGame:function(){
			let data = JSON.stringify({partecipants: this.partList, winCrit: this.winnerOption});
			let uri = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
			const a = document.createElement('a');
			a.href = uri; a.download = "scores.json"; a.target='_blank';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		},
		getAndProcessJSON:function(json){
			let data = JSON.parse(json);
			this.partNum = data.partecipants.length;
			this.partList = data.partecipants;
			this.winnerOption = data.winCrit;
			$('#loadGameModal').modal('hide');
			// Wait until the DOM is updated
			this.$nextTick(() => {
				$('.popLog').popover();
				$('#homepage').hide();
				$('footer').hide();
				this.startGame(oldGame=true);
				this.colorBestWorse();
			});
		},
		loadGame:function(){
			$("#loadFileError").css('display','none');
			/* Read the file information */
			let file = document.getElementById("loadGameBtn").files[0];
			if(file){
				let reader = new FileReader();
				reader.readAsText(file, "UTF-8");
				reader.onload = () => {
					let data =  reader.result;
					this.getAndProcessJSON(data);
				};
				reader.onerror = function () {
					$("#loadFileError").css('display','block');
				};
			}
		},
		savePlayers:function(){
			let usedMem = 0, keyLen, key;
			for (key in localStorage) {
				if (!localStorage.hasOwnProperty(key)) {
					continue;
				}
				keyLen = ((localStorage[key].length + key.length) * 2);
				usedMem += keyLen;
			}
			// Calculate the used local storage in MB
			usedMem = parseFloat((usedMem / 1024).toFixed(2))/1024;
			if(usedMem < 9){
				let data = [];
				let n = $("#name").val()?$("#name").val():"Undefined";
				let col = $("#color").val()?$("#color").val():'#000000';
				this.partList.forEach((pl)=>{
					data.push({name:pl.name,color:pl.color,points:0,pLog:[]});
				});
				// Add the last player to the list only if i didn't load from storage
				if(this.useLocal){
					data.pop();
				}
				data.push({name:n,color:col,points:0,pLog:[]});
				let toSave = JSON.stringify(data);
				// Check if the same group of players is not already saved
				for (const key in localStorage){
					if(localStorage[key] === toSave){
						$('#savePartBtn').attr('data-content','Gruppo già salvato <i class="fas fa-exclamation-triangle text-danger fa-lg"></i>');
						$('#savePartBtn').popover('show');
						return;
					}
				}
				localStorage.setItem("group"+this.localSave,toSave);
				this.localSave++;
				$('#savePartBtn').attr('data-content','Gruppo salvato <i class="far fa-check-square text-success fa-lg"></i>');
				$('#savePartBtn').popover('show');
			}
			else{
				$('#savePartBtn').attr('data-content','Memoria non sufficiente <i class="fas fa-times text-danger fa-lg"></i>');
				$('#savePartBtn').popover('show');
			}
		},
		loadPlayers:function(group){
			// Update all the data from the chosen group
			this.partList = [...this.savedGroup[group]];
			this.partNum = this.partList.length;
			this.currPartInd = this.partList.length - 1;
			let lastPart = this.partList[this.partNum-1];
			$('#name').val(lastPart.name);
			$('#color').val(lastPart.color);
			$('#readyBtn').text("INIZIA");
			$('#backInsBtn').show();
			$('#loadModal').modal('hide');
			this.startIns();
			this.useLocal = true;
		},
		deleteSavedGroup:function(group){
			// Remove the group from the localstorage and update the dom
			localStorage.removeItem(group);
			delete this.savedGroup[group];
		},

		/* Hide and show different elements of the game */
		hideTable:function(){
			$('#insertPart').show();
			$('#partTable').hide();
			$('#saveGameBtn').hide();
		},
		showInputs:function(){
			$('#homepage').hide();
			$('#contHeader').show();
			$('#insMenu').show();
			$('#refreshBtn').show();
			$('footer').hide();
			this.checkBoundCSS();
		},

		/* Tutorial section */
		activateTutorial:function(){
			this.tutorial = new Shepherd.Tour({
				useModalOverlay: true,
				exitOnEsc: false,
				defaultStepOptions: {
					cancelIcon: {
						enabled: true
					},
					arrow: true,
					scrollTo: { behavior: 'smooth', block: 'center' }
				}
			});
			// Show the game screen 
			this.showInputs();
			this.addTutorialSteps();
			this.tutorial.start();
		},
		addTutorialSteps:function(){
			titles = ['Modifica il titolo', 'Carica giocatori salvati', 'Salva giocatori inseriti', 'Inserisci punteggi', 'Somma i punteggi',
					  'Mostra lo storico', 'Salva partita'];
			elements = ['#iconEdit', 'button[data-target="#loadModal"]', '#savePartBtn', 'tr:nth-child(2) td:nth-child(3) .pointsToAdd',
						'.submitInvBtn .fa-plus-square', 'tr:nth-child(2) td:nth-child(2) .fas', '#saveGameBtn'];
			texts = ["Cliccando sull' icona potrai cambiare il titolo e il colore.", "Se avevi salvato precedentemente delle combinazioni \
					  di giocatori le potrai selezionare per iniziare la partita più velocemente.", "Salva i giocatori per poterli \
					  scegliere in una partita futura. (Inserisci prima il nome e il colore dell'ultimo giocatore altrimenti verrà salvato con valori di default).",
					  "Scrivi il punteggio di ogni giocatore nelle caselle bianche (se non viene inserito nessun numero viene considerato come \
					  0).", "Premendo sul simbolo del più tutti i nuovi punteggi dei giocatori verranno sommati ai precedenti e aggiunti allo \
					  storico. Il giocatore che sarà in vantaggio avrà la casella con lo sfondo verde e quello che starà perdendo avrà lo sfondo \
					  rosso.", "Cliccando sul simbolo che si trova vicino al punteggio di ogni giocatore verrà mostrato lo storico dei punteggi \
					  avuti da quel giocatore nella partita corrente.", "Premendo, la partita verrà salvata in un file .json che si potrà poi \
					  inserire nel menù principale per continuare dal punto a cui si era rimasti."];
			
			let vueObj = this;
			let backBtn = {
				action() {
					if(vueObj.tutorialInd == 2){
						vueObj.partList = [];
						vueObj.currPartInd = 0;
						$('#name').val('');
						$('#color').val('#000000');
						$('#insertPart').hide();
						$('#insMenu').show();
					}
					else if(vueObj.tutorialInd == 3){
						vueObj.hideTable();
						vueObj.partList.pop();
					}
					vueObj.tutorialInd -= 1;
					return this.back();
				},
				text: 'Indietro'
			};

			for(let i=0; i < titles.length; i++){
				this.tutorial.addStep({
					title: `${titles[i]} - STEP ${i+1}/${titles.length}`,
					text: `${texts[i]}`,
					buttons: [
						// Insert the 'back' button only if the tutorial is not in step 1
						... i != 0 ? [backBtn] : [],
						{
							action() {
								if(i == 1){
									// Simulate partecipants insertion
									vueObj.partNum = 2;
									vueObj.startIns();
									$('#name').val('Giocatore 1');
									$('#color').val('#000000');
									vueObj.savePart();
									$('#name').val('Giocatore 2');
									$('#color').val('#FF0000');
								}
								else if(i == 2){
									vueObj.savePart();
								}
								else if(i == titles.length-1){
									vueObj.refresh();
								}
								vueObj.$nextTick(() => {
									vueObj.tutorialInd += 1;
									return this.next();
								});
							},
							text: i == titles.length-1 ? 'Fine' : 'Avanti'
						}
					],
					attachTo: {
						element: `${elements[i]}`,
						on: 'bottom'
					},
					when: {
						cancel: () => {
						  	vueObj.refresh();
						}
					},
					id: `step${i}`,
					canClickTarget: false
				});
			}
		},
		checkBoundCSS:function(){
			let elem = document.querySelector('#refreshBtn');
			// Get element's bounding
			let bounding = elem.getBoundingClientRect();
		
			// Check if it's out of the viewport on each side
			let out = {};
			out.top = bounding.top < 0;
			out.left = bounding.left < 0;
			out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
			out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
			out.any = out.top || out.left || out.bottom || out.right;
		
			if(out.any){
				if($('#app').css('overflow') !== 'scroll'){
					// Show all the app screen in small devices
					$('#app').css('overflow', 'scroll')
				}
			}
			else{
				if($('#app').css('overflow') !== 'hidden'){
					// Show the normal screen of the app
					$('#app').css('overflow', 'hidden')
				}
			}
		}
	},
	mounted(){
		/* PWA Section */
		if('serviceWorker' in navigator){
			navigator.serviceWorker.register("sw.js").then(registration => {
				// Retrieve information to know if the device use ios and not from the installed app
				const userAgent = window.navigator.userAgent.toLowerCase();
				let isIphone = /iphone/.test(userAgent);
				let isIpad = /ipad/.test(userAgent);
				const webkit = !!userAgent.match(/webkit/i);
				const isSafari = (isIpad || isIphone) && webkit && !userAgent.match(/crios/i);
				const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

				// Decide if the popover must appear
				let lastNot = parseInt(localStorage.getItem('last_not')) || Date.now();
				let showAgain = !localStorage.getItem('first_time') || (Date.now() - lastNot) > (1800*1000); // ~30 minutes
				
				// Display a pop up to advise users on ios if they are not already inside app
				if(isSafari && !window.MSStream && !isInStandaloneMode() && showAgain){
					$('#iosDown').popover();
					if(isIphone){
						$('#iosDown').css("bottom","15px");
					}else{
						$('#iosDown').attr('data-placement','bottom');
						$('#iosDown').css("top","15px");
					}
					$('#iosDown').focus();
					localStorage.setItem('last_not',Date.now());
					if(!localStorage.getItem('first_time'))
						localStorage.setItem('first_time','no');
				};
			}).catch(err =>{
				console.log(err);
			})
		}

		// Check how much groups are saved in localstorage
		let lastGroup = "0";
		for (const key in localStorage) {
			if (!localStorage.hasOwnProperty(key) || !key.startsWith("group")) {
				continue;
			}
			// Set the new key in the dictionary
			this.savedGroup[key] = JSON.parse(localStorage.getItem(key));
			lastGroup = key;
		}
		this.localSave = parseInt(lastGroup.slice(-1))+1;

		if(/android/i.test(navigator.userAgent)){
			// Set the correct viewvport height to avoid chrome/android soft keyboard
			let viewheight = $(window).height();
			let viewport = $("meta[name=viewport]");
			viewport.attr("content", "height=" + viewheight + "px, width=device-width, initial-scale=1.0");
		}
		this.checkBoundCSS();
	}
});

app.mount("#app");