const holidayList = [
  { date: "2025-01-01", eventName: "New Year's Day" },
  { date: "2025-03-29", eventName: "Eid al-Fitr Holiday" },
  { date: "2025-03-30", eventName: "Eid al-Fitr" },
  { date: "2025-03-31", eventName: "Eid al-Fitr Holiday" },
  { date: "2025-04-01", eventName: "Eid al-Fitr Holiday" },
  { date: "2025-06-05", eventName: "Arafat Day" },
  { date: "2025-06-06", eventName: "Eid al-Adha" },
  { date: "2025-06-07", eventName: "Eid al-Adha Holiday" },
  { date: "2025-06-08", eventName: "Eid al-Adha Holiday" },
  { date: "2025-06-26", eventName: "Islamic New Year" },
  { date: "2025-09-04", eventName: "Prophet Muhammad's Birthday" },
  { date: "2025-12-01", eventName: "Commemoration Day" },
  { date: "2025-12-02", eventName: "National Day" },
  { date: "2025-12-03", eventName: "National Day Holiday" },
];

const statusList = {
  working: "working",
  holiday: "holiday",
  weekend: "weekend",
  sickLeave: "sick-leave",
  vacation: "vacation",
};

const months = [
  {
    key: "01",
    title: "January",
  },
  {
    key: "02",
    title: "February",
  },
  {
    key: "03",
    title: "March",
  },
  {
    key: "04",
    title: "April",
  },
  {
    key: "05",
    title: "May",
  },
  {
    key: "06",
    title: "June",
  },
  {
    key: "07",
    title: "July",
  },
  {
    key: "08",
    title: "Auguest",
  },
  {
    key: "09",
    title: "Setember",
  },
  {
    key: "10",
    title: "October",
  },
  {
    key: "11",
    title: "November",
  },
  {
    key: "12",
    title: "December",
  },
];

export { holidayList, statusList, months };
