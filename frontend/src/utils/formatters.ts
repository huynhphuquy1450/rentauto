export function formatVND(price: number): string {
  return (price * 25000).toLocaleString('vi-VN') + ' VNĐ';
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN');
}

export function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (end < start) return 0;
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

export function calculateTotal(pricePerDay: number, startDate: string, endDate: string): number {
  return pricePerDay * calculateDays(startDate, endDate);
}
