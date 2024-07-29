// JSONファイルからデータを取得する
fetch('logit_output.json')
    .then(response => response.json())
    .then(jsonData => {
        // JSONから取得したデータをChart.jsに適用
        var data = {
            labels: jsonData.labels,
            datasets: jsonData.datasets
        };

        var options = {
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '月'
                    },
                    min: jsonData.labels[0],
                    max: jsonData.labels[jsonData.labels.length - 1],
                },
                y: {
                    display: true,
                    min: 0,
                    title: {
                        display: true,
                        text: '個'
                    },
                    ticks: {
                        callback: function (value, index, ticks) {
                            return value + '個';
                        }
                    }
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
                        var tooltipEl = document.getElementById('chartjs-tooltip');

                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip';
                            tooltipEl.innerHTML = '<table></table>';
                            document.body.appendChild(tooltipEl);
                        }

                        var tooltipModel = context.tooltip;

                        if (tooltipModel.opacity === 0) {
                            tooltipEl.style.opacity = 0;
                            return;
                        }
                        tooltipEl.classList.remove('above', 'below', 'no-transform');
                        if (tooltipModel.yAlign) {
                            tooltipEl.classList.add(tooltipModel.yAlign);
                        } else {
                            tooltipEl.classList.add('no-transform');
                        }

                        if (tooltipModel.body) {
                            var titleLines = tooltipModel.title || [];
                            var bodyLines = tooltipModel.body.map(item => item.lines);

                            var innerHtml = '<thead>';

                            titleLines.forEach(function (title) {
                                innerHtml += '<tr><th>' + title + '</th></tr>';
                            });
                            innerHtml += '</thead><tbody>';

                            bodyLines.forEach(function (body, i) {
                                // x軸の値を取得
                                var index = tooltipModel.dataPoints[0].dataIndex;
                                var xValue = context.chart.data.labels[index];

                                // x軸の値に基づいて画像ファイル名を決定
                                var imageDir = 'images/'
                                var imageName = 'frame_' + xValue + '.jpg';
                                var imagePath = imageDir + imageName

                                innerHtml += '<tr><td>' + body + '<br><img src="' + imagePath + '" width="200" height="200"></td></tr>';
                            });
                            innerHtml += '</tbody>';

                            var tableRoot = tooltipEl.querySelector('table');
                            tableRoot.innerHTML = innerHtml;
                        }

                        var position = context.chart.canvas.getBoundingClientRect();
                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.position = 'absolute';
                        tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                        tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                        tooltipEl.style.pointerEvents = 'none';
                    }
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'xy',
                        threshold: 5,
                        overScaleMode: 'xy',
                        rangeMin: {
                            x: jsonData.labels[0]
                        },
                        rangeMax: {
                            x: jsonData.labels[jsonData.labels.length - 1]
                        }
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                            modifierKey: 'ctrl',
                            speed: 0.01
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
            }
        };

        var ctx = document.getElementById("chart").getContext("2d");
        var chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options
        });

        // ズームイン・ズームアウトの範囲を調整する変数
        var zoomFactor = 0.2;

        // ズームイン関数
        window.zoomIn = function zoomIn() {
            var xScale = chart.scales.x;
            var range = xScale.max - xScale.min;
            var mid = (xScale.min + xScale.max) / 2;
            var newRange = range * (1 - zoomFactor);

            chart.options.scales.x.min = Math.max(0, mid - newRange / 2);
            chart.options.scales.x.max = Math.min(chart.data.labels.length - 1, mid + newRange / 2);
            chart.update();
        }

        // ズームアウト関数
        window.zoomOut = function zoomOut() {
            var xScale = chart.scales.x;
            var range = xScale.max - xScale.min;
            var mid = (xScale.min + xScale.max) / 2;
            var newRange = range * (1 + zoomFactor);

            chart.options.scales.x.min = Math.max(0, mid - newRange / 2);
            chart.options.scales.x.max = Math.min(chart.data.labels.length - 1, mid + newRange / 2);
            chart.update();
        }
    })
    .catch(error => console.error('Error loading JSON data:', error));
