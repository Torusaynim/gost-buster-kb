import { MongoClient, ObjectId } from 'mongodb';

// const client = new MongoClient("mongodb://localhost:27017")
const client = new MongoClient("mongodb+srv://admin:CUgb45stM6OtGooV@vkr-db.jepfbwd.mongodb.net/test")
const database = client.db('gost-buster-kb')
const users = database.collection('users')
const notes = database.collection('notes')
const roles = database.collection('roles')

const start = async () => {
    try {
        await client.connect()
        console.log('Connected')
    } catch (e) {
        console.log(e)
    }
}

const updateUser = async (user) => {
    await users.updateOne(
        { googleId: user.googleId },
        {
            $setOnInsert: {
                name: user.name, email: user.email, role: user.role
            }
        },
        { upsert: true }
    )
}

const newNote = async (name, group, number, status, tagsArray, note, linksArray) => {
    await notes.insertOne({ name: name, group: group, number: number, status: status, tags: tagsArray, note: note, links: linksArray })
}

const getAllNotes = async () => {
    const res = await notes.find().toArray()
    return res
}

const getNote = async (_id) => {
    try {
        const res = await notes.findOne({ _id: ObjectId(_id) });
        return res;
    } catch (error) {
        return null;
    }
}

const deleteNote = async (_id) => {
    const res = await notes.deleteOne({ _id: ObjectId(_id) })
    return res
}

// _id, name, group, number, status, tags, links, note
const editNote = async (_id, newName, newGroup, newNumber, newStatus, newTags, newLinks, newNote) => {
    console.log(_id, newName, newGroup, newNumber, newStatus, newTags, newLinks, newNote)
    const updateFields = {};

  if (newName !== null && newName !== "") {
    updateFields.name = newName;
  }

  if (newGroup !== null && newGroup !== "") {
    updateFields.group = newGroup;
  }

  if (newNumber !== null && newNumber !== "") {
    updateFields.number = newNumber;
  }

  if (newStatus !== null && newStatus !== "") {
    updateFields.status = newStatus;
  }

  if (newTags !== null) {
    if (newTags !== "") {
      updateFields.tags = newTags.split(", ");
    } else {
      updateFields.tags = [];
    }
  }

  if (newLinks !== null) {
    if (newLinks !== "") {
      updateFields.links = newLinks.split(", ");
    } else {
      updateFields.links = [];
    }
  }

  if (newNote !== null && newNote !== "") {
    updateFields.note = newNote;
  }

  const res = await notes.updateOne({ _id: ObjectId(_id) }, { $set: updateFields });
  return res
}

const getUserById = async (id) => {
    return await users.findOne({ googleId: id })
}

const getPermissionsByRole = async (role) => {
    return await roles.findOne({ role: role })
}

const getUserPermissions = async (userId) => {
    const user = await users.findOne({ googleId: userId })
    const perms = await roles.findOne({ role: user.role })
    return perms
}

start()

export {
    updateUser, newNote, getAllNotes, getNote, deleteNote, editNote, getUserById, getPermissionsByRole, getUserPermissions
}