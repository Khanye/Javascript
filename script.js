 
/****************************************************************************************
 *************************** QUIZ CONTROLLLER**********************************************
 ****************************************************************************************/
var quizController = (function () {
    /********Question Constructor*****************************/
    function Question(id, questionText, options, correctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    var questionLocalStorage = {
        setQuestionCollection: function (newCollection) {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));

        },
        getQuestionCollection: function () {
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestionCollection: function () {
            localStorage.removeItem('questionCollection');
        }

    };

    if (questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            } 
    
    var quizProgress = {
        questIndex: 0
    };

    //********************PERSON CONSRUCTOR*************** */
    function Person(id , firstname, lastname, score){
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.score = score;
    }

    var currPersonData = {
        fullname : [], 
        score : 0
    };

    var adminFullName = ['Frankie', 'Khanye'];

    var personLocalStorage = {
         setPersonData : function(newPersonData){
             localStorage.setItem('personData', JSON.stringify(newPersonData));
         }, 
         getPersonData : function(){
             return JSON.parse(localStorage.getItem('personData'));
         },
         removePersonData: function(){
             localStorage.removeItem('personData'); 
         }
    };

    if(personLocalStorage.getPersonData() == null){
        personLocalStorage.setPersonData([]);
    }
   

    return {

        getQuizProgress: quizProgress,
 
        getQuestionLocalStorage: questionLocalStorage,

        addQuestionOnLocalStrorage: function (newQuestText, opts) {
            var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;


            if (questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            }
            optionsArr = [];
            isChecked = false;
            for (var i = 0; i < opts.length; i++) {

                if (opts[i].value !== "") {
                    optionsArr.push(opts[i].value);
                }

                if (opts[i].previousElementSibling.checked && opts[i].value !== "") {
                    corrAns = opts[i].value;
                    isChecked = true;
                }
            }

            if (questionLocalStorage.getQuestionCollection().length > 0) {

                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
            } else {
                questionId = 0;
            }

            if (newQuestText.value !== "") {
                if (optionsArr.length > 1) {
                    if (isChecked) {

                        newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);

                        getStoredQuests = questionLocalStorage.getQuestionCollection();

                        getStoredQuests.push(newQuestion);

                        questionLocalStorage.setQuestionCollection(getStoredQuests);

                        newQuestText.value = "";
                        for (var x = 0; x < opts.length; x++) {
                            opts[x].value = "";
                            opts[x].previousElementSibling.checked = false; 

                        }
                        console.log(questionLocalStorage.getQuestionCollection());

                        return true;
                    } else {

                        alert('Please select a choice, You missed to check an answer or checked an answer without a value');
                        return false;


                    }
                } else {
                    alert('Please insert at least two options');
                        return false;

                }
            } else {
                alert('Please insert the question');
                        return false;

            }
        },

        checkAnswer: function(ans){

            if(questionLocalStorage.getQuestionCollection()[quizProgress.questIndex].correctAnswer === ans.textContent){

                currPersonData.score++;
                return true;
            }else{
                return false;
               
            }

        },

        IsFinished: function(){
            return  quizProgress.questIndex + 1 ===  questionLocalStorage.getQuestionCollection().length;
        },

        addPerson: function(){
            var newPerson , personId, personData;

            if (personLocalStorage.getPersonData().length > 0){
                personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;
            }else {
                personId = 0;
            }

            newPerson = new Person(personId, currPersonData.fullname[0], currPersonData.fullname[1], currPersonData.score);
            personData = personLocalStorage.getPersonData();

            personData.push(newPerson);
            personLocalStorage.setPersonData(personData);
            console.log(newPerson);
        },

        getCurrPersonData : currPersonData,

        getAdminFullName : adminFullName,

        getPersonalLocalStorage : personLocalStorage

        
    };

})();

/****************************************************************************************
 *************************** UI CONTROLLLER**********************************************
 ****************************************************************************************/

var UIController = (function () {

    var domItems = {
        //**************Admin Panel Elements********************************/
        adminSect: document.querySelector('.admin-panel-container'),   
        questionInsertBtn: document.getElementById('question-insert-btn'),
        newQuestionText: document.getElementById("new-question-text"),
        adminOptions: document.querySelectorAll(".admin-option"),
        adminOptionsContainer: document.querySelector('.admin-option-container'),
        insertedQuestsWrapper: document.querySelector('.inserted-questions-wrapper'),
        questUpdateBtn: document.getElementById('question-update-btn'),
        questDeleteBtn: document.getElementById('question-delete-btn'),
        questClearlsBtn: document.getElementById('question-clear-btn'),

        //**************Quiz Panel Elements********************************/
        quizSect: document.querySelector('.quiz-container'),        
        askedQuestText: document.getElementById('asked-question-text'),
        quizOptionwrapper: document.querySelector('.quiz-option-wrapper'),
        progressBar: document.querySelector("progress"),                     
        progressPar: document.getElementById('progress'),
        instAnsContainer: document.querySelector('.instant-answer-container'),
        instAnsText : document.getElementById('instant-answer-text'),
        emotionIcon : document.getElementById('emotion'),
        nextQuestionBtn: document.getElementById('next-question-button') ,

        //**************Landing Page Elements********************************/
        landingPageSect: document.querySelector('.landing-page-container'),
        startquizBtn: document.getElementById('start-quiz-btn'),
        firstNameInput: document.getElementById('firstname'),
        lastNameInput: document.getElementById('lastname'),

        //**************Final Results SecTioN********************************/
        finalResultSection : document.querySelector('.final-result-container'),
        quizScoreResult: document.getElementById('final-score-text'), 

        //**************Final Results SecTioN********************************/
        resultListWrapper: document.querySelector('.results-list-wrapper')
    };

    return {

        getDomItems: domItems,

        addInputsDynamically: function(){

            var addInput = function(){
                var inputHtml, z;
                  
                z = document.querySelectorAll('.admin-option').length;

                inputHtml = '<div class="admin-option-wrapper"><input type = "radio"  class = "admin-option-'+ z +'" name = "answer" value="'+ z +'"><input type = "text"  class = "admin-option admin-option-'+ z +'" value=""></div>';
                
                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend',inputHtml );

                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus',addInput);

            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);

            }

            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);

        } ,

        createQuestionList: function(getQuestions){

            var questHTML, numberArr ;

            numberArr = [];
         domItems.insertedQuestsWrapper.innerHTML = "";
         for(var i = 0 ; i < getQuestions.getQuestionCollection().length; i++ ){

            numberArr.push(i + 1);
            questHTML = ' <p><span>'+numberArr[i]+' '+ getQuestions.getQuestionCollection()[i].questionText +'</span><button id="question-'+ getQuestions.getQuestionCollection()[i].id +'">edit</button></p>';

           

            domItems.insertedQuestsWrapper.insertAdjacentHTML('afterbegin', questHTML);
         }  

        },

        editQuestionsList: function(event , storageQuestList,addInpsDynFn, updateQuestionListFn){
            var getId , getStorageQuestionList , foundItem , placeInArr ,optionHTML;
            

            if ('question-'.indexOf(event.target.id)){

                getId = parseInt(event.target.id.split('-')[1]);
                getStorageQuestionList = storageQuestList.getQuestionCollection();

                for(var i = 0 ; i < getStorageQuestionList.length; i++){ 

                     if(getStorageQuestionList[i].id === getId){

                         foundItem = getStorageQuestionList[i];
                         placeInArr = i;

                     }

                }

               
                domItems.newQuestionText.value = foundItem.questionText;
                domItems.adminOptionsContainer.innerHTML = '';
                optionHTML = '';

                for (var x = 0 ; x < foundItem.options.length; x++){
                    optionHTML += ' <div class="admin-option-wrapper"><input type = "radio"  class = "admin-option-'+ x +'" name = "answer" value="'+ x +'"><input type = "text"  class = "admin-option admin-option-'+ x +'" value="'+ foundItem.options[x]  +'"></div>'
                     
                }
                     // console.log(optionHTML);
                      domItems.adminOptionsContainer.innerHTML = optionHTML;
                      domItems.questUpdateBtn.style.visibility = 'visible';
                      domItems.questDeleteBtn.style.visibility = 'visible'; 
                      domItems.questionInsertBtn.style.visibility = 'hidden'; 
                      domItems.questClearlsBtn.style.pointerEvents= 'none';


                      addInpsDynFn();

                      var backDefaultView = function(){

                          var updatedEls;

                         domItems.newQuestionText.value = '';
                         udpdatedEls =  document.querySelectorAll(".admin-option");

                                    for(var i = 0; i < udpdatedEls.length ; i++){
                                        udpdatedEls[i].value = '';
                                        udpdatedEls[i].previousElementSibling.checked = false;
                                    }
                                                       
                                        domItems.questUpdateBtn.style.visibility = 'hidden';
                                        domItems.questDeleteBtn.style.visibility = 'hidden'; 
                                        domItems.questionInsertBtn.style.visibility = 'visible'; 
                                        domItems.questClearlsBtn.style.pointerEvents= '';
                                        updateQuestionListFn(storageQuestList);
                      }
                        

                      var updateQuestion = function(){

                          var newOptions, optionEls;
                          
                          newOptions = [];

                          optionEls = document.querySelectorAll(".admin-option");

                          foundItem.questionText = domItems.newQuestionText.value;

                          foundItem.correctAnswer = '';

                          for(var i = 0; i < optionEls.length; i++)
                            {
                                if(optionEls[i].value !== ""){
                                        newOptions.push(optionEls[i].value); 

                                         if(optionEls[i].previousElementSibling.checked){
                                           foundItem.correctAnswer = optionEls[i].value;
                                         }
                                }

                            }
                         foundItem.options = newOptions;
                         if(foundItem.questionText !== ''){
                             if(foundItem.options.length > 1){
                                if(foundItem.correctAnswer !== ''){

                                    getStorageQuestionList.splice(placeInArr, 1, foundItem);
                                    storageQuestList.setQuestionCollection(getStorageQuestionList);

                                   backDefaultView();

                                }
                                else{
                                 alert('Please select a choice, You missed to check an answer or checked an answer without a value');
                               

                                }
                             }else{
                                 alert('Please insert the choices');

                             }
                         }
                         else {
                                 alert('Please insert the question');

                         }
                          console.log(foundItem);
                      }

                      domItems.questUpdateBtn.onclick = updateQuestion;

                       var deleteQuestion =  function(){

                           getStorageQuestionList.splice(placeInArr ,1);
                           storageQuestList.setQuestionCollection(getStorageQuestionList);

                           backDefaultView();
                       }
                      domItems.questDeleteBtn.onclick = deleteQuestion;               

            }
        },

        clearQuestList: function(storageQuestList){
           if(storageQuestList.getQuestionCollection() !== null){
           
                if(storageQuestList.getQuestionCollection().length > 0){

                    var conf = confirm('Warning !! You are about to lose the entire question list');
                    if (conf){
                            storageQuestList.removeQuestionCollection();
                            domItems.insertedQuestsWrapper.innerHTML = '';

                            
                        
                    }
                }
           }
           
        },

        displayQuest: function(storageQuestList, progress){

            var newOptionHtml, characterArr;

             characterArr = ['A','B','C','D','E','F'];
            if (storageQuestList.getQuestionCollection().length > 0){
                domItems.askedQuestText.textContent = storageQuestList.getQuestionCollection()[progress.questIndex].questionText;
                domItems.quizOptionwrapper.innerHTML = "";

                for(var i = 0; i < storageQuestList.getQuestionCollection()[progress.questIndex].options.length; i++){                   
                   
                    
                     newOptionHtml = '<div class="choice-'+ i +'"> <span class="choice-'+ i +'">'+ characterArr[i] +'</span> <p class = "choice-'+ i +'">'+ storageQuestList.getQuestionCollection()[progress.questIndex].options[i] +'</p></div>';
                     domItems.quizOptionwrapper.insertAdjacentHTML( 'beforeend',newOptionHtml);    
                            }
               

            }

        },

        displayProgress: function(storageQuestList , progress){

            domItems.progressBar.max = storageQuestList.getQuestionCollection().length;
            domItems.progressBar.value = progress.questIndex + 1;
            domItems.progressPar.textContent = (progress.questIndex + 1) + '/' + storageQuestList.getQuestionCollection().length;
            

        },

        newDesign: function(ansResult, selectedAnswer){
            var twoOptions, index;

           
                if (ansResult){
                    index = 1;
                }else {
                    index = 0;
                }
            twoOptions = {
                instAnswerText : ['This is a wrong answer', 'This is the correct answer'],
                emotionType: ['images/wrong.png', 'images/correct.png'],
                optionSpanBg: ['rgba(200,0,0 ,.7)', 'rgba(0, 250, 0 , .2)']
            };

            domItems.quizOptionwrapper.style.cssText = "opacity:0.6 ; pointer-events: none;";
            domItems.instAnsContainer.style.opacity = "1";
            domItems.instAnsText.textContent = twoOptions.instAnswerText[index];
            domItems.emotionIcon.setAttribute('src', twoOptions.emotionType[index]);
            selectedAnswer.previousElementSibling.style.backgroundColor = twoOptions.optionSpanBg[index];

        },
         
         resetDesign: function(){
             domItems.quizOptionwrapper.style.cssText = "";
             domItems.instAnsContainer.style.opacity = "0";

         },


         getFullName: function(currPerson, storageQuestList, admin){

                
                if(domItems.firstNameInput.value !== "" && domItems.lastNameInput.value !== ""){

                    if(!(domItems.firstNameInput.value === admin[0] && domItems.lastNameInput.value === admin[1])){  

                        if( storageQuestList.getQuestionCollection().length > 0){

                                currPerson.fullname.push(domItems.firstNameInput.value);
                                currPerson.fullname.push(domItems.lastNameInput.value);

                                domItems.landingPageSect.style.display = "none";
                                domItems.quizSect.style.display = ""; 
                                } else {
                                    alert('There Quiz is not ready, Please contact the administrator');
                                    
                                }                        
                      
                            }else{
                                domItems.landingPageSect.style.display = "none";
                                domItems.adminSect.style.display = "";                     

                                  }
                            }else{
                                alert('Please fill out the fullname details');
                            }

         },
        finalResult: function(currPerson){

            domItems.quizScoreResult.textContent = currPerson.fullname[0] + ' '+ currPerson.fullname[1] + ', your final score is ' + currPerson.score;  
            domItems.quizSect.style.display = "none";   
            domItems.finalResultSection.style.display = "block";

        },

        addResultOnPanel: function(userData){

            var resultHtml;

            //domItems.resultListWrapper.innerHTML = '';
            domItems.resultListWrapper.innerHTML = '';
            
                for (var i = 0 ; i < userData.getPersonData().length; i++){

                    resultHtml = ' <p class="person person-'+ i +'"><span class="person-'+ i +'">'+ userData.getPersonData()[i].firstname +'   '+ userData.getPersonData()[i].lastname +'  - '+ userData.getPersonData()[i].score +'points</span><button id="delete-result-btn_'+ userData.getPersonData()[i].id +'" class="delete-results">Delete<button/></p>';

                    domItems.resultListWrapper.insertAdjacentHTML('afterbegin' ,resultHtml);
                     
                }                 

        },

        deleteResult: function(event, userData){

            var getId ,personArr;

            personArr = userData.getPersonData();

            if('delete-result-btn_'.indexOf(event.target.id)){

              getId = parseInt(event.target.id.split('_')[1]);

               for(var i = 0; i< personArr.length; i++){

                   if(personArr[i].id === getId){
                      
                      personArr.splice(i, 1);
                      userData.setPersonData(personArr);
                   }
               }
              
            }

        }
 
    };


})();


/****************************************************************************************
 *************************** CONTROLLLER**********************************************
 ****************************************************************************************/

var controller = (function (quizCtrl, UICtrl) {

    var selectedDomItems = UICtrl.getDomItems;
    UICtrl.addInputsDynamically();

    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

    selectedDomItems.questionInsertBtn.addEventListener('click', function () {

        var adminOptions = document.querySelectorAll('.admin-option');

        var checkBolean = quizController.addQuestionOnLocalStrorage(selectedDomItems.newQuestionText, adminOptions);

        if (checkBolean){
               UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

        }
    });

    selectedDomItems.insertedQuestsWrapper.addEventListener('click',function(e){

        UICtrl.editQuestionsList(e,quizController.getQuestionLocalStorage,UICtrl.addInputsDynamically, UICtrl.createQuestionList);

    });

    selectedDomItems.questClearlsBtn.addEventListener('click', function(){
   //  UICtrl.clearQuestList(quizCtrl.getQuestionLocalStorage);

   UIController.clearQuestList(quizController.getQuestionLocalStorage);
    });

    UICtrl.displayQuest(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

    UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

    selectedDomItems.quizOptionwrapper.addEventListener('click',function(e){
         var updatedOptionDiv = selectedDomItems.quizOptionwrapper.querySelectorAll('div');

         for(var i = 0 ; i < updatedOptionDiv.length; i++){

             if(e.target.className === 'choice-' + i ){
                 
                 var answer = document.querySelector('.quiz-option-wrapper div p.' + e.target.className);               

                 var answerResult = quizCtrl.checkAnswer(answer);

                 UICtrl.newDesign(answerResult, answer);
                 if(quizCtrl.IsFinished()){
                     selectedDomItems.nextQuestionBtn.textContent = 'Finish';
                 }

                 var nextQuest = function(questdata, progress){
                  
                    
                   if(quizCtrl.IsFinished()){                      
                        
                        quizCtrl.addPerson();

                        UICtrl.finalResult(quizCtrl.getCurrPersonData);
                         


                   }else{
                       
                       UICtrl.resetDesign();
                       quizCtrl.getQuizProgress.questIndex++;

                       UICtrl.displayQuest(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

                         UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);


                   }
                 }

                 selectedDomItems.nextQuestionBtn.onclick = function(){
                     nextQuest(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress); 
                 }


             }
         }
    });

    selectedDomItems.startquizBtn.addEventListener('click', function(){
    UICtrl.getFullName(quizCtrl.getCurrPersonData,quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName); 
    });

    selectedDomItems.lastNameInput.addEventListener('focus', function(){
               
       selectedDomItems.lastNameInput.addEventListener('keypress', function(e){
            
            if(e.keyCode === 13){
               UICtrl.getFullName(quizCtrl.getCurrPersonData,quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName); 

            }
       });
    });

    UICtrl.addResultOnPanel(quizCtrl.getPersonalLocalStorage);

    selectedDomItems.resultListWrapper.addEventListener('click', function(e){
     
     UICtrl.deleteResult(e,quizCtrl.getPersonalLocalStorage);
    UICtrl.addResultOnPanel(quizCtrl.getPersonalLocalStorage);


    });

})(quizController, UIController);   