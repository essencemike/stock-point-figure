import { number } from "echarts"

interface Stock {
  high: number;
  low: number;
  open?: number;
  close?: number;
  date?: string;
  volume?: number;
}

export function pointAndFigure(
  data: Stock[] = [],
  options: { reversal: number; boxSize: number} = { reversal: 3, boxSize: 1 }
): { result: any; max: number; min: number; }| undefined {
  function currentPushUpBox(start = 0, end = 0, boxSize = 0) {
    for(let i = start; i <= end; i += boxSize) {
      current.boxes.push(toFixed(i))
    }
    const num = getSectionNum(start, end, boxSize)
    current.end = toFixed(start + num * boxSize)
    max = Math.max(max, current.end)
  }
  
  function currentPushDownBox(start = 0, end = 0, boxSize = 0) {
    for(let i = start; i >= end; i -= boxSize) {
      current.boxes.push(toFixed(i))
    }
    const num = getSectionNum(start, end, boxSize)
    current.end = toFixed(start - num * boxSize)
    min = Math.min(min, current.end)
  }

  function getSectionNum(start = 0, end = 0, boxSize = 0) {
    return Math.floor(Math.abs(start - end) / boxSize)
  }

  function toFixed(num = 0) {
    return Math.round(num * 100) / 100;
  }

  function floor(num: number) {
    return Math.floor(num);
  }

  function ceil(num: number) {
    return Math.ceil(num);
  }


  const { reversal = 3, boxSize = 1 } = options;
  if (data.length < 2) return;
  // 涨幅
  const gain = data[1].high - data[0].low;
  // 跌幅
  const drop = data[0].high - data[1].low;

  let current: any = null;
  const result = [];
  const up = 1;
  const down = -1;
  let max = floor(data[0].high);
  let min = ceil(data[0].low);

  const firstHigh = floor(data[0].high)
  const firstLow = ceil(data[0].low)
  const secondHigh = floor(data[1].high)
  const secondLow = ceil(data[1].low)

  if (gain >= drop) {
    const num = getSectionNum(secondHigh, firstLow, boxSize)
    current = {
      direction: up,
      start: toFixed(firstLow),
      end: toFixed(firstLow + num * boxSize),
      startDate: data[0].date,
      endDate: data[1].date,
      boxes: [],
    };
    currentPushUpBox(firstLow, secondHigh, boxSize)
  } else {
    const num = getSectionNum(firstHigh, secondLow, boxSize)
    current = {
      direction: down,
      start: toFixed(firstHigh),
      end: toFixed(firstHigh - num * boxSize),
      startDate: data[0].date,
      endDate: data[1].date,
      boxes: [],
    };
    currentPushDownBox(firstHigh, secondLow, boxSize)
  }

  for(let i = 2; i < data.length; i++) {
    // x
    if (current.direction > 0) {
      // 先判断当日最高价有无新高
      if (data[i].high >= current.end && data[i].high - current.end >= boxSize) {
        currentPushUpBox(current.end + boxSize, floor(data[i].high), boxSize)
        current.endDate = data[i].date;
      } else if (Math.abs(data[i].low - current.end) >= boxSize * reversal) {
        // 保存上一列，重新开始一列
        result.push(current);
        const end = current.end;
        current = {
          direction: down,
          start: toFixed(end - boxSize),
          startDate: data[i].date,
          endDate: data[i].date,
          boxes: [],
        };
        currentPushDownBox(end - boxSize, ceil(data[i].low), boxSize)
      }
    } else {
      // o
      if (data[i].low <= current.end && current.end - data[i].low >= boxSize) {
        currentPushDownBox(current.end - boxSize, ceil(data[i].low), boxSize)
        current.endDate = data[i].date;
      } else if (Math.abs(data[i].high - current.end) >= boxSize * reversal) {
        result.push(current);
        const end = current.end;
        current = {
          direction: up,
          start: toFixed(end + boxSize),
          startDate: data[i].date,
          endDate: data[i].date,
          boxes: [],
        };
        currentPushUpBox(end + boxSize, floor(data[i].high), boxSize)
      }
    }
  }

  current.endDate = data[data.length - 1].date;
  result.push(current);

  return { result: result.slice(-50), max, min };
}
