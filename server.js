const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieSession = require('cookie-session');

const dbUrl = require('./config/constants').dbUrl;
const productionRouter = require('./routes/api/production');
const authRouter = require('./routes/api/auth/auth');
const userRouter = require('./routes/api/users/User')
const app = express();
const port = process.env.PORT||5000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(
  cookieSession({
    name:"anthony-session",
    keys:["secret"],
    httOnly:true
  })
);

const db = require('./model/index');
const Role = db.role;

db.mongoose
  .connect(dbUrl)
  .then(()=> {
    console.log('mongodb connect succesfully');
    initial();
  })
  .catch((error)=>console.log(error));

app.use('/api/production', productionRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.use(cors());

app.listen(port, ()=>{
  console.log(`server is running on ${port}`);
});

function initial() {
  Role.countDocuments()
  .then(() => {
    new Role({
      name:"user"
    }).save()
    .then(()=> console.log("added 'user' to roles collection")
  )
    new Role({
      name:"moderator"
    }).save()
    .then(()=> console.log("added 'moderator' to roles collection")
  );
    new Role({
      name:"admin"
    }).save()
    .then(()=> console.log("added 'admin' to roles collection")
  );
  })
  .catch(err=>console.log(err));
}