// ファイルのアップロード
document.getElementById("file").addEventListener("change", (ev) => {
    var filenames = [];
    for (let i = 0; i < ev.target.files.length; i++) {
        let file = ev.target.files[i];
        // let relativePath = file.webkitRelativePath; // ディレクトリの相対パス
        filenames.push(file.name);
    }

    // チェックボックスの設定
    var listDiv= document.getElementById('file-list');

    filenames.forEach(function (filename, index) {
        // チェックボックスとラベルを一緒にするコンテナ
        var container = document.createElement('div');
        container.className = 'file-item';

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'filelist';
        checkbox.value = index;
        checkbox.id = 'checkbox-file-' + index;

        var labelElement = document.createElement('label');
        labelElement.htmlFor = 'checkbox-file-' + index;
        labelElement.innerText = filename;

        checkbox.addEventListener('change', function () {
            console.log(filenames[index])
            const filepath = 'json/' + filenames[index];
            drawGraph(filepath, index)
        });

        container.appendChild(checkbox);
        container.appendChild(labelElement);
        listDiv.appendChild(container);
    });
});