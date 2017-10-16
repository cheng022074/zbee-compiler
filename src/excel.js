const XLSX = require('xlsx'),
{
    readFile,
    utils
} = XLSX,
{
    decode_range,
    encode_cell,
    decode_cell
} = utils,
{
    defined:is_defined
} = require('./is');

exports.readSheet = (path , sheetIndex = 0) =>{

    let xlsx = readFile(path , {
        cellDates:true
    }) ;
    
    name = xlsx.SheetNames[sheetIndex] ;
    
    if(name){
    
        return xlsx.Sheets[name] ;
    }
}

const rangeRe = /:/ ;

function getSheetMultiRowCells(sheet , range = 'A2'){

    if(!rangeRe.test(range)){
        
        range = `${range}:${sheet['!ref'].match(/:([^\:]+)$/)[1]}` ;
    }

    range = decode_range(range) ;

    let {
        c:columnStartIndex,
        r:rowStartIndex
    } = range.s,
    {
        c:columnEndIndex,
        r:rowEndIndex
    } = range.e,
    result = [];

    for(let i = rowStartIndex ; i <= rowEndIndex ; i ++){

        let cells = [] ;

        for(let j = columnStartIndex ; j <= columnEndIndex ; j ++){

            cells.push(sheet[encode_cell({
                c:j,
                r:i
            })]) ;
        }
        
        result.push(cells) ;
    }

    return result ;
}

const indexNumberRe = /\d+$/ ;

function getSheetSingleRowCells(sheet , range){

    if(!rangeRe.test(range)){

        let = {
            r
        } = decode_cell(range) ;

        range = `${range}:${sheet['!ref'].match(/:([^\:]+)$/)[1].replace(indexNumberRe , '')}${r}` ;
    }

    range = decode_range(range) ;

    let {
        c:columnStartIndex,
        r:rowIndex
    } = range.s,
    {
        c:columnEndIndex,
    } = range.e,
    cells = [];

    for(let i = columnStartIndex ; i <= columnEndIndex ; i ++){

        cells.push(sheet[encode_cell({
            c:i,
            r:rowIndex
        })]) ;
    }

    return cells ;
}


exports.getSheetKeys = (sheet , range) =>{

    let cells = getSheetSingleRowCells(sheet , range),
        keys = [];

    for(let cell of cells){

        keys.push(String(cell.v).replace(/&#10;|\n|\r/g , '').trim()) ;
    }

    return keys ;
}

exports.getSheetData = (sheet , range , keys) =>{

    let items = getSheetMultiRowCells(sheet , range),
        data = [],
        len = keys.length;

    for(let item of items){

        let record = {} ;

        for(let i = 0 ; i < len ; i ++){

            if(item){

                let value = item[i].v ;

                if(is_defined(value)){

                    record[keys[i]] = value;
                }
            }
        }

        data.push(record) ;
    }

    return data ;
}