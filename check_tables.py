
import pandas as pd

file_path = 'توزيع الطاولات (3).xlsx'
try:
    df = pd.read_excel(file_path)
    print("Checking non-numeric table numbers:")
    if 'رقم الطاولة' in df.columns:
        # Convert to numeric, finding NaNs
        numeric_series = pd.to_numeric(df['رقم الطاولة'], errors='coerce')
        # Find rows where original was not NaN but numeric conversion failed
        non_numeric_mask = numeric_series.isna() & df['رقم الطاولة'].notna()
        
        bad_rows = df[non_numeric_mask]
        if not bad_rows.empty:
            print(bad_rows[['الاسم ', 'رقم الطاولة', 'الشخص المسوؤل']])
        else:
            print("No non-numeric table numbers found (excluding potential NaNs).")


except Exception as e:
    print(f"Error: {e}")
