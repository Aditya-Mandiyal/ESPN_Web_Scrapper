const request=require("request");
const cheerio=require("cheerio");
const allMatches=require("./allMatches");
const { allMatchesFun } = require("./allMatches");
request("https://www.espncricinfo.com/series/ipl-2020-21-1210595",cb);
function cb(err, res, body) {
    
    if(err)
        console.error("error",err);
    else
        html_handler(body);
}
//======== html Handler function which use html apne according
function html_handler(html) {
    //====== cheerio.load(); is a inbuild function which store all html in structured way 
    let selecTool=cheerio.load(html);

    //====== get a particular part of html from whole website html by giving selector
    let anchorElement=selecTool(`a[data-hover="View All Results"]`);  //===== abhi variable ek object hai jisme html store ho gyi hai ek structure form me
    
    //==== attr(); give the atributes values
    let halflink=anchorElement.attr("href");
    let fullLink="https://www.espncricinfo.com"+halflink;
    console.log(fullLink);
    allMatches.allMatchesFun(fullLink);


}

