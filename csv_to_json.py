import pandas as pd
import json

# CSVファイルの読み込み
csv_file_path = 'input.csv'
df = pd.read_csv(csv_file_path)

# 欠損データを"NaN"で埋める
df = df.fillna("NaN")

# フレーム番号を抽出して整数に変換して"labels"に設定
labels = df['Image'].apply(lambda x: int(x.split('_')[1].split('.')[0])).tolist()

# P_i, N_i, F_i のデータを含むJSONデータ作成
pni_fi_data = {
    "labels": labels,
    "datasets": [
        {
            "label": col,
            "data": df[col].tolist()
        } for col in ['P_i', 'N_i', 'F_i'] if col in df.columns
    ]
}

# logit_ で始まるデータを含むJSONデータ作成
logit_data = {
    "labels": labels,
    "datasets": [
        {
            "label": col,
            "data": df[col].tolist()
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
