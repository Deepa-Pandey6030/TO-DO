import Note from "../models/Note.js";

// ✅ Get all notes of logged-in user
export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    console.log("Error in getAllNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ✅ Get a single note by ID (only if it belongs to user)
export async function getByIdNotes(req, res) {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!note)
      return res.status(404).json({ message: "Note not found" });

    res.status(200).json(note);
  } catch (error) {
    console.log("Error in getByIdNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ✅ Create note for logged-in user
export async function createNote(req, res) {
  try {
    const { title, content } = req.body;

    const note = new Note({
      title,
      content,
      userId: req.userId, // 🔐 CRITICAL
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.log("Error in creating note", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ✅ Update note (only if it belongs to user)
export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, content },
      { new: true }
    );

    if (!updatedNote)
      return res.status(404).json({ message: "Note not found" });

    res.status(200).json(updatedNote);
  } catch (error) {
    console.log("Error in updating note", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ✅ Delete note (only if it belongs to user)
export async function deleteNote(req, res) {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deletedNote)
      return res.status(404).json({ message: "Note not found" });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.log("Error in deleting note", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
