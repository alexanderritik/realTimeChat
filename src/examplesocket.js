const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')

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

let cout=1

// connection is the name of event it fires when soocket io get new connection
io.on('connection',(socket)=>{
    // here socket is an object passed on connection which conatins client detail
    console.log('new web socket connection '+ cout)

    // emit is used to send to client js name of event must matched 
    // value which we want to pass is after event name and order matter in 
    // receving but name donot
    
    socket.emit('updatecount',cout)


    socket.on('increment',()=>{
        cout++;
        console.log('increment click in client js '+ cout)

        // there is diffrence between socket.emit and io.emit
        // socket.emit sends to particular client which it get connected to
        // io.emit send connection to all the  connected clent
        // socket.emit('updatecount',cout)
        io.emit('updatecount',cout)
    })

})


// this is the command we use to start the server
server.listen(port,()=>{
	console.log('We start the post a port')

})
