const data = require('./pinyin.json')
const moedict = require('../assets/dict-revised.json')
const csvwriter = require('csv-writer')
const path = require('path')

moedictF = moedict
    .filter(e => {
        return e.title.length <= 1
    })
    .map(e => {
        return {
            title: e.title,
            bopomofo: e.heteronyms.map(e => e.bopomofo?.replace(/（.*）/g, '')),
            definitions: e.heteronyms.map(e =>
                e.definitions.reduce((a, b) => {
                    const key = b.type || 'NaN'
                    a[key] = a[key] || []
                    a[key].push(b.def || b.link)
                    return a
                }, {})
            ),
            pinyin: e.heteronyms.map(e => e.pinyin),
        }
    })

const newData = data.map(el => {
    const findWord = moedictF.find(e => e.title == el.key)
    let newDef = el.def
    if (findWord) {
        const bopomo = findWord.bopomofo.join(' / ')
        if (bopomo) {
            newDef = el.def.replace(
                /<big><font color='#f00' style='font-family: serif !important;'>(.*)<\/font><\/big>/g,
                `<font color='#f00'>${bopomo}<\/font>`
            )
        }
    }
    return {
        char: el.char,
        def: newDef,
    }
})

const result = newData.reduce((unique, o) => {
    if (
        !unique.some(
            obj =>
                obj.char === o.char &&
                obj.def.match(/>(.*)<\/font>/)[1] ===
                    o.def.match(/>(.*)<\/font>/)[1]
        )
    ) {
        unique.push(o)
    }
    return unique
}, [])

// const fs = require('fs')
// fs.writeFile('data2.json', JSON.stringify(result), err => {
//     if (err) {
//         console.error(err)
//         return
//     }
//     //file written successfully
// })

var createCsvWriter = csvwriter.createObjectCsvWriter
const csvWriter = createCsvWriter({
    path: path.join(__dirname, 'data.csv'),
    header: [
        { id: 'char', title: 'character' },
        { id: 'def', title: 'defination' },
    ],
})

csvWriter
    .writeRecords(result)
    .then(() => console.log('Data uploaded into csv successfully'))
