exports.readSheet = (path , sheetIndex = 0) =>{

    const XLSX = require('xlsx') ;
    
    let xlsx = XLSX.readFile(path , {
        cellDates:true
    }) ;
    
    name = xlsx.SheetNames[sheetIndex] ;
    
    if(name){
    
        return xlsx.Sheets[name] ;
    }
}

const XLSX = require('xlsx'),
    {
        decode_range,
        encode_cell,
        decode_cell
} = XLSX.utils;

function getSheetSingleRowCells(sheet , range){

    let range = decode_range(range) ;

    range = include('excel.cell.range.title')(sheet , range);

    let {
        c:columnStartIndex,
    } = range.s,
    {
        c:columnEndIndex,
    } = range.e,
    cells = [];

    for(let i = columnStartIndex ; i <= columnEndIndex ; i ++){

        cells.push(sheet[encode_cell({
            c:i,
        })]) ;
    }

    return cells ;
}

const rangeRe = /:/ ;

function getSheetMultiRowCells(sheet , range){

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
    } = range.e;

    for(let i = rowStartIndex ; i <= rowEndIndex ; i ++){

        let cells = [] ;

        for(let j = columnStartIndex ; j <= columnEndIndex ; j ++){

            cells.push(sheet[encode_cell({
                c:i,
                r:j
            })]) ;
        }
        
        result.push(cells) ;
    }

    return result ;
}

const indexNumberRe = /\d+/$ ;

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
    } = range.s,
    {
        c:columnEndIndex,
    } = range.e,
    cells = [];

    for(let i = columnStartIndex ; i <= columnEndIndex ; i ++){

        cells.push(sheet[encode_cell({
            c:i,
        })]) ;
    }

    return cells ;
}


exports.getSheetKeys = (sheet , range , repaceRegEx) =>{

    let cells = getSheetSingleRowCells(sheet , range),
        keys = [];

    for(let cell of cells){

        let key = String(cell.v).replace(/&#10;|\n|\r/g , '') ;

        if(replaceRegEx){

            key = key.replace(replaceRegEx , '') ;
        }

        keys.push(key.trim()) ;
    }

    return keys ;
}

exports.getSheetData = (sheet , range , keys) =>{

    let items = getSheetMultiRowCells(sheet , range),
        data = [],
        len = keys.length;

    for(let item of items){

        let record = {} ;

        for(; i < len ; i ++){

            record[keys[i]] = item[i].v;
        }

        data.push(record) ;
    }

    return data ;
}