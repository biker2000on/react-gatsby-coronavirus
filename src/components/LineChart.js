import React, {
  useState,
  useEffect
} from 'react';
import {
  Line
} from 'react-chartjs-2'
import axios from 'axios'

const LineChart = ({
  code,
  chartDataType = 'cases'
}) => {
  const [chartData, setChartData] = useState({})
  const [chartTypes, setChartTypes] = useState({cases: true, deaths: true, recovered: true, dailyCases: true})

  const options = {
    scales: {
      xAxes: [{
        type: 'time',
        distribution: 'linear',
        time: {
          displayFormats: {
            day: 'MMM D YYYY'
          }
        }
      }],
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-1',
          gridLines: {
            display: true
          },
          labels: {
            show: true
          }
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-2',
          gridLines: {
            display: false
          },
          labels: {
            show: true
          }
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-3',
          gridLines: {
            display: false
          },
          labels: {
            show: true
          }
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-4',
          gridLines: {
            display: false
          },
          labels: {
            show: true
          }
        }
      ]
    }
  }

  useEffect(() => {
    async function getData() {
      let response
      try {
        response = await axios.get(`https://corona.lmao.ninja/v2/historical/${code}`, {
          params: {
            lastdays: "all"
          }
        })
      } catch (e) {
        console.log(`Failed to fetch country data: ${e.message}`, e)
        return
      }
      const {
        data = {}
      } = response

      const hasData = Object.keys(data).length > 0

      console.log(data, hasData)
      if (!hasData) return
      let dates = Object.keys(data.timeline[chartDataType])
      let cases = []
      let dailyCases = []
      let deaths = []
      let recovered = []
      dates.map((c, i) => {
        cases.push({
          t: new Date(c),
          y: data.timeline[chartDataType][c]
        })
        deaths.push({
          t: new Date(c),
          y: data.timeline['deaths'][c] - data.timeline['deaths'][i > 0 ? dates[i - 1] : 0]
        })
        recovered.push({
          t: new Date(c),
          y: data.timeline['recovered'][c] - data.timeline['recovered'][i > 0 ? dates[i - 1] : 0]
        })
        dailyCases.push({
          t: new Date(c),
          y: data.timeline['cases'][c] - data.timeline['cases'][i > 0 ? dates[i - 1] : 0]
        })
        
      })
      console.log(dailyCases)
      setChartData({
        datasets: [
          {
            label: 'Cases',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            yAxisID: 'y-axis-1',
            data: cases
          },
          {
            label: 'Daily Cases',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'red',
            borderColor: 'red',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'red',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'red',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            yAxisID: 'y-axis-2',
            data: dailyCases
          },
          {
            label: 'Deaths',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'blue',
            borderColor: 'blue',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'blue',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'blue',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            yAxisID: 'y-axis-3',
            data: deaths
          },
          {
            label: 'Recovered',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'orange',
            borderColor: 'orange',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'orange',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'orange',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            yAxisID: 'y-axis-4',
            data: recovered
          }
        ]
      })
    }
    getData()
    return
  }, [code])

  function handleCheckbox(e) {
    let checked = {...chartTypes}
    checked[e.target.name] = e.target.checked
    setChartTypes(checked)
    // let typeMap = {
    //   Cases: 'cases',
    //   Deaths: 'deaths',
    //   "Daily Cases": "dailyCases",
    //   Recovered: 'recovered'
    // }
    // let data = chartData.datasets
    // let dat = data.map(c => {
    //   return {...c, hidden: !chartTypes[typeMap[c.label]]}
    // })
    // console.log(dat)
    // setChartData(dat)
  }

  return ( 
    <>
    <div>
      {Object.keys(chartTypes).map(c => (
        <>
        <input type="checkbox" id={c} name={c} value={c} onChange={handleCheckbox} checked={chartTypes[c]}></input>
        <label for={c}>{c}</label>
        </>
      ))}
    </div>
    <Line data = {
      chartData
    }
    options = {
      options
    }
    />
    </>
  );
}

export default LineChart;