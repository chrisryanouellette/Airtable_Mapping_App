const fs = require("fs")
const path = require('path')

module.exports.inverTextColor = function(message) {
    return '\x1b[47m\x1b[30m' + message + '\x1b[0m'
}

module.exports.query = function(text, callback) {
    process.stdin.resume()
    console.log(text)
    process.stdin.once("data", function (data) {
        callback(data.toString().trim())
    })
}

module.exports.getFilesNames = function(dir, avoid) {
    const files = fs.readdirSync(path.join(__dirname, '../', dir))
    let fileNames = ''
    if(files.length) {
        let inc = 0
        fileNames += files.filter(file => !avoid || !avoid.includes(file))
        .map(file => {
            inc++
            return `${inc}: ` + file.substring(0, file.indexOf('.'))
        }).join('\n')
    }
    return fileNames
}