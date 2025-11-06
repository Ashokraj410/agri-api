from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
from dotenv import load_dotenv  # <-- ADD THIS

load_dotenv()  # <-- ADD THIS to load .env values

app = Flask(__name__)
CORS(app)

if 'SESSION_SECRET' not in os.environ:
    raise ValueError("SESSION_SECRET environment variable is required")
SECRET_KEY = os.environ.get('SESSION_SECRET')
app.config['SECRET_KEY'] = SECRET_KEY

USERS = {
    'admin': {
        'username': 'Dev410978',
        'password': 'raj978410',
        'role': 'admin',
        'location': 'all'
    },
    'jayankondam': {
        'username': 'Dev410978',
        'password': 'jayankondam',
        'role': 'sales',
        'location': 'jayankondam'
    },
    'devamangalam': {
        'username': 'Dev410978',
        'password': 'devamangalam',
        'role': 'sales',
        'location': 'devamangalam'
    },
    'ariyalur': {
        'username': 'Dev410978',
        'password': 'ariyalur',
        'role': 'sales',
        'location': 'ariyalur'
    }
}

billing_data = {}
stock_data = {}
farmer_data = {}
pending_payments = {}
daily_expenses = {}

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = data
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user_found = None
    for key, user in USERS.items():
        if user['username'] == username and user['password'] == password:
            user_found = user
            break
    
    if user_found:
        token = jwt.encode({
            'username': user_found['username'],
            'role': user_found['role'],
            'location': user_found['location'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'token': token,
            'role': user_found['role'],
            'location': user_found['location'],
            'username': user_found['username']
        }), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/billing/<location>', methods=['GET', 'POST'])
@token_required
def billing(current_user, location):
    if current_user['role'] == 'sales' and current_user['location'] != location:
        return jsonify({'message': 'Access denied'}), 403
    
    if request.method == 'POST':
        data = request.get_json()
        if location not in billing_data:
            billing_data[location] = []
        
        bill = {
            'id': len(billing_data[location]) + 1,
            'farmer_name': data.get('farmer_name'),
            'phone_number': data.get('phone_number'),
            'village': data.get('village'),
            'items': data.get('items', []),
            'total_amount': data.get('total_amount'),
            'paid_amount': data.get('paid_amount'),
            'pending_amount': data.get('pending_amount'),
            'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        billing_data[location].append(bill)
        
        if bill['pending_amount'] > 0:
            if location not in pending_payments:
                pending_payments[location] = []
            pending_payments[location].append({
                'id': len(pending_payments[location]) + 1,
                'bill_id': bill['id'],
                'farmer_name': bill['farmer_name'],
                'phone_number': bill['phone_number'],
                'village': bill['village'],
                'pending_amount': bill['pending_amount'],
                'bill_date': bill['date'],
                'paid_date': None
            })
        
        if location not in farmer_data:
            farmer_data[location] = []
        
        existing_farmer = next((f for f in farmer_data[location] if f['phone_number'] == bill['phone_number']), None)
        if existing_farmer:
            existing_farmer['total_bills'] += 1
            existing_farmer['total_amount'] += bill['total_amount']
            existing_farmer['last_visit'] = bill['date']
        else:
            farmer_data[location].append({
                'id': len(farmer_data[location]) + 1,
                'farmer_name': bill['farmer_name'],
                'phone_number': bill['phone_number'],
                'village': bill['village'],
                'total_bills': 1,
                'total_amount': bill['total_amount'],
                'last_visit': bill['date']
            })
        
        return jsonify({'message': 'Bill created successfully', 'bill': bill}), 201
    
    return jsonify(billing_data.get(location, [])), 200

@app.route('/api/stock/<location>', methods=['GET', 'POST'])
@token_required
def stock(current_user, location):
    if current_user['role'] == 'sales' and current_user['location'] != location:
        return jsonify({'message': 'Access denied'}), 403
    
    if request.method == 'POST':
        data = request.get_json()
        if location not in stock_data:
            stock_data[location] = []
        
        stock_entry = {
            'id': len(stock_data[location]) + 1,
            'product_name': data.get('product_name'),
            'type': data.get('type'),
            'quantity': data.get('quantity'),
            'unit': data.get('unit'),
            'notes': data.get('notes', ''),
            'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        stock_data[location].append(stock_entry)
        
        return jsonify({'message': 'Stock entry added successfully', 'entry': stock_entry}), 201
    
    return jsonify(stock_data.get(location, [])), 200

@app.route('/api/farmers/<location>', methods=['GET'])
@token_required
def farmers(current_user, location):
    if current_user['role'] == 'sales' and current_user['location'] != location:
        return jsonify({'message': 'Access denied'}), 403
    
    return jsonify(farmer_data.get(location, [])), 200

@app.route('/api/pending-payments/<location>', methods=['GET', 'PUT'])
@token_required
def pending_payment(current_user, location):
    if current_user['role'] == 'sales' and current_user['location'] != location:
        return jsonify({'message': 'Access denied'}), 403
    
    if request.method == 'PUT':
        data = request.get_json()
        payment_id = data.get('id')
        
        if location in pending_payments:
            for payment in pending_payments[location]:
                if payment['id'] == payment_id:
                    payment['paid_date'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    payment['pending_amount'] = 0
                    return jsonify({'message': 'Payment updated successfully', 'payment': payment}), 200
        
        return jsonify({'message': 'Payment not found'}), 404
    
    return jsonify(pending_payments.get(location, [])), 200

@app.route('/api/expenses/<location>', methods=['GET', 'POST'])
@token_required
def expenses(current_user, location):
    if current_user['role'] == 'sales' and current_user['location'] != location:
        return jsonify({'message': 'Access denied'}), 403
    
    if request.method == 'POST':
        data = request.get_json()
        if location not in daily_expenses:
            daily_expenses[location] = []
        
        expense_entry = {
            'id': len(daily_expenses[location]) + 1,
            'date': data.get('date', datetime.now().strftime('%Y-%m-%d')),
            'opening_amount': data.get('opening_amount', 0),
            'total_sales': data.get('total_sales', 0),
            'company_payments': data.get('company_payments', []),
            'other_expenses': data.get('other_expenses', []),
            'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        daily_expenses[location].append(expense_entry)
        
        return jsonify({'message': 'Expense entry added successfully', 'entry': expense_entry}), 201
    
    return jsonify(daily_expenses.get(location, [])), 200

@app.route('/api/all-locations', methods=['GET'])
@token_required
def all_locations(current_user):
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Access denied. Admin only.'}), 403
    
    locations = ['jayankondam', 'devamangalam', 'ariyalur']
    all_data = {
        'billing': {},
        'stock': {},
        'farmers': {},
        'pending_payments': {},
        'expenses': {}
    }
    
    for location in locations:
        all_data['billing'][location] = billing_data.get(location, [])
        all_data['stock'][location] = stock_data.get(location, [])
        all_data['farmers'][location] = farmer_data.get(location, [])
        all_data['pending_payments'][location] = pending_payments.get(location, [])
        all_data['expenses'][location] = daily_expenses.get(location, [])
    
    return jsonify(all_data), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
