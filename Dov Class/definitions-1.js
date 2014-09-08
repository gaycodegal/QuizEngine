var Type = {};
var STDRD = {};

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
    $(questionArray[i]).addClass('insidemulti');
    $(questionArray[i]).addClass("question");
    
    
  }
  
  
  //make sure we can read the answer later (for recursion if desired)
  return container;
  
};

Type["html"]=function(objectHTML){
  //generate entire Object span
  var container = document.createElement("SPAN");
  //gen question text
  $(container).html(objectHTML);
  
  
  //for multiquestions
  return container;
  
};

Type["code"]=function(questionHTML,rows,cols,placeholder){
  //generate entire Object div
  var container = Q(questionHTML,
                    textArea(rows,cols,placeholder?placeholder:"Your Code Here...","code"));
  
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
sets up a new quiz choices list
TODO: add submit button to the end of each quiz
*/
function quiz(questions){
  var quiz = document.createElement("DIV");
  $(quiz).addClass('quiz');
  for(var i = 0; i < questions.length; i++){
    $(quiz).append(questions[i]);
  }
  document.body.appendChild(quiz);
}