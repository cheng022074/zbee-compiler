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
    sheet = readSheet('<%- path %>');

    <%- resultName %> = getSheetData(sheet , '<%- data %>' , getSheetKeys(sheet , '<%- key %>')) ;
}
<%
    if(varName){
%>
<%- varName %> = <%- resultName %> ;
<%
    }
%>