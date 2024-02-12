import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt"
const salting=10;
const db=new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "auth",
  password: "777888",
  port: 5432,
})
const app = express();
const port = 3000;
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const name=req.body.username;
  const password=req.body.password;
  console.log(name);
  try{
    bcrypt.hash(password,salting,async (err,hash)=>{
      if(err){
        console.log("heloo");
        console.log(err);
      }
      else{
      const result = await db.query(
        "INSERT INTO auth (email, pass) VALUES ($1, $2)",
        [name, hash,]
      );
      console.log(result);
      res.render("secrets.ejs");
      }
    })
    
  }
  catch(err){
    console.log(err);
    res.render("register.ejs");
  }
});

app.post("/login", async (req, res) => {
  const name=req.body.username;
  const password=req.body.password;
  try{
    const result=await db.query("select pass from auth where email=$1;",[name,]);
    if(result.rows.length<=0){
      console.log(result);
      res.render("login.ejs");
    }
    else{
        const pass=result.rows[0].pass;
        console.log(pass);
        bcrypt.compare(password,pass,(err,result)=>{
          if(err){
            console.log(err);
          }
          else{
            if(result){
              res.render('secrets.ejs');
            }
            else{
              res.send("incorrect password");
            }
          }
        })
    }
  }
  catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
