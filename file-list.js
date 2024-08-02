// ファイルのアップロード
document.getElementById("file").addEventListener("change", (ev) => {
    var filenames = [];
    for (let i = 0; i < ev.target.files.length; i++) {
        let file = ev.target.files[i];
        // let relativePath = file.webkitRelativePath; // ディレクトリの相対パス
        filenames.push(file.name);
    }

    // グループを格納するオブジェクト
    var groupedFiles = {};

    filenames.forEach(function (filename, index) {
        // 拡張子が.jsonでないファイルは無視する
        if (!filename.endsWith('.json')) return;

        // 最後の"_"以降の部分を取り出し、拡張子を除く
        const groupKey = filename.split('_').slice(-1)[0].replace('.json', '');

        // グループが存在しなければ作成する
        if (!groupedFiles[groupKey]) {
            groupedFiles[groupKey] = [];
        }

        // グループにファイル名を追加する
        groupedFiles[groupKey].push(filename);
    });

    // チェックボックスの設定
    var listDiv = document.getElementById('file-list');

    // 各グループごとに処理を行う
    Object.keys(groupedFiles).forEach(groupKey => {
        const files = groupedFiles[groupKey];
        console.log(`Processing group: ${groupKey}`);
        // チェックボックス用のdiv
        var checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'checkboxDiv';

        files.forEach(function (filename, index) {
            console.log(`  - ${filename}`);
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
                    const graphKey = `${groupKey}${index}`
                    drawGraph(filepath, graphKey);
                } else {
                    removeGraph(`${groupKey}${index}`);
                }
            });

            container.appendChild(checkbox);
            container.appendChild(labelElement);
            checkboxDiv.appendChild(container);
        });
        listDiv.appendChild(checkboxDiv);
    });
});