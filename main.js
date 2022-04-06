const request=require("request");
const cheerio=require("cheerio");
const fs=require("fs");
const path=require("path");
const allMatches=require("./allMatches");

const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
request(url,cb);
function cb(err, res, body) {
    if(err)
        console.error("error",err);
    else
        html_handler(body);
}
function html_handler(html) {    
    const $=cheerio.load(html);

//  (3). Create IPL folder in current Directory
     let IPLfolderPath=path.join(__dirname,"IPL");
     if(!fs.existsSync(IPLfolderPath))
     {
         fs.mkdirSync(IPLfolderPath);
     }
//   (1). Get All matches result Link    
    let anchorElement=$(`a[href="/series/ipl-2020-21-1210595/match-results"]`);    
    let halflink=anchorElement.attr("href");   // attr(); give the atributes values
    let fullLink="https://www.espncricinfo.com"+halflink;
    console.log(fullLink);

//   (2). Handover Link to allMatchFun() to Perform incomming operations    
    allMatches.allMatchesFun(fullLink);
}

