
import pandas as pd

file_path = 'توزيع الطاولات (4).xlsx'
try:
    df = pd.read_excel(file_path)
    print("Columns found in the new Excel file:")
    for col in df.columns:
        print(repr(col))
except Exception as e:
    print(f"Error reading Excel file: {e}")
