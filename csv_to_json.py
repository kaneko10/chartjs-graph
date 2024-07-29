import pandas as pd
import json

# CSVファイルの読み込み
csv_file_path = 'input.csv'
df = pd.read_csv(csv_file_path)

# 欠損データを"NaN"で埋める
df = df.fillna("NaN")

# フレーム番号を抽出して整数に変換して"labels"に設定
labels = df['Image'].apply(lambda x: int(x.split('_')[1].split('.')[0])).tolist()

# 色と透明度の設定
emotion_colors = {
    "Surprise": "rgba(173, 216, 230, 0.4)",       # ライトブルー
    "Fear": "rgba(128, 0, 128, 0.4)",           # 紫色
    "Disgust": "rgba(85, 107, 47, 0.4)",        # ダークオリーブグリーン
    "Happiness": "rgba(255, 165, 0, 0.4)",      # オレンジ
    "Sadness": "rgba(0, 0, 255, 0.4)",          # 青
    "Anger": "rgba(255, 0, 0, 0.4)",            # 赤
    "Neutral": "rgba(128, 128, 128, 0.4)"       # グレー
}

# P_i, N_i, F_i のデータを含むJSONデータ作成
pni_fi_data = {
    "labels": labels,
    "datasets": [
        {
            "label": col,
            "data": df[col].tolist(),
            "borderWidth": 2
        } for col in ['P_i', 'N_i', 'F_i'] if col in df.columns
    ]
}

# logit_ で始まるデータを含むJSONデータ作成
# logit_ で始まるデータを含むJSONデータ作成
logit_data = {
    "labels": labels,
    "datasets": [
        {
            "label": col,
            "data": df[col].tolist(),
            "borderColor": emotion_colors[col.split('_')[1]],
            "borderWidth": 2
        } for col in df.columns if col.startswith('logit_')
    ]
}

# JSONファイルに保存
pni_fi_json_path = 'pni_fi_output.json'
logit_json_path = 'logit_output.json'

with open(pni_fi_json_path, 'w') as json_file:
    json.dump(pni_fi_data, json_file, ensure_ascii=False, indent=4)

with open(logit_json_path, 'w') as json_file:
    json.dump(logit_data, json_file, ensure_ascii=False, indent=4)

print(f'Data has been successfully converted and saved to {pni_fi_json_path} and {logit_json_path}')
