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
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

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

# JWT error handlers
@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({'error': 'Missing or invalid token'}), 401

@jwt.invalid_token_loader
def invalid_token_response(error):
    return jsonify({'error': 'Invalid token'}), 422

@jwt.expired_token_loader
def expired_token_response(jwt_header, jwt_payload):
    return jsonify({'error': 'Token has expired'}), 401

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
    
    # First user is admin
    is_admin = User.query.count() == 0
    
    user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        is_admin=is_admin
    )
    
    db.session.add(user)
    db.session.commit()
    
    # Create token with subject as user ID string
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={'is_admin': user.is_admin}
    )
    
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
    
    # Create token with subject as user ID string
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={'is_admin': user.is_admin}
    )
    
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict(),
        'token': access_token
    }), 200

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        # get_jwt_identity returns a string, convert to int
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
    except Exception as e:
        print(f"Error in /api/auth/me: {str(e)}")
        return jsonify({'error': 'Authentication failed'}), 422

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
        try:
            query = query.filter(Event.date >= datetime.fromisoformat(date_from))
        except:
            pass
    if date_to:
        try:
            query = query.filter(Event.date <= datetime.fromisoformat(date_to))
        except:
            pass
    
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
    try:
        # get_jwt_identity returns a string, convert to int
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get form data or JSON data
        if request.content_type and 'multipart/form-data' in request.content_type:
            data = request.form.to_dict()
        else:
            data = request.get_json()
            if not data:
                return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        title = data.get('title')
        date_str = data.get('date')
        location = data.get('location')
        
        if not title:
            return jsonify({'error': 'Title is required'}), 400
        if not date_str:
            return jsonify({'error': 'Date is required'}), 400
        if not location:
            return jsonify({'error': 'Location is required'}), 400
        
        # Parse date
        try:
            # Handle different date formats
            if 'T' in date_str:
                event_date = datetime.fromisoformat(date_str)
            else:
                event_date = datetime.strptime(date_str, '%Y-%m-%d')
        except ValueError as e:
            return jsonify({
                'error': f'Invalid date format: {str(e)}',
                'expected': 'YYYY-MM-DDTHH:MM or YYYY-MM-DD'
            }), 400
        
        # Handle image upload
        image_url = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename and allowed_file(file.filename):
                filename = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                image_url = f"/uploads/{filename}"
        
        # Create event with safe defaults
        price = float(data.get('price', 0)) if data.get('price') else 0
        capacity = int(data.get('capacity', 100)) if data.get('capacity') else 100
        category = data.get('category', 'General')
        description = data.get('description', '')
        
        event = Event(
            title=title.strip(),
            description=description,
            date=event_date,
            location=location.strip(),
            price=price,
            capacity=capacity,
            category=category,
            image_url=image_url,
            organizer_id=user_id
        )
        
        db.session.add(event)
        db.session.commit()
        
        return jsonify({
            'message': 'Event created successfully',
            'event': event.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating event: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Failed to create event: {str(e)}'}), 422

# Similar update for other routes that use @jwt_required()
@app.route('/api/events/<int:event_id>', methods=['PUT'])
@jwt_required()
def update_event(event_id):
    try:
        user_id = int(get_jwt_identity())
        event = Event.query.get(event_id)
        
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        if event.organizer_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Get form data or JSON data
        if request.content_type and 'multipart/form-data' in request.content_type:
            data = request.form.to_dict()
        else:
            data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update fields if provided
        if 'title' in data and data['title']:
            event.title = data['title'].strip()
        if 'description' in data:
            event.description = data['description']
        if 'date' in data and data['date']:
            try:
                if 'T' in data['date']:
                    event.date = datetime.fromisoformat(data['date'])
                else:
                    event.date = datetime.strptime(data['date'], '%Y-%m-%d')
            except ValueError as e:
                return jsonify({'error': f'Invalid date format: {str(e)}'}), 400
        if 'location' in data and data['location']:
            event.location = data['location'].strip()
        if 'price' in data:
            try:
                event.price = float(data['price'])
            except (ValueError, TypeError):
                pass
        if 'capacity' in data:
            try:
                event.capacity = int(data['capacity'])
            except (ValueError, TypeError):
                pass
        if 'category' in data and data['category']:
            event.category = data['category']
        
        # Handle image upload
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename and allowed_file(file.filename):
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
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating event: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Failed to update event: {str(e)}'}), 422

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    try:
        user_id = int(get_jwt_identity())
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
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 422

# Booking Routes
@app.route('/api/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    try:
        user_id = int(get_jwt_identity())
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
        
        quantity = data.get('quantity', 1)
        
        booking = Booking(
            user_id=user_id,
            event_id=event.id,
            quantity=quantity,
            total_amount=event.price * quantity
        )
        
        db.session.add(booking)
        db.session.commit()
        
        return jsonify({
            'message': 'Booking created successfully',
            'booking': booking.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 422

@app.route('/api/bookings', methods=['GET'])
@jwt_required()
def get_user_bookings():
    try:
        user_id = int(get_jwt_identity())
        bookings = Booking.query.filter_by(user_id=user_id).order_by(Booking.created_at.desc()).all()
        
        return jsonify({'bookings': [booking.to_dict() for booking in bookings]}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 422

# Debug endpoint
@app.route('/api/debug/token', methods=['GET'])
@jwt_required()
def debug_token():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        return jsonify({
            'user_id': user_id,
            'user_exists': user is not None,
            'user': user.to_dict() if user else None
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 422

# Serve uploaded files
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)