from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from models import db, User, Event, Booking
from datetime import datetime, timedelta
import os
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import uuid

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-this')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///events.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-this')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize extensions
db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Create database tables
with app.app_context():
    db.create_all()

# Routes

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Event Booking API is running'}), 200

# Auth Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password
    )
    
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'message': 'User registered successfully',
        'user': user.to_dict(),
        'token': access_token
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not bcrypt.check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict(),
        'token': access_token
    }), 200

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'user': user.to_dict()}), 200

# Event Routes
@app.route('/api/events', methods=['GET'])
def get_events():
    # Optional query parameters for filtering
    category = request.args.get('category')
    search = request.args.get('search')
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    
    query = Event.query
    
    if category:
        query = query.filter_by(category=category)
    if search:
        query = query.filter(Event.title.ilike(f'%{search}%'))
    if date_from:
        query = query.filter(Event.date >= datetime.fromisoformat(date_from))
    if date_to:
        query = query.filter(Event.date <= datetime.fromisoformat(date_to))
    
    events = query.order_by(Event.date.asc()).all()
    return jsonify({'events': [event.to_dict() for event in events]}), 200

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    
    return jsonify({'event': event.to_dict()}), 200

@app.route('/api/events', methods=['POST'])
@jwt_required()
def create_event():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user.is_admin:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.form
    
    if not data.get('title') or not data.get('date') or not data.get('location'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Handle image upload
    image_url = None
    if 'image' in request.files:
        file = request.files['image']
        if file and allowed_file(file.filename):
            filename = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            image_url = f"/uploads/{filename}"
    
    event = Event(
        title=data['title'],
        description=data.get('description', ''),
        date=datetime.fromisoformat(data['date']),
        location=data['location'],
        price=float(data.get('price', 0)),
        capacity=int(data.get('capacity', 100)),
        category=data.get('category', 'General'),
        image_url=image_url,
        organizer_id=user_id
    )
    
    db.session.add(event)
    db.session.commit()
    
    return jsonify({
        'message': 'Event created successfully',
        'event': event.to_dict()
    }), 201

@app.route('/api/events/<int:event_id>', methods=['PUT'])
@jwt_required()
def update_event(event_id):
    user_id = get_jwt_identity()
    event = Event.query.get(event_id)
    
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    
    if event.organizer_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.form
    
    if 'title' in data:
        event.title = data['title']
    if 'description' in data:
        event.description = data['description']
    if 'date' in data:
        event.date = datetime.fromisoformat(data['date'])
    if 'location' in data:
        event.location = data['location']
    if 'price' in data:
        event.price = float(data['price'])
    if 'capacity' in data:
        event.capacity = int(data['capacity'])
    if 'category' in data:
        event.category = data['category']
    
    # Handle image upload
    if 'image' in request.files:
        file = request.files['image']
        if file and allowed_file(file.filename):
            # Delete old image if exists
            if event.image_url:
                old_file = os.path.join(app.config['UPLOAD_FOLDER'], os.path.basename(event.image_url))
                if os.path.exists(old_file):
                    os.remove(old_file)
            
            filename = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            event.image_url = f"/uploads/{filename}"
    
    db.session.commit()
    
    return jsonify({
        'message': 'Event updated successfully',
        'event': event.to_dict()
    }), 200

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    user_id = get_jwt_identity()
    event = Event.query.get(event_id)
    
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    
    if event.organizer_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Delete image file if exists
    if event.image_url:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], os.path.basename(event.image_url))
        if os.path.exists(file_path):
            os.remove(file_path)
    
    db.session.delete(event)
    db.session.commit()
    
    return jsonify({'message': 'Event deleted successfully'}), 200

# Booking Routes
@app.route('/api/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('event_id'):
        return jsonify({'error': 'Event ID is required'}), 400
    
    event = Event.query.get(data['event_id'])
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    
    # Check if event has available spots
    current_bookings = Booking.query.filter_by(event_id=event.id).count()
    if current_bookings >= event.capacity:
        return jsonify({'error': 'Event is fully booked'}), 400
    
    # Check if user already booked
    existing_booking = Booking.query.filter_by(
        user_id=user_id,
        event_id=event.id
    ).first()
    
    if existing_booking:
        return jsonify({'error': 'You have already booked this event'}), 400
    
    booking = Booking(
        user_id=user_id,
        event_id=event.id,
        quantity=data.get('quantity', 1),
        total_amount=event.price * data.get('quantity', 1)
    )
    
    db.session.add(booking)
    db.session.commit()
    
    return jsonify({
        'message': 'Booking created successfully',
        'booking': booking.to_dict()
    }), 201

@app.route('/api/bookings', methods=['GET'])
@jwt_required()
def get_user_bookings():
    user_id = get_jwt_identity()
    bookings = Booking.query.filter_by(user_id=user_id).order_by(Booking.created_at.desc()).all()
    
    return jsonify({'bookings': [booking.to_dict() for booking in bookings]}), 200

# Serve uploaded files
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)