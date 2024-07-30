// JSONファイルからデータを取得する
fetch('logit_output1.json')
    .then(response => response.json())
    .then(jsonData => {
        // JSONから取得したデータをChart.jsに適用
        var data = {
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
                    text: 'デバイス'
                },
                tooltip: {
                    enabled: false, // デフォルトのツールチップを無効化
                    external: function (context) {
                        var tooltipModel = context.tooltip;
                        if (tooltipModel.body) {
                            var bodyLines = tooltipModel.body.map(item => item.lines);
                            bodyLines.forEach(function (body, i) {
                                // x軸の値を取得
                                var index = tooltipModel.dataPoints[0].dataIndex;
                                var xValue = context.chart.data.labels[index];
                                faceFrame(xValue, body[0])  // body[0]（凡例：x軸の値）
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

        var ctx = document.getElementById("myChart").getContext("2d");
        var chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options
        });

        window.resetZoom = function () {
            chart.resetZoom();
        };

        // チェックボックスの設定
        var legend = document.getElementById('legend');

        data.datasets.forEach(function (dataset, index) {
            var label = dataset.label;

            // チェックボックスとラベルを一緒にするコンテナ
            var container = document.createElement('div');
            container.className = 'legend-item';

            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'dataset';
            checkbox.value = index;
            checkbox.id = 'checkbox-' + index;

            var labelElement = document.createElement('label');
            labelElement.htmlFor = 'checkbox-' + index;
            labelElement.innerText = label;

            checkbox.addEventListener('change', function () {
                data.datasets[index].fill = checkbox.checked;
                chart.update();
            });

            container.appendChild(checkbox);
            container.appendChild(labelElement);
            legend.appendChild(container);
        });

        // 初期状態で全てのfillをfalseに設定
        data.datasets.forEach(function (ds) {
            ds.fill = false;
        });
        chart.update();
    })
    .catch(error => console.error('Error loading JSON data:', error));
