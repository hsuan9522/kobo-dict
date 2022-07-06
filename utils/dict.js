// turn cc-cedict to spefic format
const data = require('../assets/cc-cedict.json')
const csvwriter = require('csv-writer')
const path = require('path')

// format dict
var dict_trandition = data
    .filter(e => {
        const regex = new RegExp('[1-9a-zA-Z$%□○〥〻]', 'g')
        const regex2 = new RegExp('^[A-Z].*', 'g')
        return (
            e.traditional.length <= 1 &&
            !regex.test(e.traditional) &&
            !regex2.test(e.pinyinDiacritic)
        )
    })
    .map(e => {
        const tmp = e.definitionsDiacritic.map(
            e => `<br>• ${e.replace(/\"/g, "'")}`
        )
        const defString = `${tmp.join('')}<br>`
        return {
            char: e.traditional,
            def: `<big><font color='#f00' style='font-family: serif !important;'>${e.pinyinDiacritic}</font></big>${defString}`,
        }
    })

var dict_simple = data
    .filter(e => {
        const regex = new RegExp('[1-9a-zA-Z$%□○〥〻]', 'g')
        const regex2 = new RegExp('^[A-Z].*', 'g')
        return (
            e.simplified.length <= 1 &&
            !regex.test(e.simplified) &&
            e.simplified != e.traditional &&
            !regex2.test(e.pinyinDiacritic)
        )
    })
    .reduce((unique, o) => {
        if (
            !unique.some(
                obj =>
                    obj.simplified === o.simplified &&
                    obj.traditional === o.traditional
            )
        ) {
            unique.push(o)
        }
        return unique
    }, [])
    .map(e => {
        const tmp = e.definitionsDiacritic.map(
            e => `<br>• ${e.replace(/\"/g, "'")}`
        )
        const defString = `${tmp.join('')}<br>`
        return {
            char: e.simplified,
            def: `<small>〔${e.traditional}〕</small><big><font color='#f00' style='font-family: serif !important;'>${e.pinyinDiacritic}</font></big>${defString}`,
        }
    })

const result = dict_trandition.concat(dict_simple)

// 如果要寫成 json
const fs = require('fs')
fs.writeFile('data.json', JSON.stringify(result), err => {
    if (err) {
        console.error(err)
        return
    }
    //file written successfully
})

// to csv
// var createCsvWriter = csvwriter.createObjectCsvWriter
// const csvWriter = createCsvWriter({
//     path: path.join(__dirname, '../assets/my-cc-cedict.csv'),
//     header: [
//         { id: 'char', title: 'character' },
//         { id: 'def', title: 'defination' },
//     ],
// })

// csvWriter
//     .writeRecords(result)
//     .then(() => console.log('Data uploaded into csv successfully'))
