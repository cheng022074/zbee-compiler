<%
    let resultName = `result_${Date.now()}` ;
%>
let <%- resultName %> ;
{
    const {
        readSheet,
        getSheetData,
        getSheetKeys
    } = require('excel'),
    sheet = readSheet('<%- path.replace(/\\/g , '\\\\') %>');

    <%- resultName %> = getSheetData(sheet , '<%- data %>' , getSheetKeys(sheet , '<%- key %>')) ;
}
<%
    if(varName){
%>
<%- varName %> = <%- resultName %> ;
<%
    }
%>