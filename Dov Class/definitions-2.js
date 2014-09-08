var Type = {};
var STDRD = {};
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
function Q(questionHTML,question){
  
  var container = document.createElement("DIV");
  $(container).append(questionText(questionHTML));
  $(container).append(question);
  //for CSS and for sending quiz to the server
  $(question).addClass("question");
  
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
  
  return textarea;
}
/*
dropDown
placeholder - does not accept placeholder.placevalue
answerlist - list of possible options
isMultiple - differentiates between dropdown and dropdownmultiple

returns the created select (drop down) html element

*/
function dropDown(placeholder,answerList,isMultiple){
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

Type["number"]=function(questionHTML,cols,placeholder){
  var container = Q(questionHTML,
                    textArea(1,cols,placeholder?placeholder:"...","number"));
  
  return container;
  
};
Type["multiquestion"]=function(questionHTML,questionArray){
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
    if($(questionArray[i]).is('div')){
      $(questionArray[i]).children().each(function(){
        if($(this).index()==1){
          $(questionArray[i]).addClass("question");
        }
      });
    }
    $(questionArray[i]).addClass('insidemulti');
    
  }
  
  
  //make sure we can read the answer later (for recursion if desired)
  return container;
  
};

Type["html"]=function(objectHTML){
  //generate entire Object span
  var container = document.createElement("SPAN");
  //gen question text
  $(container).html(objectHTML);
  $(container).addClass("nonquestion");
  
  
  //for multiquestions
  return container;
  
};

Type["code"]=function(questionHTML,rows,cols,placeholder){
  //generate entire Object div
  var container = Q(questionHTML,
                    textArea(rows,cols,placeholder?placeholder:"Your Code Here...","code"));
  
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
Type["essay"]=function(questionHTML,rows,cols,placeholder){
  var container = Q(questionHTML,
                    textArea(rows,cols,placeholder?placeholder:"Your Essay Here...","essay"));
  
  return container;   
  
};

Type["dropdown"]=function(questionHTML,answerList,placeholder){
  //generate entire Object div
  var container = Q(questionHTML,
                    dropDown(placeholder,answerList,false));
  
  
  return container;
};

Type["dropdownmultiple"]=function(questionHTML,answerList,placeholder){
  //generate entire Object div
  var container = Q(questionHTML,
                    dropDown(placeholder,answerList,true));
  
  
  return container;
  
};
/*
returns quesiton span if img, returns
<span><img /></span>
else fills span with html from 'text'

*/
function questionText(text){
  var questionText = document.createElement("SPAN");
  
  $(questionText).html(text.url?"<img src='"+text.url+"' />":text+"&nbsp;");
  $(questionText).addClass("qHTML");
  $(questionText).addClass("nonquestion");
  
  return questionText;
}

/*question
fills in Type[]() function properly

*/
function question(type,a,b,c,d){
  
  if(typeof b === 'string'){
    if(type=="dropdownmultiple"||type=="dropdown"){
      b=STDRD[b];
    }
  }
  return Type[type.toLowerCase()](a,b,c,d);
  
}
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
  STDRD[name]=array;
  return STDRD[name];
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
  var quiz = document.createElement("DIV");
  var timeDiv = document.createElement("DIV");
  var SUBMIT = document.createElement("BUTTON");
  $(SUBMIT).text("SUBMIT");
  
  $(timeDiv).text("Time Elapsed - 00:00:00");
  $(quiz).append(timeDiv);
  
  $(quiz).addClass('quiz');
  for(var i = 0; i < questions.length; i++){
    $(quiz).append(questions[i]);
  }
  $(quiz).append(SUBMIT);
  
  $(SUBMIT).on("click",function(){
    SUBMIT_ONE_QUIZ(quiz);
  });
  
  document.body.appendChild(quiz);
  
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