export default function parseDate(date) {
  let [day, month, year] = date.split('-');
  return `${year}-${month}-${day}`
}