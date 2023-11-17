const express = require("express");
const fileUpload = require("express-fileupload")
const path = require("path");

const filesPayloadExists = require('./middleware/filesPayloadExists');
const fileExtLimiter = require('./middleware/fileExtLimiter');
const fileSizeLimiter = require('./middleware/fileSizeLimiter');


const PORT =process.env.PORT || 3500;

const app = express();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
});
app.post('/upload',
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg']),
    fileSizeLimiter,
    (req, res) => {
        const files = req.files
        console.log(files)

        Object.keys(files).forEach(key => {
            const filepath = path.join(__dirname, 'files', files[key].name)
            files[key].mv(filepath, (err) => {
                if (err) return res.status(500).json({ status: "error", message: err })
            })
        })

        return res.json({ status: 'success', message: Object.keys(files).toString() })
    }
)
/////////////////////////////////////////////////////////////////////////////////////

// Passing fileUpload as a middleware 
app.use(fileUpload()); 
  
// For handling the upload request 
app.post("/upload", function (req, res) { 
  
  // When a file has been uploaded 
  if (req.files && Object.keys(req.files).length !== 0) { 
    
    // Uploaded path 
    const uploadedFile = req.files.uploadFile; 
  
    // Logging uploading file 
    console.log(uploadedFile); 
  
    // Upload path 
    const uploadPath = __dirname 
        + "/uploads/" + uploadedFile.name; 
  
    // To save the file using mv() function 
    uploadedFile.mv(uploadPath, function (err) { 
      if (err) { 
        console.log(err); 
        res.send("Failed !!"); 
      } else res.send("Successfully Uploaded !!"); 
    }); 
  } else res.send("No file uploaded !!"); 
}); 
  



// To handle the download file request 
app.get("/download", function (req, res) { 
  
    // The res.download() talking file path to be downloaded 
    res.download(__dirname + "/download_gfg.txt", function (err) { 
      if (err) { 
        console.log(err); 
      } 
    }); 
  }); 
    
  // GET request to the root of the app 
  app.get("/", function (req, res) { 
    
    // Sending index.html file as response to the client 
    res.sendFile(__dirname + "/index.html"); 
  });
//////////////////////////////////////////////////

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));