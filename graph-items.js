function makeGraphItems(groupedFiles) {
    // チェックボックスの設定
    var listDiv = document.getElementById('file-list');

    // 各グループごとに処理を行う
    Object.keys(groupedFiles).forEach(groupKey => {
        const files = groupedFiles[groupKey];
        // チェックボックス用のdiv
        var checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'checkboxDiv';

        files.forEach(function (filename, index) {
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
        });
        listDiv.appendChild(checkboxDiv);
    });
}