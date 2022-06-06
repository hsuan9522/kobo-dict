#!/bin/bash
# read -p $'Dictonary Type \e[2m(csv|kobo|stardict)\e[22m: ' user_dict_type # 字典類型
while ! [[ $user_dict_type =~ (csv|kobo|stardict) ]] 
do
    read -p $'Dictonary Type \e[2m(csv|kobo|stardict)\e[22m: ' user_dict_type # 字典類型
done

while [[ $user_dict_name = '' ]]
do
    read -p 'Dictonary name: ' user_dict_name # 字典名稱
done

read -p $'Language from \e[2m(default: en)\e[22m: ' user_dict_from
user_dict_from=${user_dict_from:-en}

read -p $'Language to \e[2m(default: TW)\e[22m: ' user_dict_to
user_dict_to=${user_dict_to:-TW}

penelope -i ./assets/$user_dict_name -j $user_dict_type -f $user_dict_from -t $user_dict_to -p kobo -o ./kobo/dicthtml-TW-en
