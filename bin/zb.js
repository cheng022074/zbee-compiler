#!/usr/bin/env node

const args = Array.from(process.argv);

global.zb = {
    script:require('../src/script')
} ;

if(args.length >= 3){

    require(`../command/${args[2]}`)(...args.slice(3)) ;
}