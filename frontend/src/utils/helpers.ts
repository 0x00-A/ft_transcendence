export const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
};