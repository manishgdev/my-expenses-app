import { useIonRouter } from "@ionic/react";

export const logMsg = (msg: String) => {
  console.log(getTime() + " : " + msg);
};

const getTime = () => {
  const date = new Date();

  // Extract year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  // Extract hours, minutes, and seconds
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Format the date as "YYYY-MM-DD HH:MM:SS"
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const goToPage = (router: ReturnType<typeof useIonRouter>, path: string) => {
    if (router) {
        router.push(path);
    } else {
        console.error('Router is null. Navigation cannot proceed.');
    }
};
