
import sqlite3
import os

db_path = 'guests.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT COUNT(*) FROM guests WHERE attended = 1')
        attended_count = cursor.fetchone()[0]
        print(f"Attended count: {attended_count}")
        
        cursor.execute('SELECT COUNT(*) FROM guests')
        total_count = cursor.fetchone()[0]
        print(f"Total guests: {total_count}")
    except Exception as e:
        print(f"Error querying DB: {e}")
    finally:
        conn.close()
else:
    print("Database guests.db does not exist.")
