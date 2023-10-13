export function countDownToNextMonthMinus5Days(offset = 0) {
  // Get the current date
  const currentDate = new Date();

  // Calculate the target month
  let targetMonth = currentDate.getMonth()  + 1 + offset;
  let targetYear = currentDate.getFullYear();

 // Adjust the target month and year if needed
  if (targetMonth > 12) {
    targetMonth -= 12; // Wrap around to January
    targetYear++;       // Increment the year
  }

  // Calculate the date for the target month minus 5 days
  const targetDate = new Date(targetYear, targetMonth - 1, 0);
  targetDate.setDate(targetDate.getDate() - 5);

  // Calculate the time difference between the target date and the current date
  const timeDifference = targetDate - currentDate;

  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  // Format the countdown string
  const countdownString = `${days} days, ${hours} hours`;

  return countdownString;
}
  

  
