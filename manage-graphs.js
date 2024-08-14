var idList = [];

// 一意のIDを生成するカウンター
let idCounter = 0;

function orderGraphItems(filenames) {
    const graphID = addIdToList();
    makeGraphItems(filenames, graphID);
}

function orderDrawGraph(filenames, filename, selectedLabels, graphID) {
    drawGraph(filename, selectedLabels, graphID);
    orderGraphItems(filenames);
}

function orderRemoveGraph(graphID) {
    if (removeIdFromList(graphID)) {
        removeGraph(graphID);
    }
}

function orderEvaluateFormula(filenames, graphID) {
    evaluateFormula(graphID);

    // 新しいグラフの描画エリアの作成を依頼
    orderGraphItems(filenames);
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
