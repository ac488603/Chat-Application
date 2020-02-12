const users = []

const addUsers = ({id,username,room}) => {
    //sanitze data 
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate data
    if(!username || !room){
        return {
            error : "username and room are requried."
        }
    }

    //check if username is unique

    const exists = users.find(user => {
        return user.room === room && user.username ==username
    })

    if(exists){
        return {
            error: "username is not unique"
        }
    }

    const user = {username, room, id}
    users.push(user)
    return {user}
}

const removeUsers = (id) => {
    const index  = users.findIndex((user) => {
        return user.id == id
    })
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find( user => {
        return user.id = id
    })
}

const getUsersInRoom = (room) => {
    return users.filter( user => user.room == room) 
}
