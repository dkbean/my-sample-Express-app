<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project 3 - File Upload and Download</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css">
</head>
<body>
    <div class="ui container">
        <h2 class="ui header">Upload a File</h2>
        <form id="upload-form" class="ui form">
            <div class="field">
                <label for="file">Choose a .txt file:</label>
                <input type="file" id="file" name="file" accept=".txt" required>
            </div>
            <button class="ui primary button" type="submit">Upload</button>
        </form>

        <h2 class="ui header">Download a File</h2>
        <form id="download-form" class="ui form">
            <div class="field">
                <label for="fileName">Enter file name:</label>
                <input type="text" id="fileName" name="fileName" required>
            </div>
            <button class="ui primary button" type="submit">Download</button>
        </form>
    </div>

    <script src="upload.js"></script>
    <script src="download.js"></script>
</body>
</html>