const request=require("request");
const cheerio=require("cheerio");
const allMatches=require("./allMatches");
 
request("https://www.espncricinfo.com/series/ipl-2020-21-1210595",cb);

function cb(err, res, body) {
    if(err)
        console.error("error",err);
    else
        html_handler(body);
}
function html_handler(html) {
    let selecTool=cheerio.load(html);
    let anchorElement=selecTool(`a[data-hover="View All Results"]`);      
    //============ attr(); give the atributes values
    let halflink=anchorElement.attr("href");
    let fullLink="https://www.espncricinfo.com"+halflink;
    // console.log(fullLink);
    
    allMatches.allMatchesFun(fullLink);
}

