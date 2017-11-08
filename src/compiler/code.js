const {
    SourceCode,
    BinCode
} = require('../code'),
{
    readTextFile
} = require('../fs'),
{
    require:module_require
} = require('../module');

class CompilerBinCode extends BinCode{
}

exports.BinCode = CompilerBinCode ;

class CompilerSourceCode extends SourceCode{
}

exports.SourceCode = CompilerSourceCode ;