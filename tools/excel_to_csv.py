import pandas as pd
import os

excel_path = 'C:/Users/souma/D Drive/My interest/Software/AI Website/hostinger-export/BMS JSON Packets.xlsx'  # Adjust path if needed
output_dir = './csv_tables'

os.makedirs(output_dir, exist_ok=True)

# Load the Excel file
xls = pd.ExcelFile(excel_path)

for sheet_name in xls.sheet_names:
    df = pd.read_excel(xls, sheet_name=sheet_name)
    # Clean sheet name for filename
    safe_name = sheet_name.replace(' ', '_').replace('/', '_').lower()
    csv_path = os.path.join(output_dir, f'{safe_name}.csv')
    df.to_csv(csv_path, index=False)
    print(f"Saved {csv_path}")

print("All sheets converted to CSV!")
