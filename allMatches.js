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
    let data_array=$(`.ds-flex.ds-flex-wrap .ds-text-ui-typo.ds-underline-offset-4`);    
    for(let i=2;i<data_array.length-3;i+=4)
    {   
        let temp=$(data_array[i]);
        let halflink=temp.attr("href");          
        // console.log(halflink);
        let fullLink="https://www.espncricinfo.com"+halflink;
        // console.log(fullLink);
        Scorecard.scorecardFun(fullLink);
        // break;
    }
    }

module.exports={
    allMatchesFun:allMatches1
}
