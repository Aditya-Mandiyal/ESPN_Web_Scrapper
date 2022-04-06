const request=require("request");
const cheerio=require("cheerio");
const fs=require("fs");
const path=require("path");
// it takes the scorecard link of all matches one-by-one 
function scorecard(url) {
    request(url,cb);
    function cb(err, res, body) {     
        if(err)
            console.error("error",err);
        else
            getMatchDetails(body);
    } 
}

function getMatchDetails(html) 
{ 
    const $=cheerio.load(html);

//      (1) Get Venue                 
    let matchDiscription=$(`.ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid`).text();
    let matchDiscriptionArray=matchDiscription.split(",");
    let Venue=matchDiscriptionArray[1];
    console.log('\n',"1. VENUE - ",Venue);

//      (2) Get Date
    let date=matchDiscriptionArray[2];
    console.log(" 2. DATE - ",date);         

//      (3) Get Team Names
    let teamNameArr=$(`a>.ds-text-tight-l.ds-font-bold`);
    let team1=$(teamNameArr[0]).text();
    let team2=$(teamNameArr[1]).text();
    console.log(" 3. TEAMS - ");
    console.log("         team 1 -",team1);
    console.log("         team 2 -",team2,"\n");
  
    
//      (4). Get Batting Details of All Players who Bat in Match                            
      let allRows_Array=$(`.ds-w-full.ds-table.ds-table-xs.ds-table-fixed.ci-scorecard-table>tbody>tr.ds-border-b.ds-border-line.ds-text-tight-s`);       
      for (let i = 0; i < allRows_Array.length; i++)
       {    let ithRow=$(allRows_Array[i]);
         if(( $(ithRow.find("td")[0]).text()[0] ) !='E')          //  find('td') method each return krega all <td>'s present inside tr and than td_array_FromithRow[0] mtlb first <td> ko return kro. Than we write .hasclass("ds-min-w-max") iska mtlb hasclass() method true return krega agr td_array_FromithRow[0] me "ds-min-w-max" class hogi otherwise false.  
         {  
            let playerName= $(ithRow.find("td")[0]).text();
            let runs= $(ithRow.find("td")[2]).text();
            let balls= $(ithRow.find("td")[3]).text();
            let fours= $(ithRow.find("td")[5]).text();
            let sixes= $(ithRow.find("td")[6]).text();
            let strikeRate=$(ithRow.find("td")[7]).text();
            console.log(`Player->>${playerName}  Runs->>${runs}  Balls->>${balls}  fours->>${fours}  Sixes->>${sixes}  S.R.->>${strikeRate}` );
 
            
//       (5).  Store the Above Details of Match and Each Player batting stats in excel file          
            Store_Info(Venue,date,team1,team2,playerName,runs,balls,fours,sixes,strikeRate);
        }
      }
      function Store_Info(Venue,date,team1,team2,playerName,runs,balls,fours,sixes,strikeRate) { 
        //========== STEP-(1). Create Team Folder jisme hum aage jakr player ki exel file daalege       
      let team1Path=path.join(__dirname,"IPL",team1);
      if(!fs.existsSync(team1Path))
      {
          fs.mkdirSync(team1Path);
      }
      //========== STEP-(2). Create an Object and put Info(Venue,date,.....) in that object.
      let infoObject={
        Venue,
        date,
        team1,
        team2,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        strikeRate
      };
       //========== STEP-(3). Create an Array and push infoObject in that array. (This array is called array of object)
       let infoArray=[];
       infoArray.push(infoObject);
       //========== STEP-(4). Create the Path of playername.xlsx in which we store info we getting
        let playerPath=path.join(team1Path,playerName+".xlsx");
        //========== STEP-(5). Call function to perform incomming operations and give (PlayerPath,infoArray,playerName) as agrument
        exelWriter(playerPath,infoArray,playerName);
    }
      function exelWriter(playerPath,infoArray,playerName) {
             //Creates a new workbook
        let newWorkBook = xlsx.utils.book_new();
            //Converts an array of JS objects to a worksheet.
        let newWorkSheet = xlsx.utils.json_to_sheet(jsObject);
            //it appends a worksheet to a workbook
        xlsx.utils.book_append_sheet(newWorkBook, newWorkSheet, sheetName);
            // Attempts to write or download workbook data to file
        xlsx.writeFile(newWorkBook, playerPath);
      }


}
module.exports={
    scorecardFun:scorecard
}
