export const getDateInStr = (isoDate: string) => {
  const dateObj = new Date(isoDate)

  const day = String(dateObj.getDate()).padStart(2, '0')
  const month = String(dateObj.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
  const year = dateObj.getFullYear()

  const formattedDate = `${year}-${month}-${day}`
  return formattedDate
}

export function getLastNDaysData(days: number) {
  const result = []
  const now = new Date()

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(now.getDate() - i) // Subtract days dynamically

    const formattedDate = date.toISOString().split('T')[0] // Get YYYY-MM-DD format

    result.push({
      completedDate: formattedDate,
      count: 0,
    })
  }

  return result.reverse()
}
