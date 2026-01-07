import express from "express"
import { getAllNotes,createNote,updateNote,deleteNote,getByIdNotes } from "../controllers/notesControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",authMiddleware ,getAllNotes );
router.get("/:id",authMiddleware, getByIdNotes );
router.post("/",authMiddleware, createNote);
router.put("/:id",authMiddleware, updateNote);
router.delete("/:id",authMiddleware, deleteNote );




export default router;