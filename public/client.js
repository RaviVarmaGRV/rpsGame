console.log('Running good');

var clientSocket=io();
var createRoom=document.getElementById('create');
var joinRoom=document.getElementById('join');
var popUp=document.getElementById('forPopUp');
var joiningButton=document.getElementById('joinRoom');
var cancel=document.getElementById('cancel');
var errMsg=document.getElementById('errorMsg');
var roomName=document.getElementById('roomInput');
var allOptions=document.querySelector('.options');
var choosenAfter=document.getElementById('choosenOnes');
var image1=document.getElementById('selectedImage1');
var image2;
var score=document.getElementById('score');

var winTxt=document.getElementById('winTxt');
var playAgain= document.getElementById('playAgain');

var paperBox=document.getElementById('paperBox');
var scissorsBox=document.getElementById('scissorsBox');
var rockBox=document.getElementById('rockBox');
var image2Parent=document.getElementById('firImage2');
var playAgainBox=document.getElementById('playAgainBox');
console.log(playAgainBox);

var optionSelected;
var opponentOption;
var count=0;
var anotherCount=0;

createRoom.addEventListener('click',()=>{
    console.log(roomName);
    popUp.style.display='flex';
    joiningButton.textContent='CREATE';
    roomName.focus();

})

joinRoom.addEventListener('click',()=>{
    console.log(roomName);
    popUp.style.display='flex';
    joiningButton.textContent='JOIN';
    roomName.focus();

})

cancel.addEventListener('click',()=>{
    popUp.style.display='none';
    errMsg.style.color="hsl(214, 47%, 23%)";
})

joiningButton.addEventListener('click',()=>{
    if (roomName.value!="") {
        if (joiningButton.textContent=="JOIN") {

            clientSocket.emit("checkLength",roomName.value,(length)=>{
                if (length==1) {
                    clientSocket.emit("joinRoom",roomName.value,(roomList)=>arr=roomList);
                }
                else if(length==0){
                    errMsg.style.color='red';
                    errMsg.textContent='No such room found';
                }
                else{
                    errMsg.style.color='red';
                    errMsg.textContent='Maximum limit reached';
                }
            });                 

        }
        else{
            clientSocket.emit("checkLength",roomName.value,(length)=>{
                if (length==0) {
                afterJoin();
                }
                else{
                    errMsg.style.color='red';
                    errMsg.textContent='Room name already exist, try differently!';
                }
            });     
        }
        
    }
    else{        
        errMsg.style.color="red";
        errMsg.textContent="You must fill this field";        
    }

})

paperBox.addEventListener('click',()=>{
    optionSelected='paper';
    afterSelection(optionSelected);
})

scissorsBox.addEventListener('click',()=>{
    optionSelected='scissors';
    afterSelection(optionSelected);
})

rockBox.addEventListener('click',()=>{
    optionSelected='rock';
    afterSelection(optionSelected);
})

playAgain.addEventListener('click',()=>{
    anotherCount++;    
    if(anotherCount<=1){
        count+=1;
        
        rematch('me');
        clientSocket.emit('playAgainRestart');
    }
    
    
})

clientSocket.on('approvalGranted',()=>{
    afterJoin();
})

clientSocket.on('playAgain',()=>{
    count+=1;
    
    rematch();
    
})

clientSocket.on('opponentOption',(option)=>{
    console.log('received');
    opponentOption=option;
    image2=document.createElement('img');
    image2.src=`../images/icon-${opponentOption}.svg`;
    
    var a=document.getElementById('altTxt');

    if (a!=null) {
        a.remove();
    }

    if (image2Parent.firstChild) {
        image2Parent.firstChild.remove();
    }
    image2Parent.append(image2);   
    winnerCase();

})



function rematch(user){
    var msgBox=document.getElementById('msg');
    
    if (count==1 && user!=null) {
        
        msgBox.textContent='Rematch will be started soon';
        msgBox.style.color='white';
        
    }
    else if (count==2) {
        count=0;
        anotherCount=0;
        msgBox.style.color='#172042';
        playAgainBox.style.opacity="0";
        image2.remove();
        var result=document.createElement('p');
        result.id="altTxt";
        result.textContent="waiting for oppnent";
        if (image2Parent.firstChild) {
            image2Parent.firstChild.remove();
        }
        image2Parent.appendChild(result);
        choosenAfter.style.display='none';
        allOptions.style.display='flex';
        optionSelected=null;
        opponentOption=null;
        
    }
    }

function afterJoin() {
    clientSocket.emit('createRoom',roomName.value);
    popUp.style.display='none';
    document.getElementById('heading').style.display='none';
    document.getElementById('mainHeader').style.display='flex';
    document.querySelector('.roomTypes').style.display='none';
    allOptions.style.display='flex';
}

function afterSelection(optionSelectedParam) {
    clientSocket.emit('optionClicked',optionSelectedParam);
    allOptions.style.display='none';
    choosenAfter.style.display='flex';
    image1.src=`../images/icon-${optionSelectedParam}.svg`;
    optionSelected=optionSelectedParam;
    winnerCase(); 
}

function winnerCase() {    
    if (optionSelected!=null && opponentOption!=null) {
        console.log('checking');
        
        if ((optionSelected!=null) &&((optionSelected == 'rock' && opponentOption == 'scissors') || (optionSelected == 'scissors' && opponentOption == 'paper') || (optionSelected == 'paper' && opponentOption == 'rock'))) {
            score.textContent= +(score.textContent) + 1;
            winTxt.textContent="YOU WIN";
        
        }
        else if(optionSelected==opponentOption){
            winTxt.textContent="MATCH TIE";
        }
        else{
            winTxt.textContent="YOU LOSE";
        }

        optionSelected=null;
        opponentOption=null;
        playAgainBox.classList.remove('opacity');
        playAgainBox.classList.remove('opacity');
        document.getElementById('playAgainBox').style.opacity=1;
    
    }
}