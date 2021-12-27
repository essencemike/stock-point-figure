<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus'
import { getData } from "../utils/util"
import { pointAndFigure } from '../utils/pAndF';
import { testData } from '../utils/test';

const formInline = reactive({
  stock: '',
  reversal: 3,
  boxSize: 1,
  period: 'daily',
})

const chart = ref()

const onSubmit = function () {
  if (!chart.value) {
    return;
  }

  if (formInline.period === 'weekly') {
    ElMessage.warning('月线暂时不可用！')
    return;
  }

  update()
}

function update() {
  const { reversal, boxSize, period, stock } = formInline
  if (!stock) return;
  getData(stock, period).then(data => {
    const { result = [], min = 0, max = 0 } = pointAndFigure(data, { reversal, boxSize }) || {}
    const oData = [];
    for (let i = 0; i < result.length; i++) {
      for(let j = 0; j < result[i].boxes.length; j++) {
        const mid = result[i].boxes[j]
        const direction = result[i].direction;
        oData.push([i + 1, mid, direction])
      }
    }

    const option = {
      xAxis: {
        type: 'value',
        interval: 1,
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        max: 54,
      },
      yAxis: {
        type: 'value',
        interval: boxSize,
        min: (min - 3 * boxSize),
        max: (max + 3 * boxSize),
        splitLine: {
          show: false,
        },
      },
      // dataZoom: [
      //   {
      //     type: 'inside',
      //     xAxisIndex: [0],
      //   },
      //   {
      //     type: 'inside',
      //     yAxisIndex: [0],
      //   },
      // ],
      series: [
        {
          symbolSize: 16,
          symbol: function(data: any) {
            return data[2] > 0 ? 'path://M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z'
              : 'circle';
          },
          itemStyle: {
            color: function(data: any) {
              return data.data[2] > 0 ? 'red' : 'blue';
            },
          },
          data: oData,
          type: 'scatter'
        }
      ]
    };
    chart.value.setOption(option);
  })
}

onMounted(() => {
  const chartDom: any = document.getElementById('main');
  chart.value = echarts.init(chartDom);
  
  update()
});
</script>

<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="股票代码">
      <el-input v-model="formInline.stock" placeholder="股票代码"></el-input>
    </el-form-item>
    <el-form-item label="转向格数">
      <el-input v-model="formInline.reversal" placeholder="转向格数"></el-input>
    </el-form-item>
    <el-form-item label="格值">
      <el-input v-model="formInline.boxSize" placeholder="格值"></el-input>
    </el-form-item>
    <el-form-item label="周期">
      <el-select v-model="formInline.period" placeholder="Activity zone">
        <el-option label="日线" value="daily"></el-option>
        <el-option label="月线" value="weekly"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">更新</el-button>
    </el-form-item>
  </el-form>

  <div id="main"></div>
</template>

<style scoped>
#main {
  width: 100%;
  height: 800px;
}
</style>
