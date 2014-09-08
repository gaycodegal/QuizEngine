//must have a blank option one for question of type dropdown

standard('qTypes',["","Drop Down", "Multidrop-down", "Number Fillin", "Essay", "Code"]);

standard('qTypes2',["","dropdowns", "multidropdowns", "numfillins", "essays", "codes"]);
standard('correct',["Correct","Incorrect"]);
standard('incorrect',["Incorrect","Correct"]);


quiz([
  
  question("dropdown","Type of Question:",choices['qTypes'],'Choose a type...',choices['qTypes2']),
  question("essay","Question Text:",3,30,'Your text here...'),
  questionSet("dropdowns multidropdowns",[
    question("essay","Placeholder Text:",3,30,'Your text here...'),
    question("multiquestion","",[
      question("essay","Answer Choice 1:",3,30,'Your text here...'),
      question("dropdown","",choices['correct'])
    ]),
    question("multiquestion","",[
      question("essay","Answer Choice 2:",3,30,'Your text here...'),
      question("dropdown","",choices['incorrect'])
    ]),
    question("multiquestion","",[
      question("essay","Answer Choice 3:",3,30,'Your text here...'),
      question("dropdown","",choices['incorrect'])
    ])
  ]),
  questionSet("codes",[
    question("essay","Base Code:",3,30,'Your base code here...')
  ]),
  questionSet("numfillins essays",[
    question("essay","Placeholder Text:",3,30,'Your placeholder text here...')
  ])
]);

