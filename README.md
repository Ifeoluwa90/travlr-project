# Travlr Getaways - Full Stack Web Application

A comprehensive travel booking platform built with modern web technologies, featuring both customer-facing and administrative interfaces.

## Project Overview

Travlr Getaways is a full-stack web application that serves as a travel booking platform for diving and reef exploration trips. The project demonstrates the integration of multiple frontend technologies with a robust backend API, secure authentication, and database management.

## Architecture

### Frontend Development Technologies

This project implements three distinct frontend approaches, each serving different purposes and user experiences:

#### 1. Static HTML/CSS Website (`public/`)
- **Purpose**: Customer-facing marketing website
- **Technology**: Vanilla HTML, CSS, and minimal JavaScript
- **Features**: 
  - Static pages for home, travel, rooms, meals, news, about, and contact
  - Responsive design with custom CSS styling
  - Image galleries and informational content
- **Benefits**: Fast loading, SEO-friendly, easy to maintain for content updates

#### 2. Express Server-Side Rendered Views (`app_server/`)
- **Purpose**: Dynamic travel package listings with server-side rendering
- **Technology**: Express.js with Handlebars templating engine
- **Features**:
  - Dynamic content rendering from MongoDB database
  - Handlebars helpers for date formatting, price display, and text truncation
  - Server-side data processing and template compilation
- **Benefits**: SEO optimization, faster initial page loads, reduced client-side processing

#### 3. Angular Single-Page Application (`admin-app/`)
- **Purpose**: Administrative interface for trip management
- **Technology**: Angular 20 with TypeScript
- **Features**:
  - Real-time CRUD operations for trip management
  - Form validation and reactive forms
  - Component-based architecture with reusable UI elements
  - Client-side routing and navigation
  - JWT-based authentication system
- **Benefits**: Rich user interactions, offline capabilities, reduced server requests, modern UX patterns

### Backend - NoSQL MongoDB Database

#### Why MongoDB was chosen:

1. **Flexible Schema Design**: Travel data varies significantly (different trip types, amenities, pricing structures). MongoDB's document-based structure accommodates evolving data requirements without rigid schema constraints.

2. **JSON-Native Storage**: Travel data (trip details, user profiles, booking information) naturally maps to JSON documents, eliminating object-relational impedance mismatch.

3. **Scalability**: MongoDB's horizontal scaling capabilities support growth from local business to global travel platform.

4. **Rich Query Capabilities**: Complex queries for filtering trips by date ranges, prices, locations, and amenities are efficiently handled.

5. **Developer Productivity**: Direct JavaScript object manipulation reduces development complexity compared to SQL databases.

## Functionality

### JSON's Role in Full Stack Integration

JSON (JavaScript Object Notation) serves as the crucial data interchange format that bridges frontend and backend development:

#### Differences between JSON and JavaScript:
- **JSON**: A text-based data interchange format that is language-independent
- **JavaScript**: A programming language with rich object manipulation capabilities
- **Key Distinction**: JSON is purely data representation, while JavaScript objects include methods and behavior

#### JSON Integration Points:

1. **API Communication** (`app_api/controllers/trips.js:41`, `admin-app/src/app/services/trip-data.service.ts:27`):
   ```javascript
   // Backend response
   res.status(200).json(trips);
   
   // Frontend consumption
   this.http.get<Trip[]>(this.tripsUrl)
   ```

2. **Database Operations** (`app_api/models/trips.js:4`):
   ```javascript
   // MongoDB documents stored as JSON-like BSON
   const tripSchema = new mongoose.Schema({
     code: String,
     name: String,
     // ... other fields
   });
   ```

3. **Configuration Management** (`data/trips.json:1`):
   ```json
   // Seed data for initial trip population
   [
     {
       "code": "GALR01",
       "name": "Gale Reef",
       "length": "4 days"
     }
   ]
   ```

### Code Refactoring and UI Component Benefits

#### Major Refactoring Instances:

1. **Trip Data Service Refactoring** (`admin-app/src/app/services/trip-data.service.ts:23`):
   - **Original**: Hardcoded API endpoints and error handling
   - **Refactored**: Centralized HTTP configuration, retry mechanisms, and standardized error handling
   - **Benefits**: Reduced code duplication, improved error consistency, easier maintenance

2. **Component Architecture Evolution** (`admin-app/src/app/trip-card/trip-card.component.ts:10`):
   - **Original**: Monolithic trip display logic
   - **Refactored**: Reusable trip-card component with input/output decorators
   - **Benefits**: 
     - **Reusability**: Same component used in list and detail views
     - **Maintainability**: Centralized trip display logic
     - **Testing**: Isolated component testing
     - **Consistency**: Uniform trip presentation across application

3. **Form Validation Refactoring** (`admin-app/src/app/trip-form/trip-form.component.ts:36`):
   - **Original**: Template-driven validation scattered across templates
   - **Refactored**: Reactive forms with centralized validation rules
   - **Benefits**: Better error handling, reusable validators, improved UX

#### Reusable UI Components Benefits:

1. **TripCardComponent** (`admin-app/src/app/trip-card/`):
   - Consistent trip display across all views
   - Centralized formatting logic for dates and prices
   - Reusable event handling for edit/delete operations

2. **TripFormComponent** (`admin-app/src/app/trip-form/`):
   - Single component for both create and edit operations
   - Consistent validation rules and error messaging
   - Reduced development time for new forms

## Testing

### API Testing Methodology

#### Endpoint Testing Structure:

1. **CRUD Operations Testing** (`app_api/controllers/trips.js`):
   - **GET /api/trips**: List all trips with proper error handling
   - **GET /api/trips/:tripCode**: Retrieve specific trip with validation
   - **POST /api/trips**: Create new trip with comprehensive validation
   - **PUT /api/trips/:tripCode**: Update existing trip with partial updates
   - **DELETE /api/trips/:tripCode**: Remove trip with confirmation

2. **Request/Response Validation**:
   ```javascript
   // Input validation example (app_api/controllers/trips.js:98)
   const requiredFields = ['code', 'name', 'length', 'start', 'resort', 'perPerson', 'image', 'description'];
   const missingFields = requiredFields.filter(field => !req.body[field]);
   ```

3. **Error Handling Standards**:
   - **400**: Bad Request (validation errors, missing fields)
   - **401**: Unauthorized (authentication failures)
   - **404**: Not Found (resource doesn't exist)
   - **409**: Conflict (duplicate resources)
   - **500**: Internal Server Error (database/system errors)

#### Security Testing Considerations:

1. **JWT Authentication** (`app_api/config/passport.js:29`):
   - Token-based stateless authentication
   - Secure password hashing with bcrypt
   - Token expiration validation
   - Protected route middleware

2. **CORS Configuration** (`app.js:14`):
   - Restricted origin policies for API access
   - Preflight request handling
   - Secure header configurations

3. **Input Validation and Sanitization**:
   - MongoDB injection prevention through Mongoose validation
   - Required field validation
   - Data type and format validation
   - Trim operations for string inputs

#### Testing Challenges with Security Layers:

1. **Authentication Testing**:
   - Token generation and validation testing
   - Expired token handling
   - Invalid token rejection
   - Route protection verification

2. **Authorization Testing**:
   - Role-based access control (admin vs. user)
   - Resource ownership validation
   - Proper error responses for unauthorized access

3. **Integration Testing Complexity**:
   - End-to-end authentication flows
   - Cross-origin request testing
   - Token persistence and refresh mechanisms

## Reflection

### Professional Development Impact

This course has significantly advanced my capabilities as a full-stack developer and enhanced my marketability in several key areas:

#### Technical Skills Mastered:

1. **Modern JavaScript Ecosystem**:
   - **Frontend**: Advanced Angular development with TypeScript, reactive programming with RxJS, and modern component architecture
   - **Backend**: Node.js with Express.js, asynchronous programming patterns, and RESTful API design
   - **Database**: MongoDB integration with Mongoose ODM, schema design, and query optimization

2. **Full-Stack Integration**:
   - Seamless communication between frontend and backend through RESTful APIs
   - JSON data modeling and transformation across system boundaries
   - Real-time data synchronization and state management

3. **Security Implementation**:
   - JWT-based authentication systems
   - Secure password handling with bcrypt
   - CORS configuration and API security best practices
   - Input validation and sanitization techniques

#### Professional Growth Areas:

1. **Architecture Decision Making**:
   - Understanding when to use different frontend approaches (static, SSR, SPA)
   - Database technology selection based on project requirements
   - Balancing performance, maintainability, and user experience

2. **Development Workflow Mastery**:
   - Component-driven development methodology
   - Code refactoring for maintainability and reusability
   - Error handling and debugging across the full stack
   - Version control and collaborative development practices

3. **Industry-Relevant Skills**:
   - **Angular**: One of the most in-demand frontend frameworks in enterprise development
   - **Node.js/Express**: Essential backend technologies for JavaScript developers
   - **MongoDB**: Leading NoSQL database technology
   - **RESTful API Design**: Fundamental skill for modern web development
   - **Authentication/Security**: Critical knowledge for any web application

#### Career Enhancement:

This comprehensive full-stack experience positions me as a versatile developer capable of:
- Leading end-to-end project development
- Making informed technology choices for different project requirements
- Implementing secure, scalable web applications
- Collaborating effectively across frontend and backend teams
- Adapting to new technologies built on similar architectural principles

The project demonstrates proficiency in modern web development patterns, security best practices, and the ability to deliver production-ready applications—skills that are highly valued in today's competitive job market.

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript, Angular 20, TypeScript, Bootstrap
- **Backend**: Node.js, Express.js, Handlebars
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens), Passport.js
- **Security**: bcrypt for password hashing
- **Development Tools**: Angular CLI, npm, Git

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd travlr-project
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install Angular app dependencies:
   ```bash
   cd admin-app
   npm install
   cd ..
   ```

4. Start MongoDB service (if running locally)

5. Seed the database:
   ```bash
   node app_api/database/seed.js
   node app_api/database/seed-users.js
   ```

6. Start the Express server:
   ```bash
   node app.js
   ```

7. Start the Angular development server (in a new terminal):
   ```bash
   cd admin-app
   ng serve
   ```

### Access Points

- **Static Website**: http://localhost:3000
- **Dynamic Travel Page**: http://localhost:3000/travel  
- **Admin Panel**: http://localhost:4200
- **API Endpoints**: http://localhost:3000/api/trips

## Project Structure

```
travlr-project/
├── admin-app/                 # Angular SPA for administration
│   ├── src/app/
│   │   ├── components/        # Reusable UI components
│   │   ├── services/          # Data and authentication services
│   │   ├── guards/            # Route protection
│   │   └── models/            # TypeScript interfaces
├── app_api/                   # Backend API
│   ├── controllers/           # Request handlers
│   ├── models/               # Database schemas
│   ├── routes/               # API routing
│   └── config/               # Authentication configuration
├── app_server/               # Server-side rendered views
│   ├── controllers/          # View controllers
│   ├── routes/              # Website routing
│   └── views/               # Handlebars templates
├── public/                   # Static website files
│   ├── css/                 # Stylesheets
│   ├── images/              # Image assets
│   └── js/                  # Client-side scripts
├── data/                    # Seed data
└── app.js                   # Main application entry point
```

## License

This project is licensed under the SNHU.
