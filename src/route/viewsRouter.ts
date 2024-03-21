import express from "express"


const viewRouter = express.Router()

viewRouter.get("/",(req, res) => {res.status(200).render("signUp")}) 

viewRouter.get("/login",(req, res) => {res.status(200).render("login")}) 


export default viewRouter;