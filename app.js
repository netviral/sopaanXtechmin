const express=require("express");
const app=express();
const port=process.env.PORT || 3000;
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose = require('mongoose');
var cors = require('cors');
day=2;
totalClues=7;

app.use(cors());


app.set('view engine', 'ejs');

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/sopaan", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const teamSchema = new mongoose.Schema({
    _id:Number,
    teamName: {
        type:String,
        unique:true,
        required:true
    },
    teamMembers: String,
    teamSize: Number,
    leaderName:String,
    leaderEmail:String,
    leaderPhone:Number,
    code:Number,
    clues:[Number],
    track:Number,
    day:Number,
  },{ timestamps: true });

  const cluesSchema = new mongoose.Schema({
    _id:Number,
    clueNumber:Number,
    day:Number,
    track:Number,
    code:String,
    clue:String,
  });


const Team = mongoose.model('Team', teamSchema);
const Clue = mongoose.model('Clue', cluesSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, function(req,res){
    console.log("listening on port "+ port)
});

const options = {
    dotfiles: 'ignore',
    etag: false,
    // extensions: ['htm', 'html'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders (res, path, stat) {
      res.set('x-timestamp', Date.now())
    }
  }

app.use(express.static(__dirname+'/public'))

function generateOTP(length) {
    var string = '0123456789';
    let OTP = '';
    var len = string.length;
    for (let i = 0; i < length; i++ ) {
        OTP += string[Math.floor(Math.random() * len)];
    }
    return +OTP;
}

app.post("/api/clues/register",function(req,res){
    if(req.query.key=="protected"){
        const payload = req.body;  // Assuming the incoming JSON array is in the request body
        console.log(req.body);
        Clue.insertMany(payload)
            .then(insertedDocuments => {
            res.status(201).json({ message: 'Data saved successfully', insertedDocuments });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'An error occurred' });
        });
    }else{
        res.status(403).json({ error: 'Forbidden' });
    }
});

app.post("/api/teams/register",function(req,res){
    if(req.query.key=="protected"){
        const payload = req.body;  // Assuming the incoming JSON array is in the request body
        Team.insertMany(payload)
            .then(insertedDocuments => {
            res.status(201).json({ message: 'Data saved successfully', insertedDocuments });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'An error occurred' });
        });
    }else{
        res.status(403).json({ error: 'Forbidden' });
    }
    // leaderName=req.body.name;
    // track=req.body.track;
    // day=req.body.day;
    // leaderPhone=req.body.phone;
    // leaderEmail=req.body.email;
    // teamName=req.body.teamName;
    // teamMembers=req.body.teamMembers;
    // numberOfMembers=req.body.teamSize;
    // code=generateOTP(5);
    // Team.countDocuments({})
    // .then(count => {
    //     const newTeam = new Team({
    //         _id:count+1,
    //         teamName: teamName,
    //         teamMembers: teamMembers,
    //         teamSize: numberOfMembers,
    //         leaderName:leaderName,
    //         leaderEmail:leaderEmail,
    //         leaderPhone:leaderPhone,
    //         code:code,
    //         track:track,
    //         day:day,
    //         clues:[],
    //     });
    //     // Save the new Team document
    //     newTeam.save()
    //     .then(savedTeam => {
    //         console.log('Team created:', savedTeam);
    //         res.status(202).send(savedTeam);
    //     })
    //     .catch(error => {
    //         console.error('Error creating team:', error);
    //         res.status(403).send(error);
    //     })
    //     .finally(() => {
    //     });
    // })
    // .catch(err => {
    //     console.error('Error:', err);
    // });   
});

app.get("/", function(req,res){
    res.render("landingpage")
});

// app.get("/end", function(req,res){
//     res.render("congratulations")
// });

app.get("/clues/:track/:number",function(req,res){
    day=day;
    track=(req.params.track);
    if(req.params.number==0 && req.query.key=="protected"){
        Team.find({day:day,track:track})
        .then(teams => {
            res.render("start",{teams:teams,track:req.params.track,number:req.params.number,btn:"Start Treasure Hunt",greet:"All the best for the hunt"})
        })
        .catch(err => {
            res.render('error',{msg:err})
            console.error('Error:', err);
        });
    }else if(req.params.number>totalClues){
            res.render('error',{msg:"No such clue!"})
    }else{
        Clue.findOne({clueNumber: req.params.number,track:req.params.track,day:day})
        .then(clue => {
            if (clue) {
                if(clue.code==req.query.code){
                    if(req.params.number==totalClues){
                        Team.find({day:day,track:track,clues:req.params.number-1})
                    .then(teams => {
                        res.render("start",{teams:teams,track:req.params.track,number:req.params.number,btn:"Finish Treasure Hunt",greet:"Last to go"})
                    })
                    .catch(err => {
                        console.error('Error:', err);
                        res.render('error',{msg:err})

                    });
                    }else{
                    Team.find({day:day,track:track,clues:req.params.number-1})
                    .then(teams => {
                        res.render("start",{teams:teams,track:req.params.track,number:req.params.number,btn:"Get Next Clue",greet:"Congratulations"})
                    })
                    .catch(err => {
                        console.error('Error:', err);
                    });
                }
                }else{
                    res.render('error',{msg:"Are you trying to mess around? Wrong QR scanning or lost letter. Clue code is wrong."})
                }
            } else {
                res.render('error',{msg:"Clue not found."})
            }
        })
        .catch(err => {
            res.render('error',{msg:err})
            console.error('Error:', err);
        });

    }
});

app.post("/clues/:track/:number",function(req,res){
    day=day;
    // console.log(req.params.track,req.params.number,req.body.teamName,req.body.code)
    Team.findOne({teamName:req.body.teamName,track:req.params.track,day:day}).then(team => {
        if(team){
            if(team.code==req.body.code){
                if(team.clues.includes(req.params.number)){
                    Clue.findOne({ clueNumber: Number(req.params.number)+1,track:req.params.track,day:day})
                            .then(foundClue => {
                                console.log(foundClue)
                                if (foundClue) {
                                    res.render('error',{msg:"You've already submitted this clue. Your next clue is: "+foundClue.clue})
                                } else {
                                    res.render('error',{msg:"You've already submitted this clue. Go to next."})
                                }
                            })
                }else if(req.params.number!=0 && !team.clues.includes(Number(req.params.number)-1)){
                    res.render('error',{msg:"Answer previous clues first. "})
                }else if(req.params.number==totalClues){
                    Team.updateOne(
                        { _id: team._id },
                        { $push: { clues: [req.params.number] } }
                      )
                        .then(result => {
                        //   console.log('Team updated:', result);
                          if(result){
                                res.render("congratulations")
                            }
                        })
                        .catch(error => {
                            res.render('error',{msg:'Error updating team:'})
                            console.error('Error updating team:', error);
                        })
                } else if(req.params.number>totalClues){
                    res.render('error',{msg:"No such clue"})
                }else{
                    Team.updateOne(
                        { _id: team._id },
                        { $push: { clues: [req.params.number] } }
                      )
                        .then(result => {
                        //   console.log('Team updated:', result);
                          Clue.findOne({ clueNumber: Number(req.params.number)+1,track:req.params.track,day:day})
                            .then(foundClue => {
                                console.log(foundClue)
                                if (foundClue) {
                                    res.render("clue_page",{clue:foundClue.clue,number:foundClue.clueNumber});
                                } else {
                                    res.render('error',{msg:"You've reached the end"})
                                }
                            })
          
                        })
                        .catch(error => {
                            res.render('error',{msg:'Error updating team:'})
                          console.error('Error updating team:', error);
                        })
                }
            }else{
                res.render('error',{msg:"Incorrect team code. Please enter the correct one."})
            }
        }else{
            res.render('error',{msg:"Error, no such team in database"})
        }
    });
});

app.get("/leaderboard/:number",function(req,res){
    Team.find({day:day,track:req.params.number}).sort({'clues':-1,'updatedAt':1})
    .then(docs => {
      res.render("leaderboard", { docs: docs });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});

app.get("/api/leaderboard/:number",function(req,res){
    Team.find({day:day,track:req.params.number}).sort({'clues':-1,'updatedAt':1})
    .then(docs => {
      res.send(docs);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
})

app.get("*",function(req,res){
    res.render("error",{msg:"404 not found"});
});
