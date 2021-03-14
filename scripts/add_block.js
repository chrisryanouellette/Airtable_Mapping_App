'use strict'

const fs = require("fs")
const path = require('path')

const {
    getFilesNames,
    inverTextColor,
    query
} = require('./utils')

const options = []

/** Asks the user what to name the file.
 * A blank response will use the defualt file name 'remote.json'
 */
function requestName() {
	const question = 'What is the name of the base this blocks is running in?\nNo response will create the default file called "remote.json"'
	query(question, (response) => {
        if(!response) {
            options[0] = ''
        } else {
            options[0] = response
        }
        runProcess()
    })
}

/** Asks the user for the Base and App ID */
function requestId() {
	let question = 'What is the Base ID & Block ID? Ex, app92ce2v332v/blk23f32fhf2\n'
	const fileNames = getFilesNames('.block/')
	if(fileNames) {
        question += inverTextColor('Current Bases:') + '\n'
        question += fileNames + '\n'
	}
	query(question, (response) => {
        if(!response) {
			console.log('ERROR: Response Required')
            return process.kill()
		}
		if(
			!response.includes('app')
			|| !response.includes('blk')
			|| !response.includes('/')
		) {
			console.log('ERROR: Invalid App or Block ID. Must start with \'app\' & \'blk\' and be seprated with a /')
            return process.kill()
		}
		const [appId, blockId] = response.split('/')
		options[1] = appId
		options[2] = blockId
        runProcess()
    })
}

/** Creates the file */
function createBlockFile() {
	const data = {
		baseId: options[1],
		blockId: options[2]
	}
    const fileName = options[0] ? options[0] + '.remote.json' : 'remote.json'
	fs.writeFileSync(
		path.join(__dirname, '../.block/', fileName),
		JSON.stringify(data, undefined, 4)
	)
	process.exit(0)
}

function runProcess() {
    switch(options.length) {
		case 0:
			requestName()
			break
        case 1:
		case 2:
            requestId()
            break
		case 3:
			createBlockFile()
        default:
			console.error('Invalid number of arguments')
			process.exit()
    }
}

process.argv.splice(0, 2)
process.argv.map((opt, i) => options[i] = opt)

runProcess()
