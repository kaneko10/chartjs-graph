import pandas as pd
import json

# CSVファイルの読み込み
csv_file_path = 'input.csv'
df = pd.read_csv(csv_file_path)

# 欠損データを"NaN"で埋める
df = df.fillna("NaN")

# フレーム番号を抽出して整数に変換して"labels"に設定
labels = df['Image'].apply(lambda x: int(x.split('_')[1].split('.')[0])).tolist()

# JSON形式のデータ作成
json_data = {
    "labels": labels,
    "datasets": [
        {
            "label": col,
            "data": df[col].tolist()
        } for col in df.columns if col != 'Image'
    ]
}

# JSONファイルに保存
json_file_path = 'output.json'
with open(json_file_path, 'w') as json_file:
    json.dump(json_data, json_file, ensure_ascii=False, indent=4)

print(f'Data has been successfully converted and saved to {json_file_path}')
