function faceFrame(frameNum, value, index) {
    var tooltipEl = document.getElementById('face-frame-' + index);
    var baseDiv = document.getElementById('chart-' + index);
    var baseRect = baseDiv.getBoundingClientRect();

    var innerHtml = '';

    // x軸の値に基づいて画像ファイル名を決定
    var imageDir = 'images/';
    var imageName = 'frame_' + frameNum + '.jpg';
    var imagePath = imageDir + imageName;

    innerHtml += '<p>' + frameNum + '</p>';
    innerHtml += '<p>' + value + '</p>';
    innerHtml += '<br><img src="' + imagePath + '" width="200" height="200">';
 
    tooltipEl.innerHTML = innerHtml;

    tooltipEl.style.opacity = 1;
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = '50px';
    tooltipEl.style.top = (baseRect.top + document.documentElement.scrollTop) + 'px';
    tooltipEl.style.pointerEvents = 'none';
}