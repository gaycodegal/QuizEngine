<html>
<script>
(function(){
var array = [];
  
  
  for(var i = 1; i < 3; i++){
    
    array[i] = getLengthOf(x,length);
    
  }
  alert(array.join("|"));
  
function getLengthOf(x,length){
    length++;

if(array[x]){
return length+array[x];
}else{
  x = x % 2 == 0 ? x/2 : x*3 + 1;
return length+getLengthOf(x,length);
}
  
}

})();
</script>
</html>