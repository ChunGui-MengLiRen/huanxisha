<template>
    <div class="accountBookChart">
        <div class="pie" style="flex:1">
            <n-card style="flex:1" title="收入占比">
                <template #header-extra>
                    <n-date-picker v-model:formatted-value="pieleftDate" type="month" value-format="yyyy-MM"
                        format="yyyy-MM" />
                </template>
                <div id="pie-left" style="width:100%;height: 100%;"></div>
            </n-card>
            <n-card style="flex:1" title="支出占比">
                <template #header-extra>
                    <n-date-picker v-model:formatted-value="pieRightDate" type="month" value-format="yyyy-MM"
                        format="yyyy-MM" />
                </template>
                <div id="pie-right" style="width:100%;height: 100%;"></div>
            </n-card>
        </div>
        <n-card style="flex:1" title="收入支出折线图">
            <template #header-extra>
                <n-date-picker v-model:formatted-value="lineDate" type="year" value-format="yyyy" format="yyyy" />
            </template>
            <div id="line" style="height: 100%;"></div>
        </n-card>
    </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { ref, watch, onMounted, onDeactivated } from 'vue'
import { useRecord } from "@/store/index.js";
import dayjs from 'dayjs';
const recordStore = useRecord();

let myChartPieLeft = null
let myChartPieRight = null
let myChartLine = null

const pieleftDate = ref(dayjs().format('YYYY-MM'))
const pieRightDate = ref(dayjs().format('YYYY-MM'))
const lineDate = ref(dayjs().format('YYYY'))

const lineOption = ref({
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['收入', '支出',]
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '收入',
            type: 'line',
            // stack: 'Total',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: '支出',
            type: 'line',
            // stack: 'Total',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]
        },
    ]
})

const pieLeftOption = ref({
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left'
    },
    series: [
        {
            name: '收入',
            type: 'pie',
            radius: '60%',
            data: [],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
})

const pieRightOption = ref({
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left'
    },
    series: [
        {
            name: '支出',
            type: 'pie',
            radius: '60%',
            data: [],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
})


const setPieOption = (type = '0', datetime = dayjs().format('YYYY-MM')) => {
    let res = []
    for (let i = 0; i < recordStore.recordList.length; i++) {
        if (recordStore.recordList[i].datetime.slice(0, 7) == datetime) {
            for (let j = 0; j < recordStore.recordList[i].data.length; j++) {
                if (recordStore.recordList[i].data[j].type == type) {
                    res.push(recordStore.recordList[i].data[j])
                }
            }
        }
    }
    if (type == '0') {
        pieRightOption.value.series[0].data = res.map(item => {
            return {
                name: item.name,
                value: item.money
            }
        })
    }
    if (type == '1') {
        pieLeftOption.value.series[0].data = res.map(item => {
            return {
                name: item.name,
                value: item.money
            }
        })
    }
    console.log(res);
}

setPieOption('0', pieRightDate.value)
setPieOption('1', pieleftDate.value)


const setLineOptions = () => {
    lineOption.value.series[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    lineOption.value.series[1].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (let i = 0; i < recordStore.recordList.length; i++) {
        if (recordStore.recordList[i].datetime.slice(0, 4) == lineDate.value) {
            let zhichu = 0, shouru = 0
            let index = dayjs(recordStore.recordList[i].datetime).month()
            for (let j = 0; j < recordStore.recordList[i].data.length; j++) {
                if (recordStore.recordList[i].data[j].type == '1') {
                    shouru += recordStore.recordList[i].data[j].money
                }
                if (recordStore.recordList[i].data[j].type == '0') {
                    zhichu += recordStore.recordList[i].data[j].money
                }
            }
            lineOption.value.series[0].data[index] += shouru
            lineOption.value.series[1].data[index] += zhichu
        }
    }

    console.log(lineOption.value);
}

setLineOptions()

onMounted(() => {
    // 基于准备好的dom，初始化echarts实例
    myChartPieLeft = echarts.init(document.getElementById('pie-left'));
    myChartPieRight = echarts.init(document.getElementById('pie-right'));
    myChartLine = echarts.init(document.getElementById('line'));
    // 绘制图表
    myChartPieLeft.setOption(pieLeftOption.value);
    myChartPieRight.setOption(pieRightOption.value);
    myChartLine.setOption(lineOption.value)
    window.addEventListener('resize', () => {
        myChartPieRight.resize();
        myChartLine.resize();
        myChartPieLeft.resize();
        myChartPieRight.resize();
    })
})

watch(pieleftDate, () => {
    setPieOption('1', pieleftDate.value)
    myChartPieLeft.setOption(pieLeftOption.value);
})

watch(pieRightDate, () => {
    setPieOption('0', pieRightDate.value)
    myChartPieRight.setOption(pieRightOption.value);
})

watch(lineDate, () => {
    console.log(34);
    setLineOptions()
    myChartLine.setOption(lineOption.value)
})

</script>


<style lang="less" scoped>
.accountBookChart {
    height: 100%;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    .pie {
        display: flex;
        gap: 24px;
    }
}
</style>