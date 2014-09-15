var Type = {};
var choices = {};
var tabIndex = 1;

//This is needed to store the show/hide lists until the end so we can hide everything!
var showHideList=[];

//this is just here for reference!! No effect yet!
var options = {
  timed : false,
  showAnswers: false,
  scored: true,
  shuffle: false,
  allowMultipleAttempts: true,
  scoring: "highest",
  firstRepeatPenalty: 10,
  repeatPenalty: 0,
  showResponsesAfterEachAttempt: true,
  showResponsesAfterFinalAttempt: true,
  showCorrectAnswers: true,
  showCorrectAnswersStartingAt: "datestamp",
  hideCorrectAnswersStartingAt: "datestamp",
  displayAllQuestions: true
};

/*
question factory 'Q'
Takes html (or url img()) and a html element
puts them into a div like so:

<div>
<span>html</span>
question elem here
</div>

returns the containing div to be added to a quiz or multiquestion

*/
function questionSet(qClass,questions){
  
  var container = document.createElement("DIV");
  
  for (var i = 0; i < questions.length; i++){
    $(container).append(questions[i]);
    //for CSS and for sending quiz to the server
    if($(questions[i]).is('div')){
      $(questions[i]).children().each(function(){
        if($(this).index()==1){
          $(this).addClass("question");
        }
      });
    }
  }
  $(container).addClass(qClass); 
  
  
  return container;
}

function Q(questionHTML,question){
  
  var container = document.createElement("DIV");
  $(container).append(questionText(questionHTML));
  
  for (var i = 1; i < arguments.length; i++){
    $(container).append(arguments[i]);
    //for CSS and for sending quiz to the server
    $(arguments[i]).addClass("question");
  }
  
  
  
  return container;
}
/*
Makes a new textarea and returns it
rows: rows="" attribute
cols: cols="" attribute
placeholder (often preset by sender function): placeholder text
hasclass - useful for adding the classes for the different types of textareas:
number passes hasclass=number
essay and code do the same

returns html element textarea
*/
function textArea(rows,cols,placeholder,hasclass){
  //gen textarea
  var textarea = document.createElement("TEXTAREA");
  //set sizing
  $(textarea).attr("rows",""+rows);
  
  
  
  
  
  $(textarea).attr("cols",""+cols);
  
  //optional placeholder or pre assigned value
  //if placeholder has placevalue, make the text editable
  if(placeholder.placevalue){
    $(textarea).val(placeholder.placevalue);
  }else{
    $(textarea).attr("placeholder",placeholder?placeholder:"Your Answer Here...");
  }
  
  if(hasclass){
    //for CSS
    $(textarea).addClass(hasclass);
    
  }
  $(textarea).attr("tabindex",""+tabIndex);
  tabIndex++;
  
  
  return textarea;
}
/*
dropDown
placeholder - does not accept placeholder.placevalue
answerlist - list of possible options
isMultiple - differentiates between dropdown and dropdownmultiple

returns the created select (drop down) html element

*/
function dropDown(placeholder,answerList,showHide,isMultiple){
  if(typeof answerList == 'string'){
    answerList = choices[answerList];
  }
  if(typeof showHide == 'string'){
    showHide = choices[showHide];
  }
  var question = document.createElement("SELECT");
  //placeholder
  $(question).attr("data-placeholder",placeholder?placeholder:"Pick an Answer...");
  //stuff to make chosen recoginze this
  $(question).addClass("chosen-select");
  $(question).addClass("drop");
  $(question).attr("tabindex","2");
  if(isMultiple){
    //for CSS  
    $(question).addClass("multidrop");
    //for chosen js
    $(question).attr("multiple","");
  }else{
    //for CSS
    $(question).addClass("singledrop");
    
  }
  
  
  //adds the possible answers as 'options' in a 'select' element
  for(var i = 0; i < answerList.length; i++){
    
    var option = document.createElement("OPTION");
    if(answerList[i].url){
      answerList[i]=answerList[i].url;
      if(answerList[i].length>0){
        $(option).html((i)+"<br/><img src='"+answerList[i]+"' />");
      }
    }else{
      if(answerList[i].length>0){
        $(option).text(answerList[i]);
      }
    }
    $(option).attr("value",answerList[i]);
    $(question).append(option);   
    
  }
  $(question).data("index","0");
  if(showHide){
    showHideList.push(showHide);
    $(question).change(function(){
      if(showHide[parseInt($(this).data("index"))].length > 0)
        $("."+showHide[parseInt($(this).data("index"))]).hide();
      $("."+showHide[this.selectedIndex]).show();
      $(this).data("index",""+this.selectedIndex);
    });
  }
  
  
  $(question).attr("tabindex",""+tabIndex);
  tabIndex++;
  return question;
}

/*Type defs
number - number fillin
multiquestion - constructor for questions
html - html in a span
code - code textarea
essay - essay textarea
dropdown - select list single response
dropdownmultiple - select list multiple response


*/
Type.series=function(args){
  var questionHTML = args[0],
      eachQuestionText = args[1];
  var questionList = [];
  for(var i = 0; i < 10; i++){
    questionList.push(questionsFromText(eachQuestionText,i));
  }
  
  var container = Q(questionHTML,
                    questionSet('series',questionList));
  
  return container;
  
};

Type.number=function(args){
  var questionHTML = args[0],
      cols = args[1],
      placeholder = args[2];
  var container = Q(questionHTML,
                    textArea(1,cols,placeholder?placeholder:"...","number"));
  
  return container;
  
};
Type.multiquestion=function(args){
  var questionHTML = args[0],
      questionArray = args[1];
  //generate entire Object div
  var container = document.createElement("DIV");
  //gen question text
  $(container).append(questionText(questionHTML));
  //gen textarea
  $(container).addClass('inlineParent');
  $(container).addClass('multiquestion');
  
  
  //adds question to multiquestion (to be added to the quiz)
  for(var i = 0; i < questionArray.length; i++){
    $(container).append(questionArray[i]);
    
    /*
    To find the 'question' of each 'container' div,
    first check for div, all questions are inside of divs (html is a span)
    then child at index 1 (index 0 is question text)
    this may have to be redone later.
    
    */
    
    if($(questionArray[i]).is('div')){
      $(questionArray[i]).children().each(function(){
        if($(this).index()==1){
          $(this).addClass("question");
        }
      });
    }
    $(questionArray[i]).addClass('insidemulti');
    
  }
  
  
  //make sure we can read the answer later (for recursion if desired)
  return container;
  
};

Type.html=function(args){
  var objectHTML = args[0];
  //generate entire Object span
  var container = document.createElement("SPAN");
  //gen question text
  $(container).html(objectHTML);
  $(container).addClass("nonquestion");
  
  
  //for multiquestions
  return container;
  
};

Type.code=function(args){
  var questionHTML = args[0],
      rows = args[1],
      cols = args[2],
      placeholder = args[3],
      rows2 = args[4],
      cols2 = args[5],
      placeholder2 = args[6];
  
  //generate entire Object div
  var container = Q(questionHTML,
                    textArea(rows?rows:20,cols?cols:60,placeholder?placeholder:"Your Code Here...","code"),
                    textArea(rows2?rows2:20,cols2?cols2:30,placeholder2?placeholder2:"Server Response","code"));
  
  /*
  This only applies to code containers
  This allows us to stop run and comiple java code
  TODO: link buttons to function to send code to server
  */
  var stop = document.createElement("BUTTON");
  $(stop).text("stop");
  $(stop).addClass("button stop");
  $(container).append(stop);
  
  var run = document.createElement("BUTTON");
  $(run).text("run");
  $(run).addClass("button run");
  $(container).append(run);
  
  var compile = document.createElement("BUTTON");
  $(compile).text("compile");
  $(compile).addClass("button compile");
  $(container).append(compile);
  
  return container;   
  
  
  
};
Type.essay=function(args){
  var questionHTML = args[0],
      rows = args[1],
      cols = args[2],
      placeholder = args[3];
  
  var container = Q(questionHTML,
                    textArea(rows,cols,placeholder?placeholder:"Your Essay Here...","essay"));
  
  return container;   
  
};

Type.dropdown=function(args){
  var questionHTML = args[0],
      answerList = args[1],
      placeholder = args[2],
      showHide = args[3];
  //generate entire Object div
  var container = Q(questionHTML,
                    dropDown(placeholder,answerList,showHide,false));
  
  
  return container;
};

Type.dropdownmultiple=function(args){
  var questionHTML = args[0],
      answerList = args[1],
      placeholder = args[2],
      showHide = args[3];
  //generate entire Object div
  var container = Q(questionHTML,
                    dropDown(placeholder,answerList,showHide,true));
  
  
  return container;
  
};


/*
These are the functions to show & hide
question sets.
*/

/*
These are the functions to add/remove questions
from the parent element of the button sender.
Must still write
*/

/*
Generate text with the format of text and then [x]
*/
/*
Eventually I plan to use json and each array in json becomes an object so
[object,[object2, ...],[object3,[object4,...]...]...]
would make something like
<object>
<object2>
...
</object2>
<object3>
<object4>
...
</object4>
...
</object3>
...
</object>
*/
choices.nums=['0','1','2','3','4','5','6','7','8','9'];
choices.nums.repeats=true;

function objectFromText(object,index){
  if(object[0]=='list'){
    return textIndex(object[1],index);
  }else{
    var type = object.shift();
    for(var i = 0; i < object.length; i++){
      object[i] = unescape(object[i]);
      
    }
    return question(unescape(type),object);
  }
}
function questionsFromText(text,index,QType){
  var container = document.createElement(QType?QType:"DIV");
  //gen question text
  if(!index){
    index=0;
  }
  if(text.indexOf(']')!=-1){
    var textArray = text.split(']');
    for(var i = 0; i < textArray.length; i++){
      if(textArray[i].indexOf('[')!=-1){
        var innerArray = textArray[i].split('[');
        if(innerArray[1].indexOf(':')!=-1){
          var object = innerArray[1].split(':');
          $(container).append(innerArray[0]);
          $(container).append(objectFromText(object,index));
          
        }else{
          $(container).append(innerArray);
          
        } 
      }else{
        $(container).append(textArray[i]);
        
      }
    }
  }else{
    $(container).append(text);
  }
  return $(container);
}



/*
Returns the value at index for a standard- for example
the standard of:
'0','1' would return the binary representation of a number
*/
function textIndex (strd,index) {
  if(choices[strd].length>index){
    return choices[strd][index];
  }else{
    //115
    // 115 > 10
    
    if(choices[strd].repeats){
      var returnStr = "";
      while(index>=choices[strd].length){
        returnStr = choices[strd][index%choices[strd].length] + returnStr;
        index -= index%choices[strd].length;
        index /= choices[strd].length;
      }
      returnStr = choices[strd][index] + returnStr;
      return returnStr;
    }else{
      return choices[strd][index%choices[strd].length];
    }
  }
}
/*
FROMTEXT
*/
function fromText(text,index){
  this.fromText=text;
  this.index=index;
}
/*
returns quesiton span if img, returns
<span><img /></span>
else fills span with html from 'text'

*/
function questionText(text){
  
  var questionTextContainer;
  if(typeof text == 'string'){
    questionTextContainer = document.createElement("PRE");
    $(questionTextContainer).html(text);
  }else if(text.url){
    questionTextContainer = document.createElement("PRE");
    $(questionTextContainer).html("<img src='"+text.url+"' />");
  }else if(text.fromText){
    questionTextContainer = questionsFromText(text.fromText,text.index,"PRE");
  }
  $(questionTextContainer).addClass("qHTML");
  $(questionTextContainer).addClass("nonquestion");
  
  return questionTextContainer;
}

/*question
fills in Type[]() function properly

*/
function question(type,ars){
  
  var args = [];
  if(arguments.length == 2 && typeof ars == 'object'){
    args = ars;
  }else{
    for(var i = 1; i < arguments.length; i++){
      args.push(arguments[i]);
    }
  }
  
  return Type[type.toLowerCase()](args);
  
}
/*
This is a constructor to create a question from text format:
This is my [q:dropdown] quiz
And here is my [q:dropdownmultiple:]
*/

/*
makes text solid
*/
function solidText(placevalue){
  this.placevalue=placevalue;
}
/*
makes text into an img 
*/
function img(url){
  this.url=url;
}
/*
sets up a new standard choices list
*/
function standard(name,array){
  
  choices[name]=array;
  
  return choices[name];
  
}

/*
returns time in hh:mm:ss
used for human readable display
*/
function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;
  
  return (hrs<10?"0"+hrs:hrs) + ':' + (mins<10?"0"+mins:mins) + ':' + (secs<10?"0"+secs:secs);// + '.' + ms;
}
/*
sets up a new quiz choices list
TODO: add submit button to the end of each quiz
*/
function quiz(questions){

  var quizContainer = document.createElement("DIV");
  var timeDiv = document.createElement("DIV");
  var SUBMIT = document.createElement("BUTTON");
  $(SUBMIT).text("SUBMIT");
  
  $(timeDiv).text("Time Elapsed - 00:00:00");
  $(quizContainer).append(timeDiv);
  
  $(quizContainer).addClass('quiz');
  for(var i = 0; i < questions.length; i++){
    $(quizContainer).append(questions[i]);
  }
  
  
  $(quizContainer).append(SUBMIT);
  
  $(SUBMIT).on("click",function(){
    SUBMIT_ONE_QUIZ(quizContainer);
  });
  
  document.body.appendChild(quizContainer);
  
  /*
  TODO, quiz starts hidden with a click to take quiz button.
  Then run the start function to make the quiz appear,
  and start the timer
  */
  var start = function(){
    var startTime = (new Date()).getTime();
    setInterval(function(){
      var endTime = (new Date()).getTime();
      $(timeDiv).text("Time Elapsed - "+msToTime(endTime-startTime));
    },500);
  };

  //will be removed on TODO completion
  start();
}
