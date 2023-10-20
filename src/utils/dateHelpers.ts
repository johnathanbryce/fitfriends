export const getCurrentDay = () =>{
  const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const currentDate = new Date();
  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const month = months[currentDate.getMonth()];
  const dayOfMonth = currentDate.getDate();

  const formattedDate = `${dayOfWeek}, ${month} ${dayOfMonth}`;

  return formattedDate;
}

export const getCurrentMonth = () => {
    const now = new Date();
    const monthIndex = now.getMonth();
    const months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
};

export const getNextThreeMonths = () => {
    const now = new Date();
    const nextMonths = [];
    for (let i = 0; i < 3; i++) {
        now.setMonth(now.getMonth() + 1);
        nextMonths.push(now.toLocaleString('default', { month: 'long' }));
    }
    return nextMonths;
};
