/* Vue app */
app = new Vue({
	el:'#app',
	data:{
		col:'red',
		winnerOption:'greaterPoints',
		currPartInd:1,
		back:[],
		partNum:2,
		numOfGames: 0,
		partList:[],
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
			if(el)var subject = $(el).text();
			$(txtArea).val(subject);
			
			if(el)$(el).hide();
			$(icon).hide();
			$(edit).css('display', 'inline-block');
		},
		startIns:function(){
			$('#menu').hide();
			$('#insertPart').show();
		},
		startGame:function(){
			$('#insertPart').hide();
			$('#partTable').show();
			$('#saveGameBtn').show();
			for(let i=0; i < this.partList.length;i++){
				$('.nameSpan').eq(i).text(this.partList[i].name);
				$('.nameSpan').eq(i).css('color',this.partList[i].color);
				$('.namePoints').eq(i).text(this.partList.points);
			}
		},
		savePart:function(){
			let n = $("#name").val()?$("#name").val():"Undefined";
			let col = $("#color").val()?$("#color").val():'#000000';
			let isBack = this.back.includes(this.currPartInd - 1);
			// if i'm here from the back button
			if(isBack){
				this.back.splice(this.back.indexOf(this.currPartInd - 1),1);
				this.partList[this.currPartInd - 1].name = n;
				this.partList[this.currPartInd - 1].color = col;
			}
			else
				this.partList.push({name:n,color:col,points:0,pLog:[]});
			
			// check if the partecipant is the last one
			if(this.currPartInd == this.partNum){
				//initialize all log popovers
				$('.popLog').popover();
				this.startGame();
			}
			else{
				// reset the form or compile with the next saved partecipant
				$("#name").val(this.partList[this.currPartInd]?.name || "");
				$("#color").val(this.partList[this.currPartInd]?.color || "#000000");

				this.currPartInd++;
				if(this.currPartInd == 2)
					$("#backInsBtn").css('display','inline');
			}
		},
		backInsertPlayer:function(){
			this.currPartInd--;
			if(this.currPartInd == 1)
				$("#backInsBtn").css('display','none');
			
			$("#name").val(this.partList[this.currPartInd-1].name);
			$("#color").val(this.partList[this.currPartInd-1].color);
			this.back.push(this.currPartInd-1);
		},
		addPoints:function(){
			//update points
			let actualPoints;
			for(let i=0; i< this.partList.length;i++){
				actualPoints = ($('.pointsToAdd').eq(i).val() != '')?parseInt($('.pointsToAdd').eq(i).val().slice(0,14)):0;
				this.partList[i].points += actualPoints;
				$('.namePoints').eq(i).text(this.partList[i].points);
				$('.pointsToAdd').eq(i).val('');
				//update the log of every player
				this.partList[i].pLog.push(this.partList[i].points);
				$('.popLog').eq(i).attr('data-content',this.partList[i].pLog.join(' '));
			}
			//find the min and max points to color the background
			let min = Math.min.apply(null, this.partList.map(item => item.points));
			let max = Math.max.apply(null, this.partList.map(item => item.points));
			
			for(let j=0;j < this.partList.length;j++){
				if(this.partList[j].points == min) this.minIndex =j;
				else if(this.partList[j].points == max) this.maxIndex =j;
			}
			//removing all the classes(only the background color is activated)to clean the old value
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
			// get the scores for every partecipant
			this.partList.forEach(part => {
				names.push(part.name);
				partLogs.push({[part.name]:part.pLog});
			});

			let csvData = '';
			csvData += names.join(";") + "\n";

			// set the format for csv file
			for(let i=0; i < this.numOfGames; i++){
				for(let j=0; j < names.length; j++){
					csvData += partLogs[j][names[j]][i];
					if(j < names.length-1)
						csvData += ";";
				}
				csvData += "\n";
			}
			
			// download csv file
			let uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData);
			const a = document.createElement('a');
			a.href = uri; a.download = "scores.csv"; a.target='_blank';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
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
	}
});