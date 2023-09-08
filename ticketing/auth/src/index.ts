import express from "express";

const app = express();
app.use(express.json());

app.get('/api/users/currentUser',(req,res)=>{
  res.status(200).send({Hello:"World"})
})

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});

