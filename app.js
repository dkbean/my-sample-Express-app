const express = require("express")
const AWS = require("aws-sdk")
const multer = require("multer")
const fs = require("fs")
const path = require("path")

// Configure AWS SDK
AWS.config.update({ region: "ap-northeast-1" }) // replace 'your-region' with your region
const s3 = new AWS.S3()
const dynamoDB = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" })

const app = express()
const upload = multer({ dest: "uploads/" })
const PORT = process.env.PORT || 80

const S3_BUCKET = "cloud-internship-project3-s3" // updated S3 bucket name
const DYNAMODB_TABLE = "S3MetadataTable" // updated DynamoDB table name

// Serve static files from public directory
app.use(express.static("public"))

// Feature 1: Upload file to S3 and save metadata to DynamoDB
app.post("/upload", upload.single("file"), (req, res) => {
  // console.log("Start uploading file")
  const file = req.file
  if (!file) {
    return res.status(400).send("No file uploaded.")
  }

  const fileStream = fs.createReadStream(file.path)
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: file.originalname, // You can customize the key (filename) as needed
    Body: fileStream,
  }
  console.log("Uploaded file s3Params: ", metadata)

  s3.upload(s3Params, (err, data) => {
    if (err) {
      return res.status(500).send("Error uploading file to S3")
    }

    const metadata = {
      TableName: DYNAMODB_TABLE,
      Item: {
        key: file.originalname, // 'key' is used as the primary key attribute
        uploadTime: new Date().toISOString(),
        s3Uri: data.Location,
      },
    }

    console.log("Uploaded file metadata(DynamoDB): ", metadata)
    dynamoDB.put(metadata, (err) => {
      if (err) {
        console.log("Failed to put to dynamoDB with err: ", err)
        return res.status(500).send("Error saving metadata to DynamoDB")
      }

      fs.unlinkSync(file.path) // Remove the file from the server after upload
      res.status(200).send("File uploaded and metadata saved.")
    })
  })
})

// Feature 2: Search file by name and download from S3
app.get("/download", (req, res) => {
  const fileName = req.query.fileName
  if (!fileName) {
    return res.status(400).send("File name is required.")
  }

  const searchParams = {
    TableName: DYNAMODB_TABLE,
    Key: {
      fileName: fileName,
    },
  }

  dynamoDB.get(searchParams, (err, data) => {
    if (err || !data.Item) {
      return res.status(404).send("File not found.")
    }

    const s3Params = {
      Bucket: S3_BUCKET,
      Key: data.Item.s3Uri.split("/").pop(),
    }

    s3.getObject(s3Params, (err, fileData) => {
      if (err) {
        return res.status(500).send("Error downloading file from S3")
      }

      res.setHeader("Content-Disposition", `attachment; filename=${fileName}`)
      res.send(fileData.Body)
    })
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
