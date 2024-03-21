import express from "express"


const viewRouter = express.Router()

viewRouter.get("/",(req, res) => {res.status(200).render("signUp")}) 

viewRouter.get("/login",(req, res) => {res.status(200).render("login")}) 

viewRouter.get("/short",(req, res) => {res.status(200).render("shortUrl")}) 


export default viewRouter;