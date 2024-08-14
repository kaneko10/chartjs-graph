function getRecalculationConditions() {
    var minRange = document.getElementById('min-range-recalculation').value;
    var maxRange = document.getElementById('max-range-recalculation').value;

    var labels = [];
    // すべてのチェックボックスを取得
    var variablesDiv = document.getElementById('variables');
    var checkboxes = variablesDiv.querySelectorAll('input[type="checkbox"]');
    // 選択されたチェックボックスのラベル名を取得
    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            // チェックボックスに対応するラベルを取得
            var label = document.querySelector(`label[for="${checkbox.id}"]`);
            if (label) {
                labels.push(label.textContent);
            }
        }
    });

    const conditions = { minRange: parseInt(minRange), maxRange: parseInt(maxRange), variableName: labels};
    return conditions;
}

function drawRecalculation(variablesMap, graphID) {
    const conditions = getRecalculationConditions();
    const variableNames = conditions['variableName'];
    const min = conditions['minRange'];
    const max = conditions['maxRange'];

    const rangeArray = [];
    // for (let i = min; i <= max; i++) {
    //     rangeArray.push(i);
    // }
    for (let i = 0; i < variablesMap.get(variableNames[0]).length; i++) {
        rangeArray.push(i);
    }

    const datasets = [];

    variableNames.forEach(function (name) {
        const value = variablesMap.get(name);
        const dataset = {
            data: value,
            label: name,
            "borderWidth": 2,
            "pointRadius": 1,
        }
        datasets.push(dataset);
    });

    let data = {
        labels: rangeArray,
        datasets: datasets
    };

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
                    display: false,
                },
                ticks: {
                    callback: function (value, index, ticks) {
                        return value;
                    }
                },
                min: Math.floor(Math.min(...data.datasets[0].data)),
                max: Math.ceil(Math.max(...data.datasets[0].data)),
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Recalculation',
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
                        x: Math.min(...data.labels)
                    },
                    rangeMax: {
                        x: Math.max(...data.labels)
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