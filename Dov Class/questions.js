//must have a blank option one for question of type dropdown
standard('agree',["","strongly agree", "agree", "no opinion", "disagree", "strongly disagree"]);
standard('code_ques',["","print('hi');", "println()", "main", "String args[]", "strongly put on screen"]);



quiz([
  question("dropdown","Choose the dinosaur!",["",new img("http://www.iconshock.com/img_jpg/SUNNYDAY/animals/jpg/256/dinosaur_icon.jpg"),"A pig.",new img("http://www.clipartbest.com/cliparts/dT7/exK/dT7exK9ac.png")]),
  question("dropdown","What letter does 'apple' begin with?",["","a","b","c"],"Pick a letter."),
  question("dropdown","Do you agree that red is awesome? ",'agree'),
  question("dropdownmultiple","Pick the fruits:",["","tomato","potato","onion","strawberry","raspberry","banana","cat"]),
  question("dropdownmultiple","Pick the fruits",["",
                                                 new img("http://icons.iconarchive.com/icons/artbees/paradise-fruits/256/Tomato-icon.png"),
                                                 new img("http://png-4.findicons.com/files/icons/1187/pickin_time/256/potato.png"),
                                                 new img("http://png-3.findicons.com/files/icons/1187/pickin_time/128/onion.png"),
                                                 new img("http://www.primaldetox.com/wp-content/uploads/Aha-Soft-Torrent-X3-content.ico"),
                                                 new img("https://pbs.twimg.com/profile_images/3253620646/8031eb423b8d91cca462af4825cdfdb2.jpeg")
                                                ],"Pick the fruits"),
  question("dropdownmultiple",new img("http://stereo.gsfc.nasa.gov/beacon/latest_256/ahead_euvi_195_latest.jpg"),["","an orange cat","a blue bat","a green sun"],"What is this?"),
  question("dropdownmultiple","Which of these look like Java?",'code_ques'),
  question("essay","Question Text as HTML<br/>",20,50,"Please write your finest essay on pigs."),
  question("code","Find the error <br/>",20,50,new solidText("public static void main(String args[]){\nSystem.out.println('hi')\n}")),
  question("number","What is 7 x 5 ",5),
  question("number","What is 7 x 5 ",10,"Num..."),
  question("multiquestion","Choose the options to make the code work!<br/>",[
    question("dropdown", "public static void",'code_ques'),
    question("html", "("),
    question("dropdown", "",'code_ques'),
    question("html", "){<br/>"),
    question("dropdown", "System.out.",'code_ques'),
    question("html", "<br/>}")
  ])
]);

