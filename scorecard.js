const request=require("request");
const cheerio=require("cheerio");
function scorecard(url,count) {
    request(url,cb);
    function cb(err, res, body) {
        
        if(err)
            console.error("error",err);
        else
            html_handler(body);
    } 
    function html_handler(html) {
        let selecTool=cheerio.load(html);
        let data_array=selecTool(`.status-text span`);
        let temp=selecTool(data_array[5]).text();
        console.log(count+"....."+temp);
        
    }

   


}
module.exports={
    scorecardFun:scorecard
}
