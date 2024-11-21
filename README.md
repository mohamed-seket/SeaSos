SEASOS: Maritime Police Web Application
SEASOS is a web application designed to assist the maritime police in Tunisia. It provides a comprehensive dashboard to visualize statistics, monitor emergency cases, and efficiently manage patrols in real-time.

Features
Dashboard:
The dashboard allows administrators to visualize key statistics, such as:

Number of emergencies reported
Performance of patrols
Locations with the highest number of cases
Real-time Case Monitoring:
Admins can view new cases sent by the help application in real-time, allowing for immediate action.

Case Assignment:
Admins can assign new cases to suitable patrols based on availability and the nature of the emergency.

Patrol Management:
Admins have access to a database of boats and can track the status of each patrol (e.g., en mission or on standby).

Tech Stack
Frontend:
React.js: For building the user interface and providing a responsive, dynamic dashboard.
Backend:
Node.js: The runtime environment for executing JavaScript on the server.
Express.js: A minimal web framework for routing and handling HTTP requests.
MongoDB: A NoSQL database used to store data related to boats, patrols, and cases.
Real-Time Communication:
WebSockets: To enable real-time updates for the cases, patrol assignments, and other important events.
Installation
Prerequisites
Node.js and npm installed on your machine.
MongoDB instance running (either locally or remotely).
Steps to Set Up the Project:
1.Clone the repository:
git clone https://github.com/mohamed-seket/SeaSos.git
cd SEASOS
2.Install dependencies for both the frontend and backend:

For the backend:
cd backend
npm install

For the frontend:
cd frontend
npm install

3.Start the backend server:
cd backend
npm start 

4.Start the frontend development server:
cd frontend
npm start

Usage
Login:
The admin can log into the system and access the dashboard.

View Statistics:
The dashboard shows the real-time statistics of emergency cases, patrol performance, and high-risk locations.

Assign Cases:
Admins can assign cases to patrols, ensuring a timely response.

Manage Patrols:
The admin can view the status of each patrol (on mission or standby) and manage boats accordingly.


