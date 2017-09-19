#!/usr/bin/env node

const args = Array.from(process.argv);

if(args.length >= 3){

    let command ;

    try{

        command = require(`../command/${args[2]}`) ;

    }catch(err){

        console.log('缺失命令') ;
    }

    if(typeof command === 'function'){

        command(...args.slice(3)) ;
    }
}