import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import mongoSanitize from 'express-mongo-sanitize';
import { updateUser, newNote, getAllNotes, getNote, getUserNotes, deleteNote, editNote, supportNote, getUserById, getPermissionsByRole, getUserPermissions } from './mongodb.js'

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const app = express();
app.use(express.json());
app.use(mongoSanitize());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
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

app.post('/api/new-Note', async (req, res) => {
    const { user, name, sum } = req.body;
    console.log(req.body);
    await newNote(user, name, sum);
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

app.get('/api/get-user-Notes/:googleId', async (req, res) => {
    const userNotes = await getUserNotes(req.params.googleId)
    res.status(200);
    // console.log(userNotes)
    res.json(userNotes)
});

app.post('/api/delete-Note', async (req, res) => {
    const { _id } = req.body;
    const delete_note = await deleteNote(_id)
    res.json(delete_note)
})

app.post('/api/edit-Note', async (req, res) => {
    const { _id, name, sum } = req.body;
    console.log({ _id, name, sum })

    const edit_note = await editNote(_id, name,sum)
    res.json(edit_note)
})

app.post('/api/support-Note', async (req, res) => {
    const { _id, sum } = req.body;
    console.log({ _id, sum })

    const edit_note = await supportNote(_id, sum)
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