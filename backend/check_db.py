from app import app, db, User, Event, Booking
from flask_bcrypt import Bcrypt
from datetime import datetime

bcrypt = Bcrypt()

with app.app_context():
    print("Creating database tables...")
    db.create_all()
    
    # Check if there are any users
    users = User.query.all()
    print(f"\nNumber of users: {len(users)}")
    
    for user in users:
        print(f"User: {user.name} ({user.email}) - Admin: {user.is_admin}")
    
    # Create test users if none exist
    if len(users) == 0:
        print("\nCreating test users...")
        admin = User(
            name='Admin User',
            email='admin@example.com',
            password=bcrypt.generate_password_hash('admin123').decode('utf-8'),
            is_admin=True  # Explicitly set admin to True
        )
        regular_user = User(
            name='Test User',
            email='user@example.com',
            password=bcrypt.generate_password_hash('user123').decode('utf-8'),
            is_admin=False
        )
        db.session.add(admin)
        db.session.add(regular_user)
        db.session.commit()
        print("Test users created!")
        print("Admin: admin@example.com / admin123 (is_admin=True)")
        print("User: user@example.com / user123 (is_admin=False)")
    
    # Check events
    events = Event.query.all()
    print(f"\nNumber of events: {len(events)}")
    for event in events:
        print(f"Event: {event.title} by {event.organizer.name if event.organizer else 'Unknown'}")
    
    # If there are existing users but none are admin, make the first user admin
    if len(users) > 0:
        admin_exists = any(user.is_admin for user in users)
        if not admin_exists:
            print("\nNo admin user found. Making the first user admin...")
            first_user = User.query.first()
            first_user.is_admin = True
            db.session.commit()
            print(f"User {first_user.name} ({first_user.email}) is now admin")