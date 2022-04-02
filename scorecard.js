const request=require("request");
const cheerio=require("cheerio");
// it takes the scorecard link of all matches one-by-one 
function scorecard(url) {
    request(url,cb);
    function cb(err, res, body) {     
        if(err)
            console.error("error",err);
        else
            getMatchDetails(body);
    } 
    function getMatchDetails(html) 
    { 
        const selecTool=cheerio.load(html);

//      (1) Get Venue                 
        let matchDiscription=selecTool(`.header-info .description`).text();
        let matchDiscriptionArray=matchDiscription.split(",");
        let Venue=matchDiscriptionArray[1];
        console.log('\n',"1. VENUE - ",Venue);

//      (2) Get Date
        let date=matchDiscriptionArray[2];
        console.log(" 2. DATE - ",date);         

//      (3) Get Team Names
        let teamNameArr=selecTool(`.name-detail>.name-link`);
        console.log(" 3. TEAMS - ");
        console.log("         team 1 -",selecTool(teamNameArr[0]).text());
        console.log("         team 2 -",selecTool(teamNameArr[1]).text(),"\n");
        
//      (4) Get Innings
 
        /*      let batsmanarr1= selecTool(`.table.batsman>tbody>tr .batsman-cell.text-truncate.out`);
                for(let i=0;i<batsmanarr1.length;i++)
                { console.log(i+1,' ',selecTool(batsmanarr1[i]).text()); }
        */        
        
        /*      let temp=selecTool(`.table.batsman>tbody>tr`);    
                for (let index = 0; index < temp.length; index++) {
                    console.log(index+1,' ',selecTool(temp[index]).text());  }         
        */

          let batsmanTablesArray=selecTool(`.table.batsman>tbody>tr`);
          let counter=1;
          for (let i = 0; i < batsmanTablesArray.length; i++) {
               
             if(selecTool(selecTool(batsmanTablesArray[i]).find("td")[0]).hasClass("batsman-cell"))      //  find('td') method each return krega all <td>'s present inside tr and than we write [0] mtlb first <td> ko return kro. Than we write .hasclass("batsman-cell") iska mtlb hasclass() method each row ke first td me dekhega ki batsman-cell class hai agr hai tbhi <tr> ka data print kro  
             {
                 console.log(counter," ",selecTool(batsmanTablesArray[i]).text());
                 counter++;
             }
          }



    }

   


}
module.exports={
    scorecardFun:scorecard
}
