// JSONファイルからデータを取得する
fetch('output.json')
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
                    }
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
                                innerHtml += '<tr><td>' + body + '<br><img src="frame_180.jpg" width="200" height="200"></td></tr>';
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
                        mode: 'xy'
                    },
                    zoom: {
                        enabled: true,
                        mode: 'xy',
                        wheel: {
                            enabled: true,
                            speed: 0.001 // ズーム速度を設定
                        },
                        pinch: {
                            enabled: true,
                            speed: 0.001 // ピンチジェスチャーのズーム速度を設定
                        },
                        mode: function ({ chart }) {
                            var chartArea = chart.chartArea;
                            var activeElements = chart.getActiveElements();
                            var mouseX = activeElements.length ? activeElements[0].element.x : null;
                            var mouseY = activeElements.length ? activeElements[0].element.y : null;

                            if (mouseX !== null && mouseX >= chartArea.left && mouseX <= chartArea.right) {
                                return 'x';
                            } else if (mouseY !== null && mouseY >= chartArea.top && mouseY <= chartArea.bottom) {
                                return 'y';
                            } else {
                                return 'xy';
                            }
                        }
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

        // チェックボックスのイベントリスナー
        document.getElementById('toggleSales').addEventListener('change', function () {
            var salesDataset = chart.data.datasets[0];
            salesDataset.hidden = !this.checked;
            chart.update();
        });
        document.getElementById('toggleVisitors').addEventListener('change', function () {
            var visitorsDataset = chart.data.datasets[1];
            visitorsDataset.hidden = !this.checked;
            chart.update();
        });
    })
    .catch(error => console.error('Error loading JSON data:', error));
