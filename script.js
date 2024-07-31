function drawGraph(filepath, index) {
    var chart;
    var data;
    var showIndex;
    var showBody;

    // 新しいチャートセットの作成
    var chartContainer = document.createElement('div');
    chartContainer.className = 'chart-div';
    chartContainer.id = 'chart-div' + index;

    // Canvasを作成
    var canvas = document.createElement('canvas');
    canvas.id = 'chart-' + index;
    chartContainer.appendChild(canvas);

    // リセットボタンの作成
    var button = document.createElement('button');
    button.textContent = 'Reset';
    button.onclick = function () {
        resetZoom(charts[index]);
    };
    chartContainer.appendChild(button);

    // 凡例用のチェックボックス
    var legendDiv = document.createElement('div');
    legendDiv.id = 'legend-' + index;
    legendDiv.className = 'legend';
    chartContainer.appendChild(legendDiv);

    // ツールチップ用のdiv
    var tooltipDiv = document.createElement('div');
    tooltipDiv.id = 'face-frame-' + index;
    tooltipDiv.className = 'tooltip';
    chartContainer.appendChild(tooltipDiv);

    // メインのコンテナに追加
    document.getElementById('charts').appendChild(chartContainer);

    // JSONファイルからデータを取得する
    fetch(filepath)
        .then(response => response.json())
        .then(jsonData => {
            // JSONから取得したデータをChart.jsに適用
            data = {
                labels: jsonData.labels,
                datasets: jsonData.datasets
            };

            // ダミーデータを追加（画像の変化を見やすくするため）
            var dummyDataset = {
                label: 'dummy',
                data: new Array(jsonData.labels.length).fill(0),
                borderColor: 'rgba(223, 223, 223, 0.4)',
                backgroundColor: 'rgba(223, 223, 223, 0.2)',
                borderWidth: 0.1,
                fill: false,
                pointRadius: 4 // データポイントの大きさを指定
            };

            data.datasets.push(dummyDataset);

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
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Probability',
                            color: 'black', // ラベルの色
                            font: {
                                size: 14 // ラベルのフォントサイズ
                            }
                        },
                        ticks: {
                            callback: function (value, index, ticks) {
                                return value;
                            }
                        },
                        min: 0,
                        max: 1,
                    },
                },
                plugins: {
                    title: {
                        display: true,
                        text: filepath
                    },
                    tooltip: {
                        enabled: false, // デフォルトのツールチップを無効化
                        external: function (context) {
                            var tooltipModel = context.tooltip;
                            if (tooltipModel.body) {
                                var bodyLines = tooltipModel.body.map(item => item.lines);
                                bodyLines.forEach(function (body, i) {
                                    // x軸の値を取得
                                    var dataIndex = tooltipModel.dataPoints[0].dataIndex;
                                    var xValue = context.chart.data.labels[dataIndex];
                                    faceFrame(xValue, body[0], index)  // body[0]（凡例：x軸の値）
                                    showIndex = dataIndex
                                    showBody = body[0]
                                });
                            }
                        }
                    },
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'xy',
                            threshold: 5,
                            overScaleMode: 'xy',
                            speed: 1.2,
                            rangeMin: {
                                x: Math.min(...jsonData.labels)
                            },
                            rangeMax: {
                                x: Math.max(...jsonData.labels)
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
                animation: false
            };

            var ctx = document.getElementById('chart-' + index).getContext('2d');
            chart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: options
            });

            window.resetZoom = function () {
                chart.resetZoom();
            };

            // チェックボックスの設定
            var legendDiv = document.getElementById('legend-' + index);
            data.datasets.forEach(function (dataset, datasetIndex) {
                var label = dataset.label;

                // チェックボックスとラベルを一緒にするコンテナ
                var container = document.createElement('div');
                container.className = 'legend-item';

                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'legend-' + index;
                checkbox.value = datasetIndex;
                checkbox.id = 'checkbox-legend-' + index + '-' + datasetIndex;

                var labelElement = document.createElement('label');
                labelElement.htmlFor = 'checkbox-label-' + index + '-' + datasetIndex;
                labelElement.innerText = label;

                checkbox.addEventListener('change', function () {
                    data.datasets[datasetIndex].fill = checkbox.checked;
                    chart.update();
                });

                container.appendChild(checkbox);
                container.appendChild(labelElement);
                legendDiv.appendChild(container);
            });

            // 初期状態で全てのfillをfalseに設定
            data.datasets.forEach(function (ds) {
                ds.fill = false;
            });
            chart.update();
        })
        .catch(error => console.error('Error loading JSON data:', error));

    // キーボードの矢印キーイベントをリッスン
    document.addEventListener('keydown', function (event) {
        if (chart) {
            if (event.key === 'ArrowRight') {
                // 右矢印キーを押した場合
                showIndex += 1;
            } else if (event.key === 'ArrowLeft') {
                // 左矢印キーを押した場合
                showIndex -= 1;
            }
            var match = showBody.match(/^([\w]+):/);
            if (match) {
                var targetLabel = match[1];
                var targetDataset = data.datasets.find(dataset => dataset.label === targetLabel);
                if (targetDataset) {
                    var targetData = targetDataset.data[showIndex];
                    const body = targetLabel + ': ' + targetData
                    faceFrame(data.labels[showIndex], body, index);
                } else {
                    console.log('Specified label not found');
                }
            }
        }
    });
}

function removeGraph(index) {
    var parent = document.getElementById('charts');
    var child = document.getElementById('chart-div' + index);
    if (parent && child && parent.contains(child)) {
        parent.removeChild(child);
    }
}