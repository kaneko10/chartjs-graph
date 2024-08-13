function makeGraphItems(filenames) {
    // チェックボックスの設定
    var listDiv = document.getElementById('file-list');

    // 各グループごとに処理を行う
    filenames.forEach(function (filename, index) {
        // 最後の"_"以降の部分を取り出し、拡張子を除く
        const groupKey = filename.split('_').slice(-1)[0].replace('.json', '');

        // チェックボックス用のdiv
        var checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'checkboxDiv';

        // チェックボックスとラベルを一緒にするコンテナ
        var container = document.createElement('div');
        container.className = 'file-item';

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = groupKey;
        checkbox.value = index;
        checkbox.id = 'checkbox-file-' + groupKey + index;

        var labelElement = document.createElement('label');
        labelElement.htmlFor = 'checkbox-file-' + groupKey + index;
        labelElement.innerText = filename;

        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                const filepath = `json/${filename}`
                const graphID = `${groupKey}${index}`
                drawGraph(filepath, graphID);
            } else {
                const graphID = `${groupKey}${index}`
                removeGraph(graphID);
            }
        });

        container.appendChild(checkbox);
        container.appendChild(labelElement);
        checkboxDiv.appendChild(container);
        
        listDiv.appendChild(checkboxDiv);
    });
}