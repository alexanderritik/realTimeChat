const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const {generatemessage}=require('./utils/message')
const {adduser,removeuser,getuser,getUserInRoom}=require('./utils/users')


const app=express()

// to include socket io we need the server which is implicit present in express so we make
// little changes
const server=http.createServer(app)

// here socket io called the server now our server supposr socket
const io=socketio(server)

// this is used in herouk to provide the port by heroku 
const port=process.env.PORT || 3000;
const publicdirectorypath=path.join(__dirname,'../public')

// it contains the static page
app.use(express.static(publicdirectorypath))

app.get('',(req,res)=>{
res.sendFile('index.html')
})



// connection is the name of event it fires when soocket io get new connection
// it is provide by socket si donot change name
io.on('connection',(socket)=>{
// here socket is an object passed on connection which conatins client detail
// console.log(socket)

// emit is used to send to client js name of event must matched 
// value which we want to pass is after event name and order matter in 
// receving but name donot






// when we want to send message to all client except the one who sents
// socket.broadcast.emit('message','a new user is joined')





socket.on('sendmsg',(msg,callback)=>{
    // console.log(msg)
    const user=getuser(socket.id)
    if(user){
        io.to(user.room).emit('recivemsg',generatemessage(user.username,msg))
    }

    callback()
})

    
socket.on('sendlocation',(coords,callback)=>{
    const user=getuser(socket.id)
    console.log(user.username)
    const detail={
        username:user.username,
        url:`https://google.com/maps?q=${coords.latitude},${coords.longitude}`
    }

    socket.broadcast.to((user.room)).emit('locationreceive',detail)
    // here callback is acknwoledgement
    callback('your location succesfully sents')
})
    
    
// it is also a built in function which fires when clent leaves
socket.on('disconnect',()=>{
    const user=removeuser(socket.id)
    if(user)
    {
        io.to(user.room).emit('message',generatemessage(`${user.username} has left!`))

        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserInRoom(user.room)
        })
    }
})





socket.on('join',({username,room} ,callback)=>{
    //socket .join allow to enter to that specific room which provide message to that room 
    const {error,user}=adduser({id:socket.id ,username ,room})

    if(error)
    {
       return callback(error)
    }
    socket.join(user.room)
    // io.to.emit to emit message to everyone that specific room
    // socket.broadcast.to.emit to everyone except that person
    // socket.emit('message',generatemessage(`${username} has joined!`))
    socket.emit('message',generatemessage('Admin - Ritik','Welcome to realtalky'))
    socket.broadcast.to(user.room).emit('message',generatemessage(`${user.username} has joined!`))
    io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUserInRoom(user.room)
    })
    callback()
})




})





// this is the command we use to start the server
server.listen(port,()=>{
	console.log('We start the post a port')

})
