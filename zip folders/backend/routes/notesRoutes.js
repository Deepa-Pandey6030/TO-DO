import express from "express"
import {
    getAllNotes,
    createNote,
    updateNote,
    deleteNote,
    getByIdNotes
} from "../controllers/notesControllers.js";
import { register, login } from "../controllers/authController.js"
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", protect, getAllNotes);
router.get("/:id", protect, getByIdNotes);
router.post("/", protect, createNote);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);



export default router;