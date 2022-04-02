const request=require("request");
const cheerio=require("cheerio");
const Scorecard=require("./scorecard");
function allMatches1(url) {
    request(url,cb);

    function cb(err, res, body) {
        if(err)
            console.error("error",err);
        else
            html_handler(body);
    } 
    function html_handler(html) {
        let selecTool=cheerio.load(html);
        // data_array me all matchs ke scorcard ke element aayege 
        let data_array=selecTool(`a[data-hover="Scorecard"]`);
        for(let i=0;i<data_array.length;i++)
        {
            let temp=selecTool(data_array[i]);
            let halflink=temp.attr("href");
            // console.log(halflink);
            let fullLink="https://www.espncricinfo.com"+halflink;
            // console.log(fullLink);
            Scorecard.scorecardFun(fullLink);
            break;
        }
    }
}
module.exports={
    allMatchesFun:allMatches1
}
