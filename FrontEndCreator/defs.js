var STDRD = {};
var qIDs = [];
var $quiz = '#quiz';

function img(img) {
  this.img = img;
}

//Build a question in a div box and add it to the quiz
function Q(questionHTML, question) {
  //generate entire Object div
  var container = document.createElement("DIV");
  $(container).append(questionHTML);
  $(container).append(question);
  $($quiz).append(container);
  qIDs.push(question); // DOV: what's this for?
}

// build a text area rows x cols with css clas
// and start it with default text
function buildTextArea(rows, cols, clas, defaultText) {
  //gen textarea
  var question = document.createElement("TEXTAREA");
  //set sizing
  $(question).attr("rows",rows);
  $(question).attr("cols",cols);
  
  //optional placeholder or pre assigned value
  $(question).attr("placeholder", defaultText ? defaultText : "");
//  $(question).val(optionalNumber ? optionalNumber : "");
  return question;
}

function buildCode(rows, cols, clas, defaultText) {
  var panel = document.createElement("DIV");
  panel.clas = "control";
  panel.append(img("compile.jpg"));
  var code = buildTextArea(rows, cols, clas, defaultText);
  return code;
}

function matrix(rows, cols, fieldCols, defaultVals) {
  var t = document.createElement("TABLE");
  var c = 0;
  for (var i = 0; i < rows; i++) {
    var r = t.insertRow(i);
    for (var j = 0; j < cols; j++, c++) {
      var d = r.insertCell(j);
      var inp = document.createElement("INPUT");
      inp.setAttribute("type", "text");
      inp.size = fieldCols;
      inp.className = "mat";
      if (defaultVals == null || c >= defaultVals.length)
        inp.value = defaultVals[c];
      d.appendChild(inp);
    }
  }
  return t;
}

function dropdown(choices) {
  if (typeof(choices)!='object') {
    choices = STDRD[choices];
  }
  var s = document.createElement("SELECT");
  for (var i = 0; i < choices.length; i++) {
    var opt = document.createElement("OPTION");
    opt.value = i;
    opt.label = choices[i];
    s.appendChild(opt);
  }
  return s;
}

function radio(choices, container) {
  if (typeof(choices)!='object') {
    choices = STDRD[choices];
  }
  for (var i = 0; i < choices.length; i++) {
    var inp = document.createElement("INPUT");
    inp.type = 'radio';
    inp.value = i;
    //if (typeof(choices[i]) == 'object') handle images!
    inp.label = choices[i];
    container.appendChild(inp);
  }
  return container;
}

    
function buildTextInput(cols, clas, defaultVal) {
  var question = document.createElement("INPUT");
  question.type="number";
  question.class = clas;
  question.size = cols;
  return question;
}

function fillin(questionHTML,cols,optFill,optNum){
  return Q(questionHTML, buildTextArea(1, cols, null, optNum));
};

/* create a regex question. This is only different from fillin
 * when edited on the page not when displaying the answers.
 */
function pattern(questionHTML,cols,optFill,optNum){
  return Q(questionHTML, buildTextArea(1, cols, null, optNum));
};

/* Generate a div box with a list of text, images, and questions
 * Perhaps later, there could be other embedded media types,
 * such as audio or video, so make this a generic display list of
 * objects
 */
function multipart(questions){
  //generate entire Object div
  var container = document.createElement("DIV");
  //gen question text
  $(container).append(questionText(questionHTML));
  //gen textarea
  $(container).addClass('inlineParent');
  
  //remove question from parent and add to the multiquestion
  for(var i = 0; i < questionArray.length; i++){
    questionArray[i] = $( questionArray[i] ).detach();
    $(container).append(questionArray[i]);    
  }
  
  //add it to screen  
  $($quiz).append(container);   
  
  //make sure we can read the answer later (for recursion if desired)
  return container;
};

function code(questionHTML,rows,cols,optionalFill){
  //gen textarea
  var question = buildTextArea(rows, cols, optionalFill);
  return Q(questionHTML, question);
};

function essay(questionHTML,rows,cols,optionalFill){
  var question = buildTextArea(rows,cols, optionalFill);
  return Q(questionHTML, question);  
};

function submitquiz() {
  alert("Quiz completed...");
}

function submit() {
  var inp = document.createElement("INPUT");
  inp.type= "button";
  inp.value = "Submit";
  inp.onclick = "submitquiz()";
  $($quiz).append(inp);
}
