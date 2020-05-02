var socket=io()

// element
const messagebutton=document.getElementById('check')
const locationbutton=document.getElementById('location')
const message=document.getElementById('message')
const printlocation=document.getElementById('printlocation')
const sidebar=document.getElementById('sidebar')

// template
const messageTemplate=document.getElementById('message-template').innerHTML
const locationTemplate=document.getElementById('location-template').innerHTML
const sidebarTemplate=document.getElementById('sidebar-template').innerHTML

// query string
const {key,username,room}=Qs.parse(location.search , {ignoreQueryPrefix:true})


const autoscroll=()=>{
    // new messagge by of message div
    const newmessage=message.lastElementChild

    // get the hegiht of new message
    // we do not hard card how so ever we know the style padding sinceif we change that
    // then auto scrolling do not work
    const newmessagestyle=getComputedStyle(newmessage)
    
    // here we get the margin bottom of newmessagestyle
    const newmessagemargin=parseInt(newmessagestyle.marginBottom)
    const newmessageheight=newmessage.offsetHeight+newmessagemargin
    // console.log(newmessagemargin)

    // visble height
    const visbleheight=message.offsetHeight
    
    // height of message container
    const containerheight=message.scrollHeight

    // how far i scroll and add scrollbar height
    const scrolloffset=message.scrollTop+visbleheight

    // console.log(containerheight , newmessageheight , scrolloffset)
    if(containerheight-newmessageheight <= scrolloffset)
    {
        message.scrollTop=message.scrollHeight
    }
}


socket.on('welcome',()=>{
    console.log('welcome client')
})

socket.on('message',(client)=>{
    // console.log(client)
    const html=Mustache.render(messageTemplate,{
        username:client.username,
        text:client.text,
        createdAt:moment(client.createdAt).format('h:mm a')
    })
    message.insertAdjacentHTML('beforeend',html)
})

socket.on('locationreceive',({username,url})=>{
    const html=Mustache.render(locationTemplate,{username:username,location:url})
    message.insertAdjacentHTML('beforeend',html)
    autoscroll();
})

socket.on('recivemsg',(msg)=>{
    // console.log(msg)
    const html=Mustache.render(messageTemplate,{
        username:msg.username,
        text:msg.text,
        createdAt:moment(msg.createdAt).format('h:mm a')
    })
    message.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    messagebutton.setAttribute('disabled','disabled')
    const msg=document.getElementById('msg').value
    document.getElementById('msg').value='';
    document.getElementById('msg').focus()
    // console.log(msg)
    socket.emit('sendmsg',msg,()=>{
        messagebutton.removeAttribute('disabled')
        
        
    })
})

locationbutton.addEventListener('click',()=>{ 
    if(!navigator.geolocation){
     return    console.log('Geo location is not supported')
    }
    // when you click send location button it become disabled and on callback get enabled
    locationbutton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        // console.log(position)
        const coordinate={
            latitude:position.coords.latitude ,
            longitude:position.coords.longitude
        } 
        // emit pass a third option which is callback function reponse for acknowledgement
        socket.emit('sendlocation',coordinate,(msg)=>{
            console.log(msg)
            locationbutton.removeAttribute('disabled')
            // if there is chance of error you can apply if function
        }) 
    })
})



socket.emit('join',{username,room} ,(error)=>{

    if(error)
    {
        alert(error)
        location.href='/'
    }
})

socket.on('roomData',({room,users})=>{
    // console.log(room)
    // console.log(users)
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    sidebar.innerHTML=html
})


// on function is call when it recives info from your app socket.io 
// the function name must matched from severside js emit evnt name

// the argument which we recives is present in after evnt name
// the anme does not matter but the order matter in which it recevied
// socket.on('updatecount',(count)=>{
//     console.log('we made a sucessful connection '+count) 
// })
