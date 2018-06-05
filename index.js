var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var json = require('express-json');



app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function (req, res) {
  res.sendfile('views/main.html');
});

app.get('/questions', function(req, res){
    fs.readFile('questions.json', 'utf8', function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        var jsondata = JSON.parse(data);
        res.write('<form method="POST" action="/answers">');
        res.write('<select name="question">');
        for (var i=0; i<jsondata.questions.length; i++){
            var myQuestion = jsondata.questions[i];
            res.write('<option value="'+i+'">');
            res.write(myQuestion.question + '\n');
            res.write('</option>');
            }
          res.write('</select><input value="GO!" type="submit" name ="find"></form>');
        res.end();
    })
});



app.post('/answers', function (req, res) {
  var num = parseInt(req.body.question);
  fs.readFile('questions.json', 'utf8', function (err, data) {
      var jsondata = JSON.parse(data);
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('<style type="text/css">.question { background: #edf4ad; margin: 0 20% 0 20% ;width: 60%;padding: 5px;padding-right: 20px;border-radius:20px; border: solid 1px #d7dee8; float: left;}</style>')
      res.write('<style type="text/css">.answer { margin: 0 35% 0 35% ;width: 30%;padding: 5px;padding-right: 20px;border-radius:20px; border: solid 1px #d7dee8; float: left;}</style>')
      var myQuestion = jsondata.questions[num];
      res.write('<div class="question"><p align = "center" style = "font-size: 180%;font-family: Verdana, Arial, Helvetica, sans-serif; ">'+myQuestion.question + '</p></div>' + '\n');
      res.write('<br>');
      var answers = jsondata.questions[num].answers;
      for (var j=0; j<answers.length; j++){
        res.write('<div class="answer"><i><p  style = "margin-left: 5%; font-size: 90%;font-family: Verdana, Arial, Helvetica, sans-serif; ">'+'\n');
        res.write(answers[j].name );
        res.write('</p></i><p align = "center" style = " font-size: 110%;font-family: Verdana, Arial, Helvetica, sans-serif; ">'+'\n');
        res.write(answers[j].answer );
        res.write('</p></div><br>');
      }

      res.write('<br>');

      res.write('<div class="answer" style=" padding: 1% 0% 1% 2%">');
      res.write('<form method="POST" action="/addAnswer"  >');
      res.write('<input name="questionId" type="hidden" value="'+num+'">');
      res.write('Name:<br>');
      res.write('<input type="text" name="name"  ><br>');
      res.write('Answer:<br>');
      res.write('<input type="text" name="answer" size="42" height="20" style="height: 60px"  >');

      res.write('</select><input value="Add" type="submit" name ="Add"></form>');
      res.write('</form>' );
      res.write('</div>');


      res.end();
  })

});


app.post('/addAnswer', function (req, res) {

  fs.readFile('questions.json', 'utf8', function (err, data) {
    let jsondata = JSON.parse(data);
    var num = parseInt(req.body.questionId);
    var newAnswer = jsondata.questions[num].answers;
    newAnswer.push({name: req.body.name, answer: req.body.answer});
    fs.writeFileSync('questions.json', JSON.stringify(jsondata));
    res.redirect('/');
  })
});


app.get('/ask', function (req, res) {
    res.sendfile('views/question.html');
});



app.post('/addQuestion', function (req, res) {
  fs.readFile('questions.json', 'utf8', function (err, data) {
    let jsondata = JSON.parse(data);
    var newQuestion = jsondata.questions;
    newQuestion.push({question: req.body.newQuestion, answers: []});
    fs.writeFileSync('questions.json', JSON.stringify(jsondata));
    res.redirect('/');
  })
});





app.listen(8080, function () {
  console.log(`Застосунок прослуховує 8080-ий порт! http://localhost:8080`);
});
