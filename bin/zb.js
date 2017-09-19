#!/usr/bin/env node

const args = Array.from(process.argv);

if(args.length >= 3){

    require(`../command/${args[2]}`)(...args.slice(3)) ;
}