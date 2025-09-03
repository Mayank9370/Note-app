const Note = require('../models/Note');

// @desc    Get all notes for the authenticated user
exports.getNotes = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    const query = { 
      userId: req.user._id,
      isArchived: { $ne: true }
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = {};

    if (sortBy === 'title') sortObj.title = sortOrder;
    else if (sortBy === 'updatedAt') sortObj.updatedAt = sortOrder;
    else sortObj.createdAt = sortOrder;

    sortObj.isPinned = -1; // pinned notes on top

    const notes = await Note.find(query)
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-__v');

    const total = await Note.countDocuments(query);

    res.status(200).json({
      success: true,
      data: notes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching notes' });
  }
};

// @desc    Get single note
exports.getNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id }).select('-__v');
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ success: false, message: 'Note not found' });
    console.error('Get note error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching note' });
  }
};

// @desc    Create new note
exports.createNote = async (req, res) => {
  try {
    const { title, content, tags, isPinned } = req.body;
    const note = new Note({
      title,
      content,
      userId: req.user._id,
      tags: tags || [],
      isPinned: isPinned || false
    });
    await note.save();
    res.status(201).json({ success: true, message: 'Note created successfully', data: note });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating note' });
  }
};

// @desc    Update note
exports.updateNote = async (req, res) => {
  try {
    const { title, content, tags, isPinned, isArchived } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, content, tags: tags || [], isPinned: isPinned || false, isArchived: isArchived || false },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    res.status(200).json({ success: true, message: 'Note updated successfully', data: note });
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ success: false, message: 'Note not found' });
    console.error('Update note error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating note' });
  }
};

// @desc    Delete note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.status(200).json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ success: false, message: 'Note not found' });
    console.error('Delete note error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting note' });
  }
};

// @desc    Toggle note pin status
exports.togglePin = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    note.isPinned = !note.isPinned;
    await note.save();

    res.status(200).json({ success: true, message: `Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully`, data: note });
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ success: false, message: 'Note not found' });
    console.error('Toggle pin error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating note' });
  }
};

// @desc    Archive/Unarchive note
exports.toggleArchive = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    note.isArchived = !note.isArchived;
    await note.save();

    res.status(200).json({ success: true, message: `Note ${note.isArchived ? 'archived' : 'unarchived'} successfully`, data: note });
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ success: false, message: 'Note not found' });
    console.error('Toggle archive error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating note' });
  }
};
