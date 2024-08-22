var idList = [];
var filenamesList;
let directoryName = "";

// 一意のIDを生成するカウンター
let idCounter = 0;

function orderGraphItems(filenames, dirName) {
    const graphID = addIdToList();
    filenamesList = filenames;
    if (!directoryName) {
        directoryName = dirName;
        console.log(directoryName);
    }
    makeGraphItems(filenames, graphID);
}

function orderDrawGraph(filenames, selectedFilenames, selectedLabels, graphID) {
    selectedFilenames.forEach(filename => {
        const newestGraphID = idList[idList.length - 1];
        drawGraph(filename, selectedLabels, newestGraphID, directoryName);
        orderGraphItems(filenames, directoryName);
    });
}

function orderRemoveGraph(graphID) {
    if (removeIdFromList(graphID)) {
        removeGraph(graphID);
    }
}

function orderEvaluateFormula(graphID) {
    evaluateFormula(graphID);

    // 新しいグラフの描画エリアを作成
    const nextGraphID = addIdToList();
    makeGraphItems(filenamesList, nextGraphID);
}

function orderRecalculation() {
    const newestGraphID = idList[idList.length - 1];
    orderRecalculationGraph(newestGraphID);

    // 新しいグラフの描画エリアを作成
    const nextGraphID = addIdToList();
    makeGraphItems(filenamesList, nextGraphID);
}

// 選択した変数名のデータをCSVに保存
function orderManagerSaveVariables() {
    orderSaveVariablesToCSV();
}

function orderManagerLoadVariables(csvData) {
    orderLoadVariables(csvData);
}

// 一意のIDを生成する関数
function generateUniqueId() {
    idCounter += 1;
    return `id_${idCounter}`;
}

// 新しいIDをリストに追加する関数
function addIdToList() {
    const newId = generateUniqueId();
    idList.push(newId);
    return newId;
}

// 指定したIDをリストから削除する関数
function removeIdFromList(id) {
    const index = idList.indexOf(id);
    if (index !== -1) {
        idList.splice(index, 1);
        return true; // 削除成功
    }
    return false; // 削除失敗（IDが見つからない）
}
