import pandas as pd
import os

# Path to save the Excel
excel_path = r"C:\Users\Rohan\Desktop\AgriShield\data_science\sensors.xlsx"

def update_excel(temp, moisture, humidity, rainfall):
    # Create a simple 4-column row
    new_data = {
        'temperature': [temp],
        'soil_moisture': [moisture],
        'humidity': [humidity],
        'rainfall': [rainfall]
    }
    
    df_new = pd.DataFrame(new_data)
    
    if os.path.exists(excel_path):
        # Append to existing file
        df_old = pd.read_excel(excel_path)
        df_final = pd.concat([df_old, df_new], ignore_index=True)
        df_final.to_excel(excel_path, index=False)
    else:
        # Create new file
        df_new.to_excel(excel_path, index=False)
    
    print(f"Excel Updated with 4 factors: T:{temp}, M:{moisture}, H:{humidity}, R:{rainfall}")

# Example usage:
if __name__ == "__main__":
    update_excel(32.5, 45.0, 65.0, 2.0)