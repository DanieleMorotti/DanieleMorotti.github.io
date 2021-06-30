
app = new Vue({
     el:'#app',
     data:{
        col:'red',
        winnerOption:'greaterPoints',
        partNum:2,
        partList:[],
        maxIndex:0,
        minIndex:0,
        initialHref:window.location.href
     },
     methods:{
        doEdit:function(txtArea,el,icon,edit) {
            var subject =$(txtArea).val();
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
            for(let i=0; i < this.partList.length;i++){
                $('.nameSpan').eq(i).text(this.partList[i].name);
                $('.nameSpan').eq(i).css('color',this.partList[i].color);
                $('.namePoints').eq(i).text(this.partList.points);
            }
        },
        savePart:function(){
            var n = $("#name").val();
            var col = $("#color").val();
            if(n == "")
                n = "Undefined";
            this.partList.push({name:n,color:col,points:0,pLog:[0]});
            if($("#partIndex").html() == this.partNum){
                //initialize all popovers
                $('[data-toggle="popover"]').popover();
                this.startGame();
            }
            else{
                $("#insertPartForm").trigger("reset");
                $("#partIndex").html(parseInt($("#partIndex").html())+1);
                if(parseInt($("#partIndex").html())== 2)
                    $("#backInsBtn").css('display','inline');
            }
        },
        backInsertPlayer:function(){
            var playerNum = parseInt($("#partIndex").html());
            playerNum--;
            if(playerNum == 1)
                $("#backInsBtn").css('display','none');
            
            $("#partIndex").html(playerNum);
            $("#name").val(this.partList[playerNum-1].name);
            $("#color").val(this.partList[playerNum-1].color);
        },
        addPoints:function(){
            //update points
            let actualPoints;
            for(let i=0; i< this.partList.length;i++){
                actualPoints = ($('.pointsToAdd').eq(i).val() != '')?parseInt($('.pointsToAdd').eq(i).val()):0;
                this.partList[i].points += actualPoints;
                $('.namePoints').eq(i).text(this.partList[i].points);
                $('.pointsToAdd').eq(i).val('');
                //update the log of every player
                this.partList[i].pLog.push(this.partList[i].points);
                $('.popLog').eq(i).attr('data-content',this.partList[i].pLog.join(' '));
            }
            //find the min and max points to color the background
            var min = Math.min.apply(null, this.partList.map(item => item.points));
            var max = Math.max.apply(null, this.partList.map(item => item.points));
           
            var tdindex;

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
        },
        refresh:function(){
            window.location = this.initialHref;
        }
    }
});

