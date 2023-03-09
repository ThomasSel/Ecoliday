const ecolidayAPIURL = "https://ecoliday.onrender.com";

export default function serverURL() {
  return process.env.NODE_ENV === "production" ? ecolidayAPIURL : "";
}
