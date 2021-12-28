import axios from "axios";
import dayjs from "dayjs";

function parseData() {
	return function(d: any) {
		d.date = d.date;
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;

		return d;
	};
}

function stockParse(data: any, fn: any) {
  const { items = [] } = data;
  return items.map((item: any) => fn({
    date: item[0],
    open: item[1],
    high: item[2],
    low: item[3],
    close: item[4],
    volume: item[5],
  })).reverse();
}

export function getData(code: string, period: string) {
  const end_date = dayjs().format('YYYYMMDD')
  const start_date = dayjs().subtract(1, 'year').format('YYYYMMDD')
  return axios.post(`/api/stock/${code}`, {
    start_date,
    end_date,
    period,
  }).then((res: any) => res.data.data)
  .then((data: any) => stockParse(data, parseData()))
}
