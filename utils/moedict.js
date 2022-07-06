// turn cc-cedict to spefic format
const data = require('../assets/dict-revised.json')
const TS = require('../assets/simplified.json')
const csvwriter = require('csv-writer')
const path = require('path')

// format dict
const dict = data
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
    .map(e => {
        const bopomofo = e.bopomofo.join(' / ')
        const defs = e.definitions.map((el, index) => {
            let string = ''
            let yin =
                index !== 0
                    ? `<font color='#f00'>${e.bopomofo[index]}</font><br/>`
                    : ''
            for (i in el) {
                const tmp = el[i].map(ele => `• ${ele}`).join('<br/>')
                const defType = i === 'NaN' ? '' : `[${i}]<br/>`
                string = string + `${yin}${defType}${tmp}<br/>`
            }
            return string
        })
        const defString = defs.join('')
        const zhuyin = bopomofo
            ? `<font color='#f00'>${bopomofo}</font><br/>`
            : ''
        return {
            char: e.title,
            def: `${zhuyin}${defString}`,
        }
    })

const simple = TS.filter(e => {
    const findWord = dict.find(el => el.char == e.simple)
    if (findWord) return false
    return true
}).map(e => {
    const findWord = dict.find(el => el.char == e.trandition)
    if (!findWord) {
        return {
            char: e.simple,
            def: `‹<small>${e.trandition}</small>›<br/><font color='#f00' style="font-family: sans-serif !important;">${e.pinyin}</font><br/>`,
        }
    }
    return {
        char: e.simple,
        def: `‹<small>${e.trandition}</small>›<br/>${findWord.def}`,
    }
})

const all = dict.concat(simple)
// // 如果要寫成 json
// const fs = require('fs')
// fs.writeFile('data2.json', JSON.stringify(simple), err => {
//     if (err) {
//         console.error(err)
//         return
//     }
//     //file written successfully
// })

// console.log(dict)
// to csv
var createCsvWriter = csvwriter.createObjectCsvWriter
const csvWriter = createCsvWriter({
    path: path.join(__dirname, '../assets/my-moe-cedict.csv'),
    header: [
        { id: 'char', title: 'character' },
        { id: 'def', title: 'defination' },
    ],
})
csvWriter
    .writeRecords(all)
    .then(() => console.log('Data uploaded into csv successfully'))

/** 萌典 dict 結構
飲,<font color='#f00'>yǐn</font><br>• to drink<br>
[
    {
        "title": "便",
        "bopomofo": ["ㄅㄧㄢˋ", "ㄆㄧㄢˊ"],
        "definitions": [
            {
                "形": [
                    "順、順利、方便。",
                    "簡單的、非正式的。",
                    "靈敏、輕巧、敏捷。"
                ],
                "動": ["適宜、合宜。", "有利於。", "熟習。", "排泄屎、尿。"],
                "名": ["方便的時候。", "機會。", "屎、尿等的排泄物。"],
                "副": ["即、就。", "豈、難道。表反問的語氣。"],
                "連": ["縱然、即使。"]
            },
            { "名": ["姓。如漢代有便樂成。"] }
        ],
        "pinyin": ["biàn", "pián"]
    },
    {
        "title": "㕷",
        "bopomofo": ["ㄆㄚ", "（又音）ㄆㄧㄚ"],
        "definitions": [
            {
                "狀": ["形容拍擊的聲音。如：「㕷的一聲」。也作「拍」、「啪」。"]
            },
            { "undefined": ["(一)之又音。"] }
        ],
        "pinyin": ["pā", "（又音）piā"]
    }
]

 */
