import axios from 'axios'
import {init, registerMap} from 'echarts'
import 'echarts-gl'
import mapboxgl from 'mapbox-gl'
import { useEffect } from 'react'

import "./ChartsComponent.css"

function ChartsComponent() {
    
    useEffect(() => {
        window.mapboxgl = mapboxgl
        mapboxgl.accessToken =
            'pk.eyJ1IjoiZGp4YyIsImEiOiJjanlxdzNlbW0wNHNyM29yMzZibHczOHlpIn0.TOUXgB6IHHhnmA6RsL6pWw'
        testBar()
    }, [])

    return (
        <div id="charts">

        </div>
    )

    function initEcharts() {
        // 基于准备好的dom，初始化echarts实例
        let chartDiv = document.getElementById("charts")
        if (chartDiv) {
            let myChart = init(chartDiv)

            // 指定图表的配置项和数据
            let option = {
                title: {
                    text: 'ECharts 入门示例'
                },
                tooltip: {},
                legend: {
                    data: ['销量']
                },
                xAxis: {
                    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                },
                yAxis: {},
                series: [
                    {
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20]
                    }
                ]
            }
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option)
        }
    }

    function echartsMapbox() {
        let chartDiv = document.getElementById("charts")
        if (chartDiv) {
            var chart = init(chartDiv)
            chart.showLoading()
            axios.get('http://localhost:8090/data_city.json')
                .then(result => {
                    let data = result.data
                    console.log(data)
                    registerMap('buildings', data)
                    chart.hideLoading()
                    var regionsData = data.features.map(function (feature: any) {
                        return {
                            name: feature.properties.name,
                            value: Math.random(),
                            height: +feature.properties.height * 10
                        }
                    })
                    chart.setOption({
                        visualMap: {
                            show: false,
                            min: 0.4,
                            max: 1,
                            inRange: {
                                color: [
                                    '#313695',
                                    '#4575b4',
                                    '#74add1',
                                    '#abd9e9',
                                    '#e0f3f8',
                                    '#ffffbf',
                                    '#fee090',
                                    '#fdae61',
                                    '#f46d43',
                                    '#d73027',
                                    '#a50026'
                                ]
                            }
                        },
                        mapbox: {
                            center: [13.409779, 52.520645],
                            zoom: 13,
                            pitch: 50,
                            bearing: -10,
                            style: 'mapbox://styles/mapbox/dark-v9',
                            postEffect: {
                                enable: true,
                                SSAO: {
                                    enable: true,
                                    intensity: 1.3,
                                    radius: 5
                                },
                                screenSpaceReflection: {
                                    enable: false
                                },
                                depthOfField: {
                                    enable: true,
                                    blurRadius: 4,
                                    focalDistance: 90
                                }
                            },
                            light: {
                                main: {
                                    intensity: 3,
                                    alpha: -40,
                                    shadow: true,
                                    shadowQuality: 'high'
                                },
                                ambient: {
                                    intensity: 0
                                },
                                ambientCubemap: {
                                    texture: '/asset/get/s/data-1491838644249-ry33I7YTe.hdr',
                                    exposure: 1,
                                    diffuseIntensity: 0.5,
                                    specularIntensity: 1
                                }
                            }
                        },
                        series: [
                            {
                                type: 'map3D',
                                coordinateSystem: 'mapbox',
                                map: 'buildings',
                                data: regionsData,
                                shading: 'realistic',
                                instancing: true,
                                silent: true,
                                itemStyle: {
                                    areaColor: '#fff'
                                },
                                realisticMaterial: {
                                    metalness: 0,
                                    roughness: 0.0
                                }
                            }
                        ]
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    function threeEcharts() {
        axios.get('https://echarts.apache.org/examples/data/asset/data/life-expectancy-table.json')
            .then(data => {
                let chartDiv = document.getElementById('charts')
                if (chartDiv) {
                    let chart = init(chartDiv)
                    let option = {
                        grid3D: {},
                        tooltip: {},
                        xAxis3D: {
                            type: 'category'
                        },
                        yAxis3D: {
                            type: 'category'
                        },
                        zAxis3D: {},
                        visualMap: {
                            max: 1e8,
                            dimension: 'Population'
                        },
                        dataset: {
                            dimensions: [
                                'Income',
                                'Life Expectancy',
                                'Population',
                                'Country',
                                { name: 'Year', type: 'ordinal' }
                            ],
                            source: data.data
                        },
                        series: [
                            {
                                type: 'bar3D',
                                shading: 'lambert',
                                encode: {
                                    x: 'Year',
                                    y: 'Country',
                                    z: 'Life Expectancy',
                                    tooltip: [0, 1, 2, 3, 4]
                                }
                            }
                        ]
                    }

                    chart.setOption(option)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    function test() {
        let chartDiv = document.getElementById('charts')
        if (chartDiv) {
            let chart = init(chartDiv)
            chart.showLoading()
            axios.get('https://echarts.apache.org/examples/data-gl/asset/data/flights.json')
                .then(result => {
                    chart.hideLoading()
                    let data = result.data
                    console.log(data)
                    function getAirportCoord(idx: any) {
                        return [data.airports[idx][3], data.airports[idx][4]]
                    }
                    var routes = data.routes.map(function (airline: any) {
                        return [getAirportCoord(airline[1]), getAirportCoord(airline[2])]
                    })
                    chart.setOption({
                        mapbox: {
                            center: [117, 39],
                            zoom: 10,
                            altitudeScale: 10000000,
                            style: 'mapbox://styles/mapbox/dark-v9',
                            postEffect: {
                                enable: true,
                                FXAA: {
                                    enable: true
                                }
                            },
                            light: {
                                main: {
                                    intensity: 1,
                                    shadow: true,
                                    shadowQuality: 'high'
                                },
                                ambient: {
                                    intensity: 0
                                }
                            }
                        },
                        series: [
                            {
                                type: 'lines3D',
                                coordinateSystem: 'mapbox',
                                blendMode: 'lighter',
                                polyline: true,
                                effect: {
                                    show: true,
                                    trailWidth: 1,
                                    trailOpacity: 0.5,
                                    trailLength: 0.2,
                                    constantSpeed: 5
                                },
                                lineStyle: {
                                    width: 0.2,
                                    color: 'red',
                                    opacity: 0.05
                                },
                                data: routes
                            }
                        ]
                    })
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    function threePoint() {
        let chartDiv = document.getElementById('charts')
        if (chartDiv) {
            let chart = init(chartDiv)

            axios.get('http://localhost:8090/three_point.json')
                .then(result => {
                    let data = result.data
                        .filter(function (dataItem: any) {
                            return dataItem[2] > 0
                        })
                        .map(function (dataItem: any) {
                            return [dataItem[0], dataItem[1], Math.sqrt(dataItem[2])]
                        })
                    console.log(data)
                    chart.setOption({
                        mapbox: {
                            center: [117, 39],
                            zoom: 10,
                            altitudeScale: 10000000,
                            style: 'mapbox://styles/mapbox/dark-v9',
                            postEffect: {
                                enable: true,
                                FXAA: {
                                    enable: true
                                }
                            },
                            light: {
                                main: {
                                    intensity: 1,
                                    shadow: true,
                                    shadowQuality: 'high'
                                },
                                ambient: {
                                    intensity: 0
                                }
                            }
                        },
                        series: [
                            {
                                type: 'scatter3D',
                                coordinateSystem: 'mapbox',
                                blendMode: 'lighter',
                                symbolSize: 2,
                                itemStyle: {
                                    color: 'rgb(50, 50, 150)',
                                    opacity: 1
                                },
                                data: data
                            }
                        ]
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    function testBar() {
        var hours = [
            '12a',
            '1a',
            '2a',
            '3a',
            '4a',
            '5a',
            '6a',
            '7a',
            '8a',
            '9a',
            '10a',
            '11a',
            '12p',
            '1p',
            '2p',
            '3p',
            '4p',
            '5p',
            '6p',
            '7p',
            '8p',
            '9p',
            '10p',
            '11p'
        ]
        var days = [
            'Saturday',
            'Friday',
            'Thursday',
            'Wednesday',
            'Tuesday',
            'Monday',
            'Sunday'
        ]

        var data = [
            [36, 120, 5],
            [36.2, 120, 4],
            [35.2, 120, 3],
            [35.1, 119, 6],
            [35.3, 119.2, 7],
            [35.4, 119.4, 5]
        ]
        let option = {
            mapbox: {
                center: [120, 36],
                zoom: 10,
                altitudeScale: 1000,
                style: 'mapbox://styles/mapbox/dark-v9',
                postEffect: {
                    enable: true,
                    FXAA: {
                        enable: true
                    }
                },
                light: {
                    main: {
                        intensity: 1,
                        shadow: true,
                        shadowQuality: 'high'
                    },
                    ambient: {
                        intensity: 0
                    }
                }
            },
            tooltip: {},
            visualMap: {
                max: 20,
                inRange: {
                    color: [
                        'rgb(65, 206, 206)',
                        'rgb(66, 206, 206)',
                        'rgb(68, 206, 206)',
                        'rgb(72, 206, 206)',
                        'rgb(75, 206, 206)',
                        'rgb(80, 206, 206)',
                        'rgb(65, 200, 206)',
                        'rgb(65, 212, 206)',
                        'rgb(65, 200, 206)',
                        'rgb(65, 206, 200)',
                        'rgb(65, 206, 220)'
                    ]
                }
            },
            xAxis3D: {
                type: 'category',
                data: hours
            },
            yAxis3D: {
                type: 'category',
                data: days
            },
            zAxis3D: {
                type: 'value'
            },
            grid3D: {
                boxWidth: 200,
                boxDepth: 80,
                viewControl: {
                    // projection: 'orthographic'
                },
                light: {
                    main: {
                        intensity: 1.2,
                        shadow: true
                    },
                    ambient: {
                        intensity: 0.3
                    }
                }
            },
            series: [
                {
                    type: 'bar3D',
                    coordinateSystem: 'mapbox',
                    data: data.map(function (item) {
                        return {
                            value: [item[1], item[0], item[2]]
                        }
                    }),
                    shading: 'lambert',
                    label: {
                        textStyle: {
                            fontSize: 16,
                            borderWidth: 1
                        }
                    },
                    emphasis: {
                        label: {
                            textStyle: {
                                fontSize: 20,
                                color: '#900'
                            }
                        },
                        itemStyle: {
                            color: '#900'
                        }
                    }
                }
            ]
        }
        let chartDiv = document.getElementById('charts')
        if (chartDiv) {
            let chart = init(chartDiv)
            chart.setOption(option)
        }
    }
}

export default ChartsComponent