const request=require("request");
const cheerio=require("cheerio");
const Scorecard=require("./scorecard");

function allMatches1(url) 
   {
    request(url,cb);
    function cb(err, res, body) {
        if(err)
            console.error("error",err);
        else
            html_handler(body);
    } 
}


function html_handler(html) {
    let $=cheerio.load(html);
    let data_array=$(`.ds-text-ui-typo.ds-underline-offset-4`);  
    let data_array1=data_array.slice(15);  
    for(let i=0;i<data_array1.length-3;i+=4)
    {   
        let temp=$(data_array1[i]);
        let halflink=temp.attr("href");          
        // console.log(halflink);
        let fullLink="https://www.espncricinfo.com"+halflink;
        // console.log(fullLink);
        Scorecard.scorecardFun(fullLink);
    }
 }

module.exports={
    allMatchesFun:allMatches1
}
