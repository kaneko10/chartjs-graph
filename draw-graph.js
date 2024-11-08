var chartsMap = new Map();
var variables = new Map();
var startFramesMap = new Map(); // 各グラフのjsonデータ上の最初のフレーム番号を管理（全てのグラフを0始まりにするため）

function drawGraph(filename, selectedLabels, graphID, directoryName) {
    var chart;
    var data;
    var showIndex;
    var showBody;
    const fps = 30;
    const frame_interval = 2;   // フレーム番号間隔
    var firstFrameNum;

    // JSONファイルからデータを取得する
    const filepath = `json/${directoryName}/${filename}`;
    fetch(filepath)
        .then(response => response.json())
        .then(jsonData => {
            // ラベルで選択したデータセットのみを抽出
            const filteredDatasets = jsonData.datasets.filter(dataset => selectedLabels.includes(dataset.label));

            // 感情ラベルのデータセットのみを抽出
            const emotionDatasets = jsonData.datasets.filter(dataset => ['Emotion', 'Emotion_ind'].includes(dataset.label));

            // JSONから取得したデータをChart.jsに適用
            const startFrame = jsonData.labels[0];
            startFramesMap.set(graphID, startFrame);
            const rangeArray = [];
            for (let i = 0; i < jsonData.labels.length; i++) {
                rangeArray.push(i);
            }

            data = {
                labels: rangeArray,
                datasets: filteredDatasets // フィルタリングされたデータセットのみ使用
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
                            callback: function (value, index, ticks) {
                                return `${jsonData.annotations[value]} - ${rangeArray[value]}`;
                            }
                        }
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
                                    showIndex = tooltipModel.dataPoints[0].dataIndex;
                                    const xValue = context.chart.data.labels[showIndex];
                                    const frameNum = xValue * frame_interval + + startFramesMap.get(graphID);   // グラフの開始を0にしているため
                                    const passFrameNum = data.labels[showIndex] - firstFrameNum;
                                    const passTime = passFrameNum / fps;
                                    faceFrame(filepath, xValue, frameNum, body[0], graphID, passTime);   // body[0]（凡例：x軸の値）
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
                animation: false,
                maintainAspectRatio: false  // サイズ変更時のアスペクト比を維持するかどうか
            };

            var ctx = document.getElementById('chart-' + graphID).getContext('2d');
            chart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: options
            });
            chartsMap.set(graphID, chart)

            // チェックボックスの設定
            var legendDiv = document.getElementById('legend-' + graphID);
            data.datasets.forEach(function (dataset, datasetIndex) {
                var label = dataset.label;

                // チェックボックスとラベルを一緒にするコンテナ
                var container = document.createElement('div');
                container.className = 'legend-item';

                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'legend-' + graphID;
                checkbox.value = datasetIndex;
                checkbox.id = 'checkbox-legend-' + graphID + '-' + datasetIndex;

                var labelElement = document.createElement('label');
                labelElement.htmlFor = 'checkbox-legend-' + graphID + '-' + datasetIndex;
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

            // 利用できる変数リストをセット
            const personName = filename.split('_').slice(-1)[0].replace('.json', '');
            filteredDatasets.forEach(dataset => {
                if (dataset.label != 'dummy') {
                    addVariables([`${dataset.label}_${personName}`], [dataset.data]);
                }
            });
            emotionDatasets.forEach(dataset => {
                addVariables([`${dataset.label}_${personName}`], [dataset.data]);
            });
            displayVariables();
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
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                var match = showBody.match(/^([\w]+):/);
                if (match) {
                    var targetLabel = match[1];
                    var targetDataset = data.datasets.find(dataset => dataset.label === targetLabel);
                    if (targetDataset) {
                        var targetData = targetDataset.data[showIndex];
                        const body = targetLabel + ': ' + targetData
                        const passFrameNum = data.labels[showIndex] - firstFrameNum;
                        const passTime = passFrameNum / fps;
                        faceFrame(filepath, data.labels[showIndex], body, graphID, passTime);
                    } else {
                        console.log('Specified label not found');
                    }
                }
            }
        }
    });
}

function removeGraph(graphID) {
    var parent = document.getElementById('charts');
    var child = document.getElementById('chart-div-' + graphID);
    if (parent && child && parent.contains(child)) {
        parent.removeChild(child);
        chartsMap.delete(graphID);
        startFramesMap.delete(graphID);
    }
}

function resetZoom(chart) {
    chart.resetZoom();
}

// 範囲を更新する関数
function updateRange(graphID) {
    chart = chartsMap.get(graphID);
    var minRange = document.getElementById(`min-range-${graphID}`).value;
    var maxRange = document.getElementById(`max-range-${graphID}`).value;

    chart.options.scales.x.min = minRange ? parseFloat(minRange) : undefined;
    chart.options.scales.x.max = maxRange ? parseFloat(maxRange) : undefined;
    chart.update();
}

// 利用可能変数リストに追加
function addVariables(keys, values) {
    for (i = 0; i < keys.length; i++) {
        if (!variables.has(keys[i])) {
            variables.set(keys[i], values[i]);
        }
    }
}

// 利用可能な変数リストを表示
function displayVariables() {
    var variablesDiv = document.getElementById('variables');

    // すべてのチェックボックスを削除する
    var checkboxes = variablesDiv.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        variablesDiv.removeChild(checkbox);
        var label = variablesDiv.querySelector(`label[for="${checkbox.id}"]`);
        if (label) {
            variablesDiv.removeChild(label);
        }
    });

    // 変数の値を全て表示する
    variables.forEach(function (value, key) {
        // チェックボックスを作成
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checkbox-variables-${key}`;
        checkbox.name = key;
        checkbox.value = key;
        checkbox.style.marginRight = '5px';

        // ラベルを作成
        var label = document.createElement('label');
        label.htmlFor = `checkbox-variables-${key}`;
        label.textContent = key;
        label.style.marginRight = '12px';  // チェックボックスと次の要素の間に余白を追加

        // チェックボックスとラベルをDOMに追加
        variablesDiv.appendChild(checkbox);
        variablesDiv.appendChild(label);
    });

    console.log(variables);
}

function evaluateFormula(graphID) {
    const results = getCalculationResult(variables, graphID);
    const variableName = results[0];
    const resultData = results[1];
    const resultsChart = drawResults(graphID, resultData, variableName);
    chartsMap.set(graphID, resultsChart);
    addVariables([variableName], [resultData]);
    displayVariables();
}

// p_i, n_i を始点を指定して再計算
function orderRecalculationGraph(graphID) {
    const results = drawRecalculation(new Map(variables), graphID);
    chartsMap.set(graphID, results.chart);

    const newNames = results.names;
    const newData = results.data;
    addVariables(newNames, newData);
    displayVariables();
}

function orderSaveVariablesToCSV() {
    saveVariablesToCSV(new Map(variables));
}

function orderLoadVariables(csvData) {
    const loadVariablesMap = csvToMap(csvData);
    const keysArray = Array.from(loadVariablesMap.keys());
    const valuesArray = Array.from(loadVariablesMap.values());
    addVariables(keysArray, valuesArray);
    displayVariables();
}
