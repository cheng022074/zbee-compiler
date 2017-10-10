#!/usr/bin/env node

const args = Array.from(process.argv),
      {
        name2path
      } = require('../src/path');

global.zb = {
    script:require('../src/script')
} ;

if(args.length >= 3){

    require(`../command/${name2path(args[2])}`)(...args.slice(3)) ;
}