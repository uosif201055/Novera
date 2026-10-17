require("dotenv").config();
const express = require("express");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const { Pool } = require("pg");
if (!process.env.DATABASE_URL) { console.error("set DATABASE_URL in .env"); process.exit(1); }
const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
app.disable("x-powered-by");
app.use(express.json({limit:"16kb"}));
app.get("/api/health",async(req,res)=>{try{await pool.query("SELECT 1");res.json({ok:true})}catch(e){res.status(503).json({ok:false})}});
app.get("/api/foundations",async(req,res)=>{try{const {rows}=await pool.query("SELECT id,name,description,position FROM foundations ORDER BY position");res.json(rows)}catch(e){res.status(500).json({error:"database unavailable"})}});
app.get("/api/chapters",async(req,res)=>{try{const {rows}=await pool.query("SELECT id,foundation_id,title,summary,position FROM chapters WHERE published = TRUE ORDER BY position");res.json(rows)}catch(e){res.status(500).json({error:"database unavailable"})}});
app.get("/api/chapters/:id/lessons",async(req,res)=>{try{const {rows}=await pool.query("SELECT l.id,l.title,l.body,l.position FROM lessons l JOIN chapters c ON c.id=l.chapter_id WHERE c.id=$1 AND c.published=TRUE ORDER BY l.position",[req.params.id]);res.json(rows)}catch(e){res.status(500).json({error:"database unavailable"})}});
app.post("/api/learners",async(req,res)=>{try{const id=randomUUID();await pool.query("INSERT INTO learners(id) VALUES($1)",[id]);res.status(201).json({id})}catch(e){res.status(500).json({error:"database unavailable"})}});
app.get("/api/learners/:id/progress",async(req,res)=>{try{const {rows}=await pool.query("SELECT chapter_id,step,completed,updated_at FROM chapter_progress WHERE learner_id=$1", [req.params.id]);res.json(rows)}catch(e){res.status(400).json({error:"invalid learner id or database unavailable"})}});
app.put("/api/learners/:id/progress/:chapter",async(req,res)=>{
 const {step,completed}=req.body||{};
 if(!Number.isInteger(step)||step<0||step>10000||typeof completed!=="boolean")return res.status(400).json({error:"invalid progress"});
 try{
 const {rows}=await pool.query(`INSERT INTO chapter_progress(learner_id,chapter_id,step,completed)
 SELECT $1,$2,$3,$4 WHERE EXISTS(SELECT 1 FROM learners WHERE id=$1)
 AND EXISTS(SELECT 1 FROM chapters WHERE id=$2 AND published=TRUE)
 ON CONFLICT(learner_id,chapter_id) DO UPDATE SET step=EXCLUDED.step,completed=EXCLUDED.completed,updated_at=NOW()
 RETURNING chapter_id,step,completed,updated_at`,[req.params.id,req.params.chapter,step,completed]);
 if(!rows.length)return res.status(404).json({error:"learner or chapter not found"});
 res.json(rows[0]);
 }catch(e){res.status(400).json({error:"invalid request or database unavailable"})}
});
app.use(express.static(path.join(__dirname)));
app.listen(Number(process.env.PORT)||4173,()=>console.log("novera running on http://localhost:"+(Number(process.env.PORT)||4173)));
