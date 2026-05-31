# 🎉 EventHub - Full-Stack Event Booking Platform

A modern, full-stack event booking platform built with React + Vite (Frontend) and Flask (Backend). This application allows users to discover, browse, and book events while providing event organizers with powerful tools to create and manage their events.

Preview (Frontend only): https://real3dneventbooking.netlify.app/

## ✨ Features

### 🎯 Core Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Event Management**: Create, read, update, and delete events
- **Image Upload**: Upload event images with drag-and-drop support
- **Booking System**: Real-time availability tracking and booking management
- **Search & Filter**: Find events by category, date, or keyword search
- **Responsive Design**: Beautiful, mobile-first UI that works on all devices
- **User Dashboard**: Personalized dashboard with event and booking statistics
- **Admin Capabilities**: First registered user automatically becomes admin

### 🎨 UI/UX Features
- Modern gradient and glass morphism design
- Smooth animations and transitions
- Interactive hover effects
- Loading states and error handling
- Toast notifications for user feedback
- Mobile-responsive navigation

### 🛡️ Security Features
- Password hashing with bcrypt
- JWT-based authentication
- Protected API endpoints
- File upload validation
- CORS protection
- Input sanitization

## 🚀 Tech Stack

### Frontend
- **React 18** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Axios** - HTTP Client
- **React Hot Toast** - Notifications
- **React Icons** - Icon Library
- **date-fns** - Date Formatting

### Backend
- **Flask** - Web Framework
- **Flask-SQLAlchemy** - ORM
- **Flask-CORS** - Cross-Origin Support
- **Flask-Bcrypt** - Password Hashing
- **Flask-JWT-Extended** - JWT Authentication
- **Pillow** - Image Processing

### Database
- **SQLite** - Development Database
- **SQLAlchemy** - Database ORM

## 📸 Screenshots

### Home Page
![Home Page](https://via.placeholder.com/800x400/6366f1/ffffff?text=Home+Page)

### Events Page
![Events Page](https://via.placeholder.com/800x400/8b5cf6/ffffff?text=Events+Page)

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/ec4899/ffffff?text=Dashboard)

### Create Event
![Create Event](https://via.placeholder.com/800x400/f59e0b/ffffff?text=Create+Event)

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Node.js 16+** ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional, for cloning)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/event-booking-platform.git
cd event-booking-platform
```

### 2. Backend Setup

#### Navigate to the backend directory:
```bash
cd backend
```

#### Create and activate a virtual environment:

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### Install Python dependencies:
```bash
pip install -r requirements.txt
```

#### Set up environment variables:
Create a `.env` file in the backend directory:
```bash
# Windows
echo SECRET_KEY=your-super-secret-key-change-this > .env
echo JWT_SECRET_KEY=your-jwt-secret-key-change-this >> .env

# macOS/Linux
cat > .env << EOL
SECRET_KEY=your-super-secret-key-change-this
JWT_SECRET_KEY=your-jwt-secret-key-change-this
EOL
```

> ⚠️ **Important**: Change the secret keys in production! Use strong, random strings.

#### Initialize the database and create admin user:
```bash
python check_db.py
```

This will:
- Create the SQLite database
- Set up all tables
- Create a default admin user

#### Start the Flask server:
```bash
python app.py
```

The backend will be running at: **http://localhost:5000**

### 3. Frontend Setup

#### Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

#### Install Node.js dependencies:
```bash
npm install
```

#### Start the development server:
```bash
npm run dev
```

The frontend will be running at: **http://localhost:5173**

### 4. Access the Application

Open your browser and go to: **http://localhost:5173**

## 👤 Creating an Admin User

### Method 1: Automatic (First User)
The first user to register automatically becomes an admin. Simply:
1. Go to http://localhost:5173/register
2. Create an account with any email and password
3. This user will have admin privileges

### Method 2: Using the Setup Script
```bash
cd backend
python check_db.py
```
This creates a default admin user:
- **Email**: admin@example.com
- **Password**: admin123

### Method 3: Manual Database Update
```bash
cd backend
python
>>> from app import app, db, User
>>> with app.app_context():
...     user = User.query.filter_by(email='your-email@example.com').first()
...     user.is_admin = True
...     db.session.commit()
...     print(f"User {user.name} is now admin")
```

## 📊 Database Structure

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary Key |
| name | String(100) | User's full name |
| email | String(120) | User's email (unique) |
| password | String(255) | Hashed password |
| is_admin | Boolean | Admin status |
| created_at | DateTime | Account creation date |

### Events Table
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary Key |
| title | String(200) | Event title |
| description | Text | Event description |
| date | DateTime | Event date and time |
| location | String(200) | Event location |
| price | Float | Ticket price |
| capacity | Integer | Maximum attendees |
| category | String(50) | Event category |
| image_url | String(500) | Event image path |
| organizer_id | Integer | Foreign Key (Users) |
| created_at | DateTime | Creation date |

### Bookings Table
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary Key |
| user_id | Integer | Foreign Key (Users) |
| event_id | Integer | Foreign Key (Events) |
| quantity | Integer | Number of tickets |
| total_amount | Float | Total price |
| status | String(20) | Booking status |
| created_at | DateTime | Booking date |

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Event Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/events` | Get all events | No |
| GET | `/api/events/:id` | Get single event | No |
| GET | `/api/my-events` | Get user's events | Yes |
| POST | `/api/events` | Create event | Yes |
| PUT | `/api/events/:id` | Update event | Yes |
| DELETE | `/api/events/:id` | Delete event | Yes |

### Booking Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/bookings` | Create booking | Yes |
| GET | `/api/bookings` | Get user's bookings | Yes |

### Example API Request

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Create an event (requires token)
curl -X POST http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Summer Music Festival",
    "description": "A fantastic music festival",
    "date": "2026-07-15T18:00:00",
    "location": "Central Park, NYC",
    "price": "25.00",
    "capacity": "500",
    "category": "Music"
  }'
```

## 🎨 Project Structure

```
event-booking-platform/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── models.py              # Database models
│   ├── check_db.py            # Database initialization
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables
│   └── uploads/              # Uploaded images
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/          # React context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   ├── EditEvent.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateEvent.jsx
│   │   │   └── MyBookings.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
SECRET_KEY=your-super-secret-key-change-this
JWT_SECRET_KEY=your-jwt-secret-key-change-this
DATABASE_URL=sqlite:///events.db
```

### Frontend Configuration

The frontend proxy is configured in `vite.config.js` to forward API requests to the backend:

```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    }
  }
}
```

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Backend won't start
```bash
# Check if port 5000 is in use
# Windows
netstat -ano | findstr :5000
# macOS/Linux
lsof -i :5000

# Make sure virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

#### Database errors
```bash
# Delete and recreate the database
cd backend
rm events.db  # macOS/Linux
del events.db # Windows
python check_db.py
```

#### CORS errors
- Ensure the backend is running on port 5000
- Check that the frontend is running on port 5173
- Clear browser cache and cookies

#### Login not working
- Run `python check_db.py` to ensure users exist
- Try the default admin credentials
- Check browser console for error messages

## 🚀 Deployment

### Backend Deployment (Example with Render/Heroku)

1. Add a `Procfile`:
```
web: gunicorn app:app
```

2. Add production dependencies:
```bash
pip install gunicorn
```

3. Update `requirements.txt`:
```bash
pip freeze > requirements.txt
```

### Frontend Deployment (Example with Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to your hosting provider

3. Update the API base URL in `AuthContext.jsx` to point to your deployed backend

## 📝 Development Notes

### Adding New Features

1. **Backend**: Add new routes in `app.py` and models in `models.py`
2. **Frontend**: Create new components in `src/components` or pages in `src/pages`
3. **Database**: Update models and run `python check_db.py` to recreate tables

### Testing

```bash
# Test backend endpoints
python test_create_event.py

# Check database status
python check_db.py
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Real3dn**

- GitHub: [@Real3dn](https://github.com/Real3dn)

## 🙏 Acknowledgments

- [Flask](https://flask.palletsprojects.com/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- All the amazing open-source libraries used in this project

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

