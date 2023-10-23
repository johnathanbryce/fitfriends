
export function getChallengeMonthAndYear(){
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleDateString("en-US", { year: "numeric", month: "long" });
    const currentChallengeMonth = currentMonth.replace(" ", "");
    return currentChallengeMonth
}

