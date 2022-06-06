# kobo-dict

### 資料夾結構 (File Structure)
```
├── assets // dictionary files
│   ├── cc-cedict.json
│   ├── my-cc-cedict.csv
│   ├── stardict-kangxi.zip
│   ├── ...
│   
├── utils // format utils
│   ├── dict.js
│  
├── kobo // kobo dict
│   ├── dicthtml-TW-en.zip
│  
├── README.md
├── node.sh     // execute node
├── run.sh      // execute penelope
```

### 內含字典檔案 (Dictionary)
* cc-cedict.json   
    > cc-cedict 完整字典。
    [來源](https://github.com/SilentByte/cc-cedict-structurizer)
* stardict-cc-cedict
    > startdict 的 **cc-cedict** 完整字典。[來源](https://simonwiles.net/projects/cc-cedict/)
* stardict-cc-cedict
    > startdict 的 **康熙字典** [來源](https://simonwiles.net/projects/kangxi-zidian/)
* stardict-moedict
    > startdict 的 **國語辭典**。[來源](https://github.com/elleryq/moe2stardict)
* my-cc-cedict.csv 
    > 把 cc-cedict 去除詞語，只剩單字，含拼音和註釋，因為只需單字讀音，還可以加速 kobo 讀取字典的速度。
    懂中國拼音法的，算是好用的，不用注音，是沒去研究怎麼讓 kobo 顯示注音。

### 轉換成 kobo 的使用方式 (Use Step)
簡易用法：
1.  安裝 [penelope](https://github.com/pettarin/penelope)。(`[sudo] pip install penelope`)
2.  把支援 (csv, stardict) 的原始字典檔放進 /assests。
3.  執行 `sh run.sh`。依序打輸入格式、檔名、轉換語言。(轉換語言是 penelope 必須要有的，轉換完可以再自己針對 kobo 檔案改名)。
4.  成功執行完畢檔案會在 /kobo。

更多使用方式：
1.  直接到 [penelope](https://github.com/pettarin/penelope) 看文件，使用 command line 自己打。

### 備註 (Remark)
* kobo 要用 csv 轉換的話，只能兩欄，一欄單字，一欄註釋，所以 utils/dict.js，就是為了把 cc-cedict 轉換的成想要的格式。
* 原本想要把 penelope 直接放進來用 python 執行，但發現不是全域安裝的話，會有問題，所以暫時直接放棄。



