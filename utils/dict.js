// turn cc-cedict to spefic format
const data = require('../assets/cc-cedict.json')
const csvwriter = require('csv-writer')
const path = require('path')

// format dict
var dict = data
    .filter(e => {
        const regex = new RegExp('[1-9a-zA-Z$%□○]', 'g')
        return e.traditional.length <= 1 && !regex.test(e.traditional)
    })
    .map(e => {
        const tmp = e.definitionsDiacritic.map(
            e => `<br>• ${e.replace(/\"/g, "'")}`
        )
        const defString = `${tmp.join('')}<br>`
        return {
            char: e.traditional,
            def: `<big><font color='#f00'>${e.pinyinDiacritic}</font></big>${defString}`,
        }
    })

// 如果要寫成 json
/*
fs.writeFile('data.json', JSON.stringify(dict), err => {
    if (err) {
        console.error(err)
        return
    }
    //file written successfully
})
**/

// to csv
var createCsvWriter = csvwriter.createObjectCsvWriter
const csvWriter = createCsvWriter({
    path: path.join(__dirname, '../assets/my-cc-cedict.csv'),
    header: [
        { id: 'char', title: 'character' },
        { id: 'def', title: 'defination' },
    ],
})

csvWriter
    .writeRecords(dict)
    .then(() => console.log('Data uploaded into csv successfully'))
