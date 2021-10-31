const zlib = require('zlib');
const fs = require("fs");
const Path = require("path");
 
let arg = process.argv.slice(2);
if (arg.length < 2)
    throw "Not enough arguments. Pass name of the folder and archive to output to."

let folderPath = arg[0];
let archivePath = arg[1];
let flag = '';
if (arg.length > 2)
    flag = arg[2];

let fileToImport = class 
{
    constructor(filePath, fileName, fileSize, fileOffset, fileListOffset) 
    {
      this.filePath = filePath;
      this.fileName = fileName;
      this.fileSize = fileSize;
      this.fileOffset = fileOffset;
      this.fileListOffset = fileListOffset;
    }
  };

function throughDirectory(directory) 
{
    fs.readdirSync(directory).forEach(file => 
    {
        const absolutePath = Path.join(directory, file);
        if (fs.statSync(absolutePath).isDirectory()) return throughDirectory(absolutePath);
        else return filePaths.push(absolutePath);
    });
}

function calculateHeaderSize(filePaths)
{
    let headerSize = 12;
    for (let i in filePaths) headerSize += filePaths[i].replace(folderPath, '').split('\\').join('/').slice(1).length + 12;
    return headerSize;
}

function getFilesizeInBytes(filename) 
{
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats.size;
    return fileSizeInBytes;
}

let filePaths = [];
throughDirectory(folderPath);
let currentOffset = calculateHeaderSize(filePaths);
let headerBuffer = Buffer.alloc(currentOffset);

let files = [];
for (let i in filePaths)
{
    let fileSize = getFilesizeInBytes(filePaths[i]);
    let fileImported = new fileToImport(filePaths[i], filePaths[i].replace(folderPath, '').split('\\').join('/').slice(1), fileSize, currentOffset);
    files.push(fileImported);
    currentOffset += fileSize;
}

headerBuffer.write('BFPK', 0);
headerBuffer.writeInt32LE(files.length, 8);
currentOffset = 12;
for (let i in files)
{
    headerBuffer.writeInt32LE(files[i].fileName.length, currentOffset);
    currentOffset += 4;
    headerBuffer.write(files[i].fileName, currentOffset);
    currentOffset += files[i].fileName.length;
    headerBuffer.writeInt32LE(files[i].fileSize, currentOffset);
    currentOffset += 4;
    files[i].fileListOffset = currentOffset;
    headerBuffer.writeInt32LE(files[i].fileOffset, currentOffset);
    currentOffset += 4;
}

fs.writeFileSync(archivePath + '.tmp', '');

if (flag == 'zip')
{
    let currentReplaceOffset = files[0].fileOffset;
    headerBuffer.writeInt32LE(1, 4);
    for (let i in files)
    {
        headerBuffer.writeInt32LE(currentReplaceOffset, files[i].fileListOffset);

        let inputFile = fs.readFileSync(files[i].filePath);
        let deflated = zlib.deflateSync(inputFile);
        let sizeCompressed = Buffer.alloc(4);
        sizeCompressed.writeInt32LE(deflated.length);

        currentReplaceOffset += deflated.length + 4;

        fs.writeFileSync(archivePath + '.tmp', sizeCompressed, {flag:'a'});
        fs.writeFileSync(archivePath + '.tmp', deflated, {flag:'a'});
    }
}
else {
    for (let i in files)
    {
        let inputFile = fs.readFileSync(files[i].filePath);
        fs.writeFileSync(archivePath + '.tmp', inputFile, {flag:'a'});
    }
}

let paddingEnd = Buffer.alloc(0x10000);
fs.writeFileSync(archivePath + '.tmp', paddingEnd, {flag:'a'});

fs.writeFileSync(archivePath, headerBuffer);

let w = fs.createWriteStream(archivePath, {flags: 'a'});
let r = fs.createReadStream(archivePath + '.tmp');

w.on('close', function() {
    console.log("done");
    fs.unlinkSync(archivePath + '.tmp')
});

r.pipe(w);