var config = {
  '.chosen-select'           : {},
};
for (var selector in config) {
  $(selector).chosen(config[selector]);
}

for(var k = 0; k < showHideList.length; k++){
  // alert(showHide);
  var showHide=showHideList[k];
  for(var i = 0; i < showHide.length; i++){
  //  alert(showHide[i]);
    if(showHide[i].length>0)
      $("."+showHide[i]).hide();
  }
}

function SUBMIT_ONE_QUIZ(quiz){
  var i = 0;
  var allSend = "";
  $(quiz).find(".question").each(function(){
    if(!$(this).hasClass("nonquestion")){
      if(i>0)
        allSend+=",\n";
      var val = $(this).val();
      if(val==null){
        val = "No Answer";
      }
      if(val.length < 1){
        val = "No Answer";
      }
      //BTW we will escape the val of each answer so that students can't mess server parsing up
      allSend+=("{q"+i+": "+val+"}");
      i++;
    }
  });
  alert(allSend);
}

/*Will send all quizes if need be
$("#sendAll").on("click",function(){
var i = 0;
$(".quiz").find(".question").each(function(){
var val = $(this).val();
if(val==null){
val = "No Answer";
}
if(val.length < 1){
val = "No Answer";
}
alert("q"+i+": "+val);
i++;
});

});
*/