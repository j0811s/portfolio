import dayjs from 'dayjs';

type ConvertDateOptions = {
  date?: string
  format?: string
}

export default function ConvertDate({ date = '', format = 'YYYY年MM月DD日' }: ConvertDateOptions) {
  if (!date) return
  
  const formatedDate = dayjs(date).format(format);
  return (
    <time dateTime={date}>
      {formatedDate}
    </time>
  );
}