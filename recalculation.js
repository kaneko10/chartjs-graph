function Recalculation() {
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

    console.log(minRange);
    console.log(maxRange);
    console.log(labels);
}