// select elements an values
var startGameButton=document.querySelector(".startgame button:first-child");
var exitGameButton=document.querySelector(".startgame button:last-child");
var logOutFromGame=document.querySelector(".right-menu .div:last-child");
var gameArea=document.querySelector(".game-area");
var startGamePopUp=document.querySelector(".startgame");
var questionArea=document.querySelector(".question-area .question span");
var allAnswersField=document.querySelectorAll(".question-area .answer")
var answer_1=document.querySelector(".question-area .answer-one span");
var answer_2=document.querySelector(".question-area .answer-two span");
var answer_3=document.querySelector(".question-area .answer-three span");
var answer_4=document.querySelector(".question-area .answer-four span");
var endGameButton=document.querySelector(".game-header .leave-game");
var gameTimer=document.querySelector(".game-header .timer");
var alert=document.querySelector(".game-area .alert-box");
var liveRefreshmentElement=document.querySelector(".game-header .live-count");
var liveRefreshmentValue=parseInt(document.querySelector(".game-header .live-count").innerHTML);
var exchangeQuestionElement=document.querySelector(".game-header .exchange");
var timerInterval;
var level=1;
var currentIndexOfQuestion=0; 
var QuestionsOFCurrentLevel=[];
var clickOnAnswer=false;
var exchangeQuestion=false;



window.onload=function(){
    if(localStorage.getItem("level")){
        level=parseInt(localStorage.getItem("level"));
        if(level===6){
            level=5;
        }
    }else{
        localStorage.setItem("level",level.toString());
    }
    //Get Question from json File
    getListOfQuestions();

}

//when player clicks on start game Button
startGameButton.addEventListener("click",function(){
    this.parentNode.style.display="none";
    //reset live refreshment
    liveRefreshmentValue=2;
    liveRefreshmentElement.innerHTML=liveRefreshmentValue;

    //reset current Question index to 0
        currentIndexOfQuestion=0;

        if(localStorage.getItem("level")){
            level=parseInt(localStorage.getItem("level"));
            if(level===6){
                level=5;
            }
    }else{
        localStorage.setItem("level",level.toString());
    }

    //get questions from Api
    getListOfQuestions();
    setTimeout(function(){
        gameArea.style.display="block";
        resetTimer();        
    },1000);
});

// //when player clicks on Exit game Button
exitGameButton.addEventListener("click",function(){
    setTimeout(function(){
        open("index.html","_self");
    },1000);

    

});

//function to reset timer when question changes
resetTimer=()=>{
    var duration=31;
    clearInterval(timerInterval);
    timerInterval=setInterval(function(){
        duration--;
        gameTimer.innerHTML="00:"+duration;
        if(duration==0){
         clearInterval(timerInterval);
         showAlertMessage("timeOut");
         

        }
    },1000);
}


//Function to show alert message for game 
showAlertMessage=(messageType)=>{
    alert.style.visibility="visible";
    alert.style.opacity=1;

    alert.innerHTML="";
    // Create span tag to put the Alert
    let message=document.createElement("span");
    let messageText;
    if(messageType==="lose"){
         messageText=document.createTextNode("لقد خسرت");
         message.appendChild(messageText);
         message.className="alert-message";
         message.style.color="red";
    }
    if(messageType==="timeOut"){
         messageText=document.createTextNode("لقد انتهي الوقت");
         message.appendChild(messageText);
        message.className="alert-message";
        message.style.color="red";
    }
    if(messageType==="upgradelevel"){
        let text=" لقد وصلت للمستوي "+level;
        messageText=document.createTextNode(text);
        message.appendChild(messageText);
        message.className="alert-message";
        message.style.color="green";
    }

    if(messageType==="win"){
        let text=" تهانينا !! لقد فزت"
        messageText=document.createTextNode(text);
        message.appendChild(messageText);
        message.className="alert-message";
        message.style.color="green";
    }
    if(messageType==="leave-game"){
        let text="هل حقا تريد مغادرة اللعبة"
        messageText=document.createTextNode(text);
        message.appendChild(messageText);
        message.className="alert-message";
        message.style.color="green";
        let agreeToCloseGameButton=document.createElement("button");
        let btnAgreeText=document.createTextNode("نعم");
        agreeToCloseGameButton.appendChild(btnAgreeText);
        let classes1=["btn","btn-primary","agree-to-close"];
        agreeToCloseGameButton.classList.add(...classes1);
        let disagreeToCloseGameButton=document.createElement("button");
        let btnDisgreeText=document.createTextNode("لا");
        disagreeToCloseGameButton.appendChild(btnDisgreeText);
        let classes2=["btn","btn-success","disagree-to-close"];
        disagreeToCloseGameButton.classList.add(...classes2);
        message.appendChild(messageText);
        message.appendChild(agreeToCloseGameButton);
        message.appendChild(disagreeToCloseGameButton);
        message.className="alert-message";
        message.style.color="green";
        alert.appendChild(message);

    }
    // put alert message inside span
    

    //append  message to alert
    if(messageType!=="leave-game"){
        alert.appendChild(message);
        setTimeout(() => {
            alert.style.visibility = "hidden";
            alert.style.opacity = 0;
        },
            3000);
        }
    else{
        
    }
}


// Get Question from Json File
function getListOfQuestions(){
    
    var httpRequest=new XMLHttpRequest();
    httpRequest.open("GET","json/questions.json",true);
    httpRequest.send();
    httpRequest.onreadystatechange=function(){
        if(this.readyState===4 && this.status===200){
             let questionsObjects=JSON.parse(this.responseText);
             console.log(questionsObjects);

            //get Questions of current level 
            GetQuestionsOFCurrentLevel(questionsObjects);
             
        }
    }
}


//Get Questions of current level
function GetQuestionsOFCurrentLevel(obj){
    let Questions=[];
    obj.forEach(question => {
        if(question['level']==level){
           Questions.push(question);
        }
    });

    //operations of displaying Questions and Answers  and click to choose answer answes
    QuestionsAndAnswersOperations(Questions);
    // console.log(Questions);
     

}


//Function To Display Question And Answers in its Fields
QuestionsAndAnswersOperations=(Questions)=>{
    clickOnAnswer=false;
    //Display First Question And Answers
    displayQuestionAndAnswer(Questions[currentIndexOfQuestion]);


    //Event When Player Click To Choose the Answer
    document.onclick=function(e){

        //if user click on any answer only
          if(e.target.classList.contains("answer") && !clickOnAnswer ){
            clickOnAnswer=true;
            let currentbackground=e.target.style.backgroundImage;

              //Check If Answer is correct or not
              if( e.target.children[0].innerHTML==Questions[currentIndexOfQuestion]['right_answer']){
                setTimeout(()=>{
                    e.target.style.backgroundImage="none";
                    e.target.style.backgroundColor="#64e764";
                    //resetTimer
                    resetTimer();
                    notification("right_answer");
                    console.log("Right Answer");
                },1000);
                
                
                

              }
              //if answer is not coreect
              else{
                setTimeout(()=>{
                     e.target.style.backgroundImage="none";
                     e.target.style.backgroundColor="red";
                     notification("wrong_answer");
                     console.log("wrong Answer");

                     //if player have more than 1 live Refreshment
                     if(liveRefreshmentValue!==1){
                        liveRefreshmentValue--;
                        liveRefreshmentElement.innerHTML=liveRefreshmentValue;

                        //resetTimer
                        resetTimer();
                        
                     }
                     //if user has only 1 live refreshment
                     else{
                        liveRefreshmentValue--;
                        liveRefreshmentElement.innerHTML=liveRefreshmentValue;
                        //show lose alert message
                        showAlertMessage("lose");
                        notification("lose");
                        //stop Timer
                        clearInterval(timerInterval);
                        
                        setTimeout(()=>{
                            //close game 
                            gameArea.style.display="none";
                            startGamePopUp.style.display="block";

                        },2000);
                     }
                     
                },1000);
                
              }
              
              if(currentIndexOfQuestion < Questions.length){
                //display next Question
                currentIndexOfQuestion++;
                setTimeout(function(){

                    //user finish question of specific level
                    if(currentIndexOfQuestion==Questions.length && level<=5){
                        level++;
                         
                        //upgrade to next level
                        notification("win");
                        showAlertMessage("upgradelevel");

                        //change level in local storage
                       if(localStorage.getItem("level")){
                          localStorage.setItem("level",level.toString());
                       }
                        // reset background of answer after check correct or not
                        e.target.style.backgroundImage=currentbackground;   
                        console.log("level");

                        //if level ===6 the player will win the game
                        if(level===6){
                            //play the win notification
                            notification("win");
                            //show alert of win game
                            showAlertMessage("win");
                            

                        }
                        //set current index 0
                        currentIndexOfQuestion=0;

                        //get questions of new level
                        getListOfQuestions();
                        
                        //enable echange question button
                        exchangeQuestion=false;
                        console.log(exchangeQuestionElement.style.color);
                        exchangeQuestionElement.style.color="#FFF";


                    }else{
                        //Display Next Question And Answers
                        e.target.style.backgroundImage=currentbackground;   
                        displayQuestionAndAnswer(Questions[currentIndexOfQuestion]);
                        clickOnAnswer=false;
                    }
                   
                
                },3000);
                 
                //Error here
                  
                }
          }

          // if UserClick on exchange question button
          else if(e.target.parentNode.classList.contains("exchange") && !exchangeQuestion){
            e.target.style.color="#6a6666";
            exchangeQuestion=true;
            setTimeout(()=>{
                currentIndexOfQuestion++;
                displayQuestionAndAnswer(Questions[currentIndexOfQuestion]);
                
            },2000);

          }
          //if user click on leave game button
          else if(e.target.classList.contains("leave-game")){
                
             //show alert message To check if user want to close game or not
             showAlertMessage("leave-game");
          }
          //if user confirm close of game
          else if(e.target.classList.contains("agree-to-close")){
            //close game 
            gameArea.style.display="none";

            startGamePopUp.style.display="block";
            alert.style.visibility = "hidden";
            alert.style.opacity = 0;

            
          }
          else if(e.target.classList.contains("disagree-to-close")){
            setTimeout(()=>{
                
                    alert.style.visibility = "hidden";
                    alert.style.opacity = 0;
            
            },1000);
          }

    }
}
//display Question And Answers in its fields
displayQuestionAndAnswer=(questionObject)=>{
    console.log(questionObject);
    //Display
    questionArea.innerHTML=questionObject['question'];

    //display Answers
    answer_1.innerHTML=questionObject['answer_1'];
    answer_2.innerHTML=questionObject['answer_2'];
    answer_3.innerHTML=questionObject['answer_3'];
    answer_4.innerHTML=questionObject['answer_4'];

}

//notification sound for alert messages
notification=(type)=>{
    if(!document.querySelector("audio")){
        if(type==="right_answer"){
            var audio=new Audio("notification/mixkit-correct-answer-reward-952.wav");
            audio.play();
        }
        if(type==="wrong_answer"){
            var audio=new Audio("notification/mixkit-wrong-answer-fail-notification-946.wav");
            audio.play();
        }
        if(type==="win"){
            var audio=new Audio("notification/mixkit-happy-bells-notification-937.wav");
            audio.play();
        }
        if(type==="lose"){
            var audio=new Audio("notification/mixkit-sci-fi-confirmation-914.wav");
            audio.play();
        }
    }else{
        document.querySelector("audio").remove();
    }

}

