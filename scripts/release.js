'use strict'

const fs = require("fs")
const path = require('path')
const { exec } = require('child_process');

const {
    getFilesNames,
    inverTextColor,
    query
} = require('./utils')

const options = []

function requestBase() {
    let question = '\nWhat base would you like to release to? ( default: remote )\n'
    const fileNames = getFilesNames('.block/', ['remote.json'])
    if(fileNames) {
        question += inverTextColor('Options:') + '\n'
        question += fileNames + '\n'
    }
    query(question, (response) => {
        if(response && !isNaN(response)) {
            const index = Number(response) - 1
            const files = fileNames.split('\n')
            if(files[index]) {
                options[0] = files[index].substring(files[index].indexOf(' ') + 1)
            } else {
                console.log('ERROR: invalid option')
                process.kill()
            }
        } else if(response && !response.includes('remote')) {
            options[0] = response
        } else {
            options[0] = ''
        }
        runProcess()
    })
}

function checkMappings() {
    const filePath = path.join(__dirname, '../frontend/index.tsx')
    const indexFile = fs.readFileSync(filePath).toString()
    let importLine = indexFile.substring(0, indexFile.indexOf('.mappings.json'))
    importLine = importLine.substring(importLine.lastIndexOf('/') + 1)
    if(importLine !== options[1]) {
        console.log(`Import: ${importLine} does not meet requested: ${options[1]}`)
        process.exit(1)
    }
}
function requestMappings() {
    let question = '\nWhat mappings should be used? ( default: development )\n'
    let fileNames = getFilesNames('frontend/mappings/', ['development.mappings.json'])
    if(fileNames) {
        question += inverTextColor('Options:') + '\n'
        question += fileNames + '\n'
    }
    query(question, (response) => {
        if(response && !isNaN(response)) {
            const index = Number(response) - 1
            const files = fileNames.split('\n')
            if(files[index]) {
                options[1] = files[index].substring(files[index].indexOf(' ') + 1)
            } else {
                console.log('ERROR: invalid option')
                process.kill()
            }
        } else if(response) {
            options[1] = response
        } else {
            options[1] = 'development'
        }
        checkMappings()
        runProcess()
    })
}

function releaseBlock() {
    const command = `block release${options[0] && options[0] !== 'null' ? ` --remote ${options[0]}` : ''}${options[2] ? ' --disable-isolated-build' : ''}`
    console.log('EXECUTING: ', command)
    exec(command, function(error, stdout, stderr) {
        if (error) {
            console.log(error.stack)
            console.log('Error code: '+ error.code)
            console.log('Signal received: '+ error.signal)
            process.kill(1)
          }
          console.log(stdout)
          if(stdout.includes('successfully released block!')) process.exit(0)
    })
}

function runProcess() {
    switch(options.length) {
        case 0: //Only ran file
            requestBase()
            break
        case 1: // 
            if(fs.existsSync(path.join(__dirname, '../frontend/mappings'))) {
                requestMappings()
            } else {
                options[1] = null
                runProcess()
            }
            break
        case 2:
            query('\nRun with Isolated Build? Y / N ( Default: N )\n\n', (response) => {
                options[2] = (response && response.toLowerCase() === 'y') ? true : false
                runProcess()
            })
            break
        case 3:
            releaseBlock()
            break
        default:
            console.log('Invalid number of arguments')
    }
}

process.argv.splice(0, 2)
process.argv.map((opt, i) => options[i] = opt)

runProcess()

