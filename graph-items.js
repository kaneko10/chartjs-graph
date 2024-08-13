function makeGraphItems(filenames, graphID) {
    // 新しいチャートセットの作成
    var chartContainer = document.createElement('div');
    chartContainer.className = 'chart-div';
    chartContainer.id = 'chart-div-' + graphID;

    // ツールチップ用のdiv
    var tooltipDiv = document.createElement('div');
    tooltipDiv.id = 'face-frame-' + graphID;
    tooltipDiv.className = 'tooltip';
    chartContainer.appendChild(tooltipDiv);

    // Canvasのcontainerの作成
    var canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvas-container';
    canvasContainer.id = 'canvas-container-' + graphID;
    canvasContainer.style.position = "relative";
    canvasContainer.style.float = "right";
    canvasContainer.style.width = "80%";
    canvasContainer.style.height = "60%";

    // Canvasを作成
    var canvas = document.createElement('canvas');
    canvas.className = 'canvas';
    canvas.id = 'chart-' + graphID;
    canvasContainer.appendChild(canvas);
    chartContainer.appendChild(canvasContainer);

    // 凡例用のチェックボックス
    var legendDiv = document.createElement('div');
    legendDiv.id = 'legend-' + graphID;
    legendDiv.className = 'legend';
    chartContainer.appendChild(legendDiv);

    // リセットボタンの作成
    var resetButton = document.createElement('button');
    resetButton.className = 'reset-button';
    resetButton.id = 'reset-' + graphID;
    resetButton.textContent = 'Reset';
    resetButton.onclick = function () {
        resetZoom(chartsMap.get(graphID));
    };
    chartContainer.appendChild(resetButton);

    // 範囲指定のための入力フィールドとボタンを作成
    var rangeContainer = document.createElement('div');
    rangeContainer.id = 'rangeDiv-' + graphID;
    var minInput = document.createElement('input');
    minInput.type = 'number';
    minInput.id = `min-range-${graphID}`;
    minInput.placeholder = 'Min range';
    rangeContainer.appendChild(minInput);
    var maxInput = document.createElement('input');
    maxInput.type = 'number';
    maxInput.id = `max-range-${graphID}`;
    maxInput.placeholder = 'Max range';
    rangeContainer.appendChild(maxInput);
    var updateButton = document.createElement('button');
    updateButton.textContent = 'Update Range';
    updateButton.id = `updateButton-${graphID}`;
    updateButton.onclick = function () {
        updateRange(graphID);
    };
    rangeContainer.appendChild(updateButton);
    chartContainer.appendChild(rangeContainer);

    // チェックボックスの設定
    var listDiv = document.createElement('div');
    listDiv.className = 'file-list';
    listDiv.id = 'file-list';
    chartContainer.appendChild(listDiv);

    // グラフ描画ボタンの作成
    var drawButton = document.createElement('button');
    drawButton.className = 'draw-button';
    drawButton.id = 'draw-' + graphID;
    drawButton.textContent = 'Draw';
    drawButton.onclick = function () {
        const filepath = selectedNames[0];
        orderDrawGraph(filenames, filepath, selectedData, graphID);
    };
    chartContainer.appendChild(drawButton);

    // グラフ削除ボタンの作成
    var deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.id = 'delete-' + graphID;
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function () {
        orderRemoveGraph(graphID);
    };
    chartContainer.appendChild(deleteButton);

    // 計算式の入力エリアを作成
    var formulaDiv = document.createElement('div');
    var textarea = document.createElement('textarea');
    textarea.id = `formulaInput-${graphID}`;
    textarea.rows = 4;
    textarea.cols = 50;
    textarea.placeholder = 'Enter formula (e.g., log(2 * P_i + N_i))';
    var lineBreak = document.createElement('br');
    formulaDiv.appendChild(textarea);
    formulaDiv.appendChild(lineBreak);
    chartContainer.appendChild(formulaDiv);

    // 計算式の実行ボタンの作成
    var calculateButton = document.createElement('button');
    calculateButton.className = 'calculate-button';
    calculateButton.id = 'calculate-' + graphID;
    calculateButton.textContent = 'Calculate';
    calculateButton.onclick = function () {
        evaluateFormula(graphID);
    };
    chartContainer.appendChild(calculateButton);

    // メインのコンテナに追加
    document.getElementById('charts').appendChild(chartContainer);

    const selectedNames = [];

    // 各グループごとに処理を行う
    filenames.forEach(function (filename, index) {
        // チェックボックス用のdiv
        var checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'checkboxDiv';

        // チェックボックスとラベルを一緒にするコンテナ
        var container = document.createElement('div');
        container.className = 'file-item';

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = graphID;
        checkbox.value = index;
        checkbox.id = 'checkbox-file-' + graphID + index;

        var labelElement = document.createElement('label');
        labelElement.htmlFor = 'checkbox-file-' + graphID + index;
        // 最後の"_"以降の部分を取り出し、拡張子を除く
        const personName = filename.split('_').slice(-1)[0].replace('.json', '');
        labelElement.innerText = personName;

        checkbox.addEventListener('change', function () {
            const filepath = `json/${filename}`
            if (checkbox.checked) {
                selectedNames.push(filepath);
            } else {
                const index = selectedNames.indexOf(filepath);
                if (index > -1) {
                    selectedNames.splice(index, 1);
                }
            }
        });

        container.appendChild(checkbox);
        container.appendChild(labelElement);
        checkboxDiv.appendChild(container);
        
        listDiv.appendChild(checkboxDiv);
    });

    const dataList = ['P_i', 'N_i', 'F_i', 'Surprise', 'Fear', 'Disgust', 'Happiness', 'Sadness', 'Anger', 'Neutral']
    const selectedData = [];
    dataList.forEach(function (data, index) {
        // チェックボックス用のdiv
        var checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'checkboxDiv';

        // チェックボックスとラベルを一緒にするコンテナ
        var container = document.createElement('div');
        container.className = 'data-item';

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = graphID;
        checkbox.value = data;
        checkbox.id = 'checkbox-' + graphID + data;

        var labelElement = document.createElement('label');
        labelElement.htmlFor = 'checkbox-' + graphID + data;
        labelElement.innerText = data;

        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                selectedData.push(data);
            } else {
                const index = selectedData.indexOf(data);
                if (index > -1) {
                    selectedData.splice(index, 1);
                }
            }
        });

        container.appendChild(checkbox);
        container.appendChild(labelElement);
        checkboxDiv.appendChild(container);

        listDiv.appendChild(checkboxDiv);
    });
}