document.addEventListener("DOMContentLoaded",function(){
const searchButton = document.getElementById("search-btn");
const usernameInput = document.getElementById("user-input");
const statsContainer = document.querySelector(".stats-container");
const easyProgressCircle = document.querySelector(".easy-progress");
const mediumProgressCircle = document.querySelector(".medium-progress");
const hardProgressCircle = document.querySelector(".hard-progress");

const easyLabel = document.getElementById("easy-label");
const mediumLabel = document.getElementById("medium-label");
const hardLabel = document.getElementById("hard-label");
const cardStatsContainer = document.querySelector(".stats-card");

const rankingdiv = document.getElementById("ranking");
const totalquesdiv = document.getElementById("totalques");


function validateUsername(username){
    if(username.trim()===""){
        alert("Username should not be empty") ;
        return false;
    }
    const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
    const isMatching = regex.test(username);
    if(!isMatching){
        alert("Invalid Username");
    }
    return isMatching;
}

async function fetchUserDetails(username){
   const url = `https://leetcode-api-faisalshohag.vercel.app/${username}`;
   try{
        searchButton.textContent = "Searching...";
        searchButton.disabled = true;

        const response = await fetch(url);
        if(!response.ok){
            throw new Error("Unable to fetch the user details");
        }
        const parsedata = await response.json();
        if (
            (parsedata.errors && parsedata.errors.length > 0) ||
            !parsedata.totalSubmissions
        ) {
            statsContainer.innerHTML = `<p style="color:red;">User does not exist.</p>`;
            return;
        }
        
        displayUserData(parsedata);
   }
   catch(error){
        console.error("Fetch error:", error);
        statsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
   }
   finally{
       searchButton.textContent = "Search";
       searchButton.disabled = false;
   }
}

function updateProgress(solved,total,label,circle){
    if(!circle)return;
     const progressDegree = (solved/total)*100;
     circle.style.setProperty("--progress-degree",`${progressDegree}%`);
     label.textContent = `${solved}/${total}`;
}

function displayUserData(parsedata){
    const totalQues = parsedata.totalQuestions;
    const totalEasyQues = parsedata.totalEasy;
    const totalMeduimQues = parsedata.totalMedium;
    const totalHardQues = parsedata.totalHard;
    const rank = parsedata.ranking;

    const solvedTotalQues = parsedata.totalSolved;
    const solvedEasyQues = parsedata.totalSubmissions[1].count;
    const solvedMediumQues = parsedata.totalSubmissions[2].count;
    const solvedHardQues = parsedata.totalSubmissions[3].count;

    updateProgress(solvedEasyQues,totalEasyQues,easyLabel,easyProgressCircle);
    updateProgress(solvedMediumQues,totalMeduimQues,mediumLabel,mediumProgressCircle);
    updateProgress(solvedHardQues,totalHardQues,hardLabel,hardProgressCircle);
    totalquesdiv.textContent= `Total Question Solved: ${solvedTotalQues}/${totalQues}`;
    rankingdiv.textContent=`Ranking: ${rank}`;
}
searchButton.addEventListener('click',()=>{
    const username = usernameInput.value;
    if(validateUsername(username)){
          fetchUserDetails(username);
    }
})
})