from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import pandas as pd
import sqlite3
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Database setup
# Use an environment variable for the data directory, default to current directory
DATA_DIR = os.environ.get('DATA_DIR', os.path.dirname(os.path.abspath(__file__)))
DB_NAME = os.path.join(DATA_DIR, 'guests.db')
EXCEL_FILE = 'قائمة المدعويين.xlsx'

def init_db():
    """Initialize the database and load guests from Excel"""
    # Ensure data directory exists
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
        
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS guests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            guest_name TEXT NOT NULL,
            table_number INTEGER,
            responsible_person TEXT,
            attended BOOLEAN DEFAULT 0,
            attendance_time TEXT,
            checked_by TEXT
        )
    ''')
    
    # Check if we need to import from Excel
    cursor.execute('SELECT COUNT(*) FROM guests')
    count = cursor.fetchone()[0]
    
    if count == 0 and os.path.exists(EXCEL_FILE):
        # Load data from Excel
        df = pd.read_excel(EXCEL_FILE)
        
        # Clean the dataframe - skip first row if it's headers
        df = df.iloc[1:]  # Skip the first row
        
        # Get the relevant columns
        for _, row in df.iterrows():
            try:
                guest_name = str(row['اسم المدعو']).strip() if pd.notna(row['اسم المدعو']) else None
                table_number = int(row['رقم الطاولة ']) if pd.notna(row['رقم الطاولة ']) else None
                responsible_person = str(row['الشخص المسوؤل']).strip() if pd.notna(row['الشخص المسوؤل']) else None
                
                if guest_name and guest_name != 'nan':
                    cursor.execute('''
                        INSERT INTO guests (guest_name, table_number, responsible_person)
                        VALUES (?, ?, ?)
                    ''', (guest_name, table_number, responsible_person))
            except Exception as e:
                print(f"Error importing row: {e}")
                continue
    
    conn.commit()
    conn.close()

@app.route('/')
def index():
    """Main page for guest check-in"""
    return render_template('index.html')

@app.route('/api/search', methods=['POST'])
def search_guest():
    """Search for a guest by name"""
    data = request.json
    search_term = data.get('search_term', '').strip()
    
    if not search_term:
        return jsonify({'error': 'يرجى إدخال اسم الضيف'}), 400
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Search for guests (case-insensitive, partial match)
    cursor.execute('''
        SELECT id, guest_name, table_number, responsible_person, attended, attendance_time, checked_by
        FROM guests
        WHERE guest_name LIKE ?
        ORDER BY guest_name
    ''', (f'%{search_term}%',))
    
    results = cursor.fetchall()
    conn.close()
    
    guests = []
    for row in results:
        guests.append({
            'id': row[0],
            'name': row[1],
            'table_number': row[2],
            'responsible_person': row[3],
            'attended': bool(row[4]),
            'attendance_time': row[5],
            'checked_by': row[6]
        })
    
    return jsonify({'guests': guests})

@app.route('/api/checkin', methods=['POST'])
def check_in_guest():
    """Mark a guest as attended"""
    data = request.json
    guest_id = data.get('guest_id')
    checked_by = data.get('checked_by', 'موظف الاستقبال')
    
    if not guest_id:
        return jsonify({'error': 'معرف الضيف مطلوب'}), 400
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Check if guest exists and not already checked in
    cursor.execute('SELECT attended FROM guests WHERE id = ?', (guest_id,))
    result = cursor.fetchone()
    
    if not result:
        conn.close()
        return jsonify({'error': 'الضيف غير موجود'}), 404
    
    if result[0]:
        conn.close()
        return jsonify({'error': 'الضيف مسجل حضوره مسبقاً'}), 400
    
    # Update attendance
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    cursor.execute('''
        UPDATE guests
        SET attended = 1, attendance_time = ?, checked_by = ?
        WHERE id = ?
    ''', (now, checked_by, guest_id))
    
    conn.commit()
    
    # Get updated guest info
    cursor.execute('''
        SELECT id, guest_name, table_number, responsible_person, attended, attendance_time, checked_by
        FROM guests WHERE id = ?
    ''', (guest_id,))
    
    row = cursor.fetchone()
    conn.close()
    
    guest = {
        'id': row[0],
        'name': row[1],
        'table_number': row[2],
        'responsible_person': row[3],
        'attended': bool(row[4]),
        'attendance_time': row[5],
        'checked_by': row[6]
    }
    
    return jsonify({
        'success': True,
        'message': f'تم تسجيل حضور {guest["name"]} بنجاح',
        'guest': guest
    })

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get attendance statistics"""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM guests')
    total = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM guests WHERE attended = 1')
    attended = cursor.fetchone()[0]
    
    cursor.execute('''
        SELECT responsible_person, COUNT(*) as count
        FROM guests
        WHERE attended = 1
        GROUP BY responsible_person
    ''')
    by_responsible = cursor.fetchall()
    
    conn.close()
    
    return jsonify({
        'total_guests': total,
        'attended': attended,
        'pending': total - attended,
        'by_responsible': [{'name': r[0], 'count': r[1]} for r in by_responsible]
    })

@app.route('/api/recent', methods=['GET'])
def get_recent():
    """Get recent check-ins"""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, guest_name, table_number, responsible_person, attendance_time, checked_by
        FROM guests
        WHERE attended = 1
        ORDER BY attendance_time DESC
        LIMIT 10
    ''', ())
    
    results = cursor.fetchall()
    conn.close()
    
    recent = []
    for row in results:
        recent.append({
            'id': row[0],
            'name': row[1],
            'table_number': row[2],
            'responsible_person': row[3],
            'attendance_time': row[4],
            'checked_by': row[5]
        })
    
    return jsonify({'recent': recent})

if __name__ == '__main__':
    init_db()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
