#!/usr/bin/env node

process.once('beforeExit' , async() => await (require('../lib/init/modules'))()) ;

require('../lib/init/properties') ;

require('yarn/bin/yarn.js') ;