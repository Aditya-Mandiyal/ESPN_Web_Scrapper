const request=require("request");
const cheerio=require("cheerio");
const fs=require("fs");
const path=require("path");
const xlsx=require("xlsx");
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
    // console.log('\n',"1. VENUE - ",Venue);

//      (2) Get Date
    let date=matchDiscriptionArray[2];
    // console.log(" 2. DATE - ",date);         

//      (3) Get Team Names
    let teamNameArr=$(`a>.ds-text-tight-l.ds-font-bold`);
    let team1=$(teamNameArr[0]).text();
    let team2=$(teamNameArr[1]).text();
    // console.log(" 3. TEAMS - ");
    // console.log("         team 1 -",team1);
    // console.log("         team 2 -",team2,"\n");
  
    
//      (4). Get Batting Details of All Players who Bat in Match                            
      let allRows_Array=$(`.ds-w-full.ds-table.ds-table-xs.ds-table-fixed.ci-scorecard-table>tbody>tr.ds-border-b.ds-border-line.ds-text-tight-s`);       
      for (let i = 0; i < allRows_Array.length; i++)
       {    let ithRow=$(allRows_Array[i]);
         if(( $(ithRow.find("td")[0]).text()[0] ) !='E')          //  find('td') method each return krega all <td>'s present inside tr and than td_array_FromithRow[0] mtlb first <td> ko return kro. Than we write .hasclass("ds-min-w-max") iska mtlb hasclass() method true return krega agr td_array_FromithRow[0] me "ds-min-w-max" class hogi otherwise false.  
         {  
              // with player names have a issue --> rohit sharma or rohit sharma (c)  or rohit sharma !
              let playerName_withIssue= $(ithRow.find("td")[0]).text();
              let playerName=playerName_withIssue;
              if(playerName_withIssue.includes('('))
              {
                  let tempArray=playerName_withIssue.split('(');
                  playerName=tempArray[0].trim(); 
              }
              else if(playerName_withIssue.includes('†'))
              {
                 let tempArray=playerName_withIssue.split('†');
                 playerName=tempArray[0].trim(); 
              }
            let runs= $(ithRow.find("td")[2]).text();
            let balls= $(ithRow.find("td")[3]).text();
            let fours= $(ithRow.find("td")[5]).text();
            let sixes= $(ithRow.find("td")[6]).text();
            let strikeRate=$(ithRow.find("td")[7]).text();
            // console.log(`Player->>${playerName}  Runs->>${runs}  Balls->>${balls}  fours->>${fours}  Sixes->>${sixes}  S.R.->>${strikeRate}` );
 
            
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
//========== STEP-(2). Create the Path of playername.xlsx in which we store info we getting
            //  let playerPath=path.join("A:\\Web_Dev_FJP\\Node\\2__Web_Scrapping\\Project-1_Espn_Scrapper\\Result",playerName+".xlsx");
             let playerPath=path.join(team1Path,playerName+".xlsx");
//========== STEP-(3). Create an Object and put Info(Venue,date,.....) in that object.
      let PlayerinfoObject={
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
       //========== STEP-(4). Create an Array and put  previous sheet data in it as object + current data of player (This array is called array of object)
       let playerInfoArrayOfObj=ArrayOfObj_Filler(playerPath,playerName);    // pishle details mngva li
       playerInfoArrayOfObj.push(PlayerinfoObject);                               // abhi wali details push krdo        
       function ArrayOfObj_Filler(playerPath,playerNameSheet) {
           if(fs.existsSync(playerPath))      //agr player excel sheet already hai toh uska data utha kr new player.xlsx me dalna pdega na toh bhi krege isme
           {
                // pehle player.xlsx me jo book hogi usko nikalna pdega
                let oldWorkbook=xlsx.readFile(playerPath);
                // abhi us book se ek sheet (soch le like ek page nikalna book se) nikalni hai 
                let oldWorkbook_sheet=oldWorkbook.Sheets[playerNameSheet];
                // abhi hum iss sheet se data as array of object nikalege and current array of object jo aage ja kr sheet me dlega usko bhej denge
                let oldArrayObj=xlsx.utils.sheet_to_json(oldWorkbook_sheet);
                // abhi hume previous baale player details mil chuki hai. abhi isko current array of object me daalna hai. toh yha se return krdo oldArrObj ko 
                return oldArrayObj;
            }  
            else       // agr player excel nhi exist krti mtlb player ka first match hai toh empty array return krdo kyuki pishla koi record exist hi nhi krta abhi dlega aage ka kr 
            {
                   return [];
            }  
       }
        //========== STEP-(5). Call function to perform incomming operations and give (PlayerPath,infoArray,playerName) as agrument
        exelWriter(playerPath,playerInfoArrayOfObj,playerName);
    }
      function exelWriter(playerPath,playerInfoArrayOfObj,playerName) {
             //Creates a new workbook
        let newWorkBook = xlsx.utils.book_new();
            //Converts an array of objects to a worksheet.
        let newWorkSheet = xlsx.utils.json_to_sheet(playerInfoArrayOfObj);
            //worksheet ko  workbook me dalta hai ye
        xlsx.utils.book_append_sheet(newWorkBook, newWorkSheet, playerName);
            // Attempts to write or download workbook data to file
        xlsx.writeFile(newWorkBook, playerPath);
      }


}
module.exports={
    scorecardFun:scorecard
}
