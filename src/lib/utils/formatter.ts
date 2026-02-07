const thFormatter = new Intl.DateTimeFormat('th-TH', {
  dateStyle: 'long',
  timeStyle: 'short',
})

export function formatDateToThai(date: Date | string | number) {
  const d =
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  return thFormatter.format(d)
}

export function formatShortDateToThai(date: Date | string | number) {
  const d =
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function formatTimeToThai(date: Date | string | number) {
  const d =
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  return new Intl.DateTimeFormat('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatDatetimeToThai(date: Date | string | number) {
  const d =
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(d)
}
