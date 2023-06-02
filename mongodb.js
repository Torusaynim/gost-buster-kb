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

const editNote = async (_id, anotherName, anotherSum) => {
    console.log(_id, anotherName, anotherSum)
    if (anotherName === "Sample name" && anotherSum != "Sample sum") {
        const res = await notes.updateOne({ _id: ObjectId(_id) }, { $set: { "requested": parseInt(anotherSum) } })

    }
    else if (anotherSum === "Sample sum" && anotherName != "Sample name") {
        const res = await notes.updateOne({ _id: ObjectId(_id) }, { $set: { "name": anotherName, } })
    }
    else {
        const res = await notes.updateOne({ _id: ObjectId(_id) }, { $set: { "name": anotherName, "requested": parseInt(anotherSum) } })
    }
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