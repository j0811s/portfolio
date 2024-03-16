import dayjs from 'dayjs';

type ConvertDateOptions = {
  date?: string
  format?: string
}

export default function ConvertDate({ date = '', format = 'YYYY/MM/DD' }: ConvertDateOptions) {
  if (!date) return
  
  const formatedDate = dayjs(date).format(format);
  return (
    <time dateTime={date}>
      {formatedDate}
    </time>
  );
}