**<h1>ezTask</h1>**

EzTask is a task management application designed to help users organize their tasks and collaborate with team members. It provides features for creating personal tasks, managing team tasks, and assigning roles within teams.

**<h3>Features</h3>**

- User Tasks: Users can create, edit, and delete their personal tasks.
- Team Tasks: Users can create and manage tasks within teams.
- Role Assignment: Assign roles to team members when creating a team.
- Task Prioritization: Tasks can be prioritized as High, Medium, or Low.
- Task Completion: Mark tasks as complete.
- Team Management: Create, edit, and delete teams.

**<h3>DEMO</h3>**

![2024-07-1015-05-07-ezgif com-video-to-gif-converter](https://github.com/szymonfedak/ezTask/assets/131200019/a8dfa0f5-061e-4025-a61c-05c9dc2481a4)

![2024-07-1015-06-27-ezgif com-video-to-gif-converter](https://github.com/szymonfedak/ezTask/assets/131200019/7c01d752-96a1-45df-8e50-ac871ecfcf72)

**<h3>Technologies Used</h3>**
- Backend: Node.js, Express.js
- Frontend: HTML, CSS, JavaScript
- Database: MySQL
- Notifications: Toastr for notifications

**<h3>Installation</h3>**

**<h4>Steps</h4>**
1. Clone the repository
```sh
git clone https://github.com/your-username/ezTask.git
```
2. Install dependencies
```sh
npm install
```
3. Setup environment variables
```sh
DB_HOST=your-database-host
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
```
4. Setup the database
```sh
mysql -u your-database-username -p your-database-name < path/to/sqlfile.sql
```
5. Start the server
```sh
npm start
```
6. Access the application
```sh
Open your browser and navigate to http://localhost:5500.
```

**<h3>USAGE</h3>**

**Creating a User Task**
1. Click on the "New Task" button.
2. Fill in the task details and submit the form.

**Edit User Tasks**
1. Click on the "Edit Task" button.
2. Fill in the task details and submit the form.

**Creating a Team**
1. Click on the "New Team" button.
2. Fill in the team details and assign roles to members using their usernames.

**Creating a Team Task**
1. Click on the "New Team Task" button.
2. Fill in the team task details and submit the form.

**Edit Team Tasks**
1. Click on the "Edit Team Task" button.
2. Fill in the task details and submit the form.

**Viewing and Managing Tasks**
1. Click on a team to view its tasks.
2. Use the options to edit or delete tasks as needed.

**Priorty Tasks**
1. Click on the "To Do" button.
2. A list of the user tasks will display.

