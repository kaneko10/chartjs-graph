var data = {
    labels: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    datasets: [{
        label: '販売台数',
        data: [880, 740, 900, 520, 930, 780, 850, 910, 670, 720, 890, 950],
        borderColor: 'rgba(255, 100, 100, 1)',
        lineTension: 0,
        fill: false,
        borderWidth: 3
    },
    {
        label: '訪問者数',
        data: [1200, 1000, 1300, 800, 1100, 950, 1000, 1200, 850, 980, 1050, 1120],
        borderColor: 'rgba(54, 162, 235, 1)',
        lineTension: 0,
        fill: false,
        borderWidth: 3
    }]
};
var options = {
    scales: {
        x:{
            display: true,
            title:{
                display: true,
                text: '月'
            }
        },
        y:{
            display: true,
            min: 0,
            title:{
                display: true,
                text: '個'
            },
            ticks: {
                callback: function(value, index, ticks) {
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
            // mode: 'nearest',
            // intersect: false,
            // callbacks: {
            //     label: function (context) {
            //         var label = context.dataset.label || '';
            //         if (label) {
            //             label += ': ';
            //         }
            //         if (context.parsed.y !== null) {
            //             label += context.parsed.y + ' 個';
            //         }
            //         return label;
            //     }
            // }
            external: function (context) {
                // ツールチップの要素を取得
                var tooltipEl = document.getElementById('chartjs-tooltip');

                // ツールチップ要素がなければ作成
                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'chartjs-tooltip';
                    tooltipEl.innerHTML = '<table></table>';
                    document.body.appendChild(tooltipEl);
                }

                // ツールチップのコンテキストを取得
                var tooltipModel = context.tooltip;

                // ツールチップのスタイルと位置設定
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

                // ツールチップの内容を設定
                if (tooltipModel.body) {
                    var titleLines = tooltipModel.title || [];
                    var bodyLines = tooltipModel.body.map(item => item.lines);

                    var innerHtml = '<thead>';

                    titleLines.forEach(function (title) {
                        innerHtml += '<tr><th>' + title + '</th></tr>';
                    });
                    innerHtml += '</thead><tbody>';

                    bodyLines.forEach(function (body, i) {
                        // ここでカスタムHTMLを作成（画像を追加）
                        innerHtml += '<tr><td>' + body + '<br><img src="frame_180.jpg" width="200" height="200"></td></tr>';
                    });
                    innerHtml += '</tbody>';

                    var tableRoot = tooltipEl.querySelector('table');
                    tableRoot.innerHTML = innerHtml;
                }

                // ツールチップの位置を設定
                var position = context.chart.canvas.getBoundingClientRect();
                tooltipEl.style.opacity = 1;
                tooltipEl.style.position = 'absolute';
                tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                tooltipEl.style.pointerEvents = 'none';
            }
        },
        verticalLinePlugin: true
    },
    verticalLinePlugin: {
        color : 'black',
        lineWidth : '1',
        setLineDash : [2,2]
    }
};
var ctx = document.getElementById("chart").getContext("2d");
var chart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
});