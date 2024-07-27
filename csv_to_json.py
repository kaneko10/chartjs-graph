import pandas as pd

# CSVファイルの読み込み
csv_file_path = 'input.csv'
df = pd.read_csv(csv_file_path)

# 欠損データを"NaN"で埋める
df = df.fillna("NaN")

# JSON形式のデータ作成
json_data = {
    "labels": df.columns.tolist(),
    "datasets": [
        {
            "label": col,
            "data": df[col].tolist()
        } for col in df.columns
    ]
}

# JSONファイルに保存
json_file_path = 'output.json'
with open(json_file_path, 'w') as json_file:
    import json
    json.dump(json_data, json_file, ensure_ascii=False, indent=4)

print(f'Data has been successfully converted and saved to {json_file_path}')

