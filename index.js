const express = require('express');
const ejs = require('ejs');
const multer = require('multer');
const app = express();
const path = require('path');


// Storage
const storage = multer.diskStorage({
    destination : './public/uploads',
    filename: function(req, file , cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});



//Int Upload
const upload = multer({
    storage:storage,
    limits:{ fileSize: 1000000},
    fileFilter: function (req,file,cb){
        checkFiletype(file,cb)
    },

}).single('myimg');


// cheak file type
function checkFiletype (file,cb){
    //Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    //check ext 
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mine type
    const mine = filetypes.test(file.mimetype);

    if(mine && extname){
        return cb(null,true)
    }else{
        cb('Error: image only!')
    }
}

//ejs
app.set('view engine','ejs');
//Public Folder
app.use(express.static('./public'));

// Home Route
app.get('/',(req,res) => {
    res.render('home');
});

app.post('/upload',(req,res) => {
    upload(req,res, (err) => {
        if(err){
            res.render('home', { msg:err })
        }else{
            if(req.file == undefined){
                res.render('home', {msg : 'please upload an Img'})
            }else{
                res.render('home', { 
                    msg : 'Img uploaded ',
                    file: `uploads/${req.file.filename}`
                });

            }
            
        }
    })
});


const PORT =  process.env.PORT || 5500;

app.listen(PORT,(req,res) => {
    console.log('Port Has Been Started At 5500');
});

