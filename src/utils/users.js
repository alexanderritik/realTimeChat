// here are we going to maintain a record of the user room and id

// adduser removeuser  getuser getuserroom newroom

const users=[]

const adduser=({id,username,room})=>{

    // clean the data
 
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    

    // validate the data
    if(!username || !room)
    {
        return {
            error:"Username and room are required!"
        }
    }


    // check existing data
    const existinguser=users.find((user)=>{
        return  user.username===username && user.room===room
    })

    if(existinguser)
    {
        return {
            error:"Username already present in room!"
        }  
    }
    // now add the data
    const user={id,username,room}
    users.push(user)
    return {user}
}


const removeuser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })
    // if did not find the id -1 and find the id then greter than 1
    if(index!==-1)
    {
        // it return an array and splice method reove user from that index and
        // 1 menas only one user
       return users.splice(index,1)[0]   
    }
}

const getuser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })
    // if did not find the id -1 and find the id then greter than 1
    if(index==-1)
    {
       return undefined
    }
    console.log(users[index])
    return users[index]
}


const getUserInRoom=(room)=>{
    const roomuser=[]
    const inroom=users.find((user)=>{
       if(user.room==room)
       {
           roomuser.push(user)
       }
    })

    return roomuser
}




module.exports={
    adduser,
    removeuser,
    getuser,
    getUserInRoom
}


// adduser({
//     id:1,
//     username:"alexander",
//     room:"Mrj"
// })

// adduser({
//     id:2,
//     username:"alekavixander",
//     room:"Mrj"
// })
// adduser({
//     id:3,
//     username:"alesaxander",
//     room:"Mrj"
// })

// adduser({
//     id:4,
//     username:"alesax1wander",
//     room:"Mrj"
// })

// const res1=getuser(34)
// console.log(res1)

// const res=getUserInRoom("mr1j")
// console.log(res)