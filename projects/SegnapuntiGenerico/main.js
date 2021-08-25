/* Vue app */
app = new Vue({
	el:'#app',
	data:{
		col:'red',
		winnerOption:'greaterPoints',
		currPartInd:0,
		back:[],
		partNum:2,
		numOfGames: 0,
		partList:[],
		localSave: 0,
		savedGroup:{},
		useLocal: false,
		maxIndex:0,
		minIndex:0,
		initialHref:window.location.href
	},
	methods:{
		doEdit:function(txtArea,el,icon,edit) {
			let subject =$(txtArea).val();
			$(el).html(subject);
			
			$(el).show();
			$(icon).show();
			$(edit).hide();
		},
		toggleEditor:function(txtArea,el,icon,edit) {
			if(el) var subject = $(el).text();
			$(txtArea).val(subject);
			
			if(el) $(el).hide();
			$(icon).hide();
			$(edit).css('display', 'inline-block');
		},
		startIns:function(){
			$('#menu').hide();
			$('#insertPart').show();
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
			// If i'm here from the back button
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
				$('.popLog').popover();
				this.startGame();
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
		startGame:function(){
			$('#insertPart').hide();
			$('#partTable').show();
			$('#saveGameBtn').show();
			for(let i=0; i < this.partNum;i++){
				$('.nameSpan').eq(i).text(this.partList[i].name);
				$('.nameSpan').eq(i).css('color',this.partList[i].color);
				$('.namePoints').eq(i).text(this.partList.points);
			}
		},
		addPoints:function(){
			// Update points
			let actualPoints;
			for(let i=0; i< this.partNum;i++){
				actualPoints = ($('.pointsToAdd').eq(i).val() != '')?parseInt($('.pointsToAdd').eq(i).val().slice(0,14)):0;
				this.partList[i].points += actualPoints;
				$('.namePoints').eq(i).text(this.partList[i].points);
				$('.pointsToAdd').eq(i).val('');
				// Update the log of every player
				this.partList[i].pLog.push(this.partList[i].points);
				$('.popLog').eq(i).attr('data-content',this.partList[i].pLog.join(' '));
			}
			// Find the min and max points to color the background
			let min = Math.min.apply(null, this.partList.map(item => item.points));
			let max = Math.max.apply(null, this.partList.map(item => item.points));
			
			for(let j=0;j < this.partNum;j++){
				if(this.partList[j].points == min) this.minIndex =j;
				else if(this.partList[j].points == max) this.maxIndex =j;
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
			this.numOfGames += 1;
		},
		refresh:function(){
			window.location = this.initialHref;
		},
		saveGame:function(){
			let partLogs = [];
			let names = [];
			// Get the scores for every partecipant
			this.partList.forEach(part => {
				names.push(part.name);
				partLogs.push({[part.name]:part.pLog});
			});

			let csvData = '';
			csvData += names.join(";") + "\n";

			// Set the format for csv file
			for(let i=0; i < this.numOfGames; i++){
				for(let j=0; j < names.length; j++){
					csvData += partLogs[j][names[j]][i];
					if(j < names.length-1)
						csvData += ";";
				}
				csvData += "\n";
			}
			
			// Download csv file
			let uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData);
			const a = document.createElement('a');
			a.href = uri; a.download = "scores.csv"; a.target='_blank';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
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
			this.$delete(this.savedGroup, group);
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
			// Set the new key with $set to trigger the change event on dictionary
			this.$set(this.savedGroup, key, JSON.parse(localStorage.getItem(key)));
			lastGroup = key;
		}
		this.localSave = parseInt(lastGroup.slice(-1))+1;

		// Set the correct viewvport height to avoid chrome soft keyboard
		let viewheight = $(window).height();
        let viewport = $("meta[name=viewport]");
        viewport.attr("content", "height=" + viewheight + "px, width=device-width, initial-scale=1.0");
	}
});