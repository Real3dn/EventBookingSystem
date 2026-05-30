import requests
from datetime import datetime, timedelta

# First, run check_db.py to ensure admin user exists
print("Make sure to run check_db.py first to create test users!")
print("\nUsing test credentials:")
print("Admin: admin@example.com / admin123")

# Test user credentials
login_data = {
    "email": "admin@example.com",
    "password": "admin123"
}

# Login first to get token
print("\nLogging in...")
login_response = requests.post('http://localhost:5000/api/auth/login', json=login_data)
print(f"Login status: {login_response.status_code}")

if login_response.status_code == 200:
    response_data = login_response.json()
    token = response_data['token']
    user = response_data['user']
    print(f"User: {user['name']} (Admin: {user['is_admin']})")
    print(f"Token obtained: {token[:20]}...")
    
    # Test creating event with JSON
    event_data = {
        "title": "Test Event",
        "description": "This is a test event",
        "date": (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%dT%H:%M'),
        "location": "Test Location",
        "price": "10.00",
        "capacity": "50",
        "category": "Technology"
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    print("\nCreating event with JSON...")
    print(f"Event data: {event_data}")
    
    response = requests.post(
        'http://localhost:5000/api/events',
        json=event_data,
        headers=headers
    )
    
    print(f"Status: {response.status_code}")
    try:
        print(f"Response: {response.json()}")
    except:
        print(f"Raw response: {response.text}")
    
    # Test getting all events
    print("\nFetching all events...")
    events_response = requests.get('http://localhost:5000/api/events')
    print(f"Status: {events_response.status_code}")
    if events_response.status_code == 200:
        events = events_response.json().get('events', [])
        print(f"Found {len(events)} events")
        for event in events:
            print(f"- {event['title']} ({event['category']})")
    
else:
    print(f"Login failed: {login_response.json()}")
    print("\nPlease run check_db.py first to create test users")