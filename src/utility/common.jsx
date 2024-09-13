import toast from "react-hot-toast";

export const getDayOfWeekAndAlternates = (dateString) => {
  if (!dateString) {
    return []; // Return an empty array if no date string is provided
  }

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Split the date string into day, month, and year
  const [day, month, year] = dateString.split("-");

  // Create a valid date object
  const date = new Date(`${year}-${month}-${day}`);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const dayIndex = date.getDay();

  const currentDay = daysOfWeek[dayIndex];

  const alternateDays = [];
  for (let i = 0; i < 7; i += 2) {
    const alternateDay = daysOfWeek[(dayIndex + i) % 7];

    alternateDays.push(alternateDay);
  }

  return alternateDays;
};

export const showWarningToast = (message) => {
  toast(message, {
    icon: "⚠️",
    duration: 2000,
    style: {
      border: "1px solid #ffcc00",
      padding: "16px",
      color: "#ffcc00",
    },
  });
};
