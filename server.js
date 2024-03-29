import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { OAuth2Client } from 'google-auth-library';
import mongoSanitize from 'express-mongo-sanitize';
import { updateUser, newNote, getAllNotes, getNote, deleteNote, editNote, getUserById, getPermissionsByRole, getUserPermissions } from './mongodb.js'

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
      // Check if the file type is PDF
      if (file.mimetype !== 'application/pdf') {
        cb(new Error('Only PDF files are allowed'));
      } else {
        cb(null, true);
      }
    },
    limits: {
      fileSize: 15 * 1024 * 1024, // 15 MB
    },
});

const app = express();
app.use(express.json());
app.use(mongoSanitize());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/uploads', express.static('uploads'))

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      // Multer error
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ error: 'File size exceeds the limit' });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      // Other errors
      res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/google-login', async (req, res) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const { sub, name, email } = ticket.getPayload();
    const user = {
        googleId: sub,
        name: name,
        email: email,
        role: 'user'
    }
    await updateUser(user)
    res.status(201);
    res.json(user);
});

app.post('/api/new-Note', upload.single('file'), async (req, res) => {
    const { name, group, number, status, tagsArray, note, linksArray } = req.body;
    const file = req.file;
    console.log(req.body);

    const timestamp = Date.now();

    if (file) {
        const ext = path.extname(file.originalname);
        const fileName = `${timestamp}${ext}`;

        // Rename the file with the timestamp and original extension
        fs.renameSync(file.path, path.join(file.destination, fileName));

        await newNote(name, group, number, status, tagsArray, note, linksArray, `uploads/${fileName}`);
    } else {
        await newNote(name, group, number, status, tagsArray, note, linksArray, null); // Pass null if no file is uploaded
    }
    res.json('created Note')
});

app.get('/api/get-all-Notes', async (req, res) => {
    const notes = await getAllNotes()
    res.status(200);
    res.json(notes)
});

app.get('/api/get-Note/:id', async (req, res) => {
    try {
        const note = await getNote(req.params.id);
        if (note) {
          res.status(200).json(note);
        } else {
          res.status(404).json({ error: 'Note not found' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve note' });
      }
});

app.post('/api/delete-Note', async (req, res) => {
    const { _id } = req.body;
    const delete_note = await deleteNote(_id)
    res.json(delete_note)
})

app.post('/api/edit-Note', async (req, res) => {
    const { _id, name, group, number, status, tags, links, note } = req.body;
    console.log({ _id, name, group, number, status, tags, links, note })

    const edit_note = await editNote(_id, name, group, number, status, tags, links, note)
    res.json(edit_note)
})

app.get('/api/get-user/:id', async (req, res) => {
    const user = await getUserById(req.params.id)
    res.json(user)
})

app.get('/api/get-permissions/:role', async (req, res) => {
    const perms = await getPermissionsByRole(req.params.role)
    res.json(perms.permissions)
})

app.get('/api/get-user-permissions/:userId', async (req, res) => {
    const perms = await getUserPermissions(req.params.userId)
    res.json(perms)
})

app.listen(process.env.PORT || 5000, () => {
    console.log(
        `Server is ready at http://localhost:${process.env.PORT || 5000}/`
    );
});