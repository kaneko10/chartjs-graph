// 計算式の結果のグラフを描写
function drawResults(graphID, results, variableName) {
    var chart;
    var data;

    let labels = Array.from({ length: results.length }, (_, i) => i)

    data = {
        labels: labels,
        datasets: [{
            data: results,
            label: variableName,
            "borderWidth": 2,
            "pointRadius": 1,
            borderColor: 'rgba(218, 165, 32, 0.4)', // ゴールデンロッド
            backgroundColor: 'rgba(218, 165, 32, 0.2)', // ゴールデンロッド
        }]
    };

    firstFrameNum = data.labels[0];

    var options = {
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Frame Number', // ラベルのテキスト
                    color: 'black', // ラベルの色
                    font: {
                        size: 14 // ラベルのフォントサイズ
                    }
                },
                ticks: {
                    maxRotation: 90,
                    minRotation: 90,
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: variableName,
                    color: 'black', // ラベルの色
                    font: {
                        size: 14 // ラベルのフォントサイズ
                    }
                },
                ticks: {
                    callback: function (value, index, ticks) {
                        return value.toFixed(2);  // 小数点以下2桁で表示
                    }
                },
                min: Math.floor(Math.min(...data.datasets[0].data)),
                max: Math.ceil(Math.max(...data.datasets[0].data)),
            },
        },
        plugins: {
            title: {
                display: true,
                text: variableName,
            },
            tooltip: {
                enabled: true,
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'xy',
                    threshold: 5,
                    overScaleMode: 'xy',
                    speed: 1.2,
                    rangeMin: {
                        x: Math.min(...labels)
                    },
                    rangeMax: {
                        x: Math.max(...labels)
                    }
                },
                zoom: {
                    wheel: {
                        enabled: true,
                        modifierKey: 'ctrl',
                        speed: 0.04
                    },
                    drag: {
                        enabled: false,
                    },
                    mode: 'xy',
                    overScaleMode: 'xy',
                }
            },
            verticalLinePlugin: true
        },
        verticalLinePlugin: {
            color: 'black',
            lineWidth: '1',
            setLineDash: [2, 2]
        },
        animation: false,
        maintainAspectRatio: false  // サイズ変更時のアスペクト比を維持するかどうか
    };

    var ctx = document.getElementById('chart-' + graphID).getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });

    // 初期状態で全てのfillをfalseに設定
    data.datasets.forEach(function (ds) {
        ds.fill = false;
    });
    chart.update();

    return chart;
}