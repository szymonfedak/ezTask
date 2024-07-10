const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const router = express.Router();
router.use(express.json());

// Validate environment variables
const requiredEnv = ['HOST', 'DATABASE', 'USER', 'PASSWORD'];
requiredEnv.forEach(env => {
    if (!process.env[env]) {
        console.error(`Environment variable ${env} is missing`);
        process.exit(1);
    }
});

const pool = mysql.createPool({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
});

// To register a user
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ message: "Must have a username and password", data: null });
    }

    try {
        // Check if the username already exists
        pool.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).send({ message: "Failed to register", data: null });
            }

            if (results.length > 0) {
                // Username already exists
                return res.status(409).send({ message: "Username already exists", data: null });
            }

            // If username does not exist, proceed with registration
            const hashedPassword = await bcrypt.hash(password, 10);

            pool.query(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                [username, hashedPassword],
                (err, result) => {
                    if (err) {
                        console.error("Database error:", err);
                        return res.status(500).send({ message: "Failed to register", data: null });
                    }

                    const id = result.insertId;
                    res.status(201).send({ message: "User registered successfully", data: { id, username } });
                }
            );
        });
    } catch (err) {
        console.error("Hashing error:", err);
        res.status(500).send({ message: "Failed to register", data: null });
    }
});

//To login a user
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check to see if the user input has both a username and password
    if (!username || !password) {
        return res.status(400).send({ message: "Must have a username and password", data: null });
    }

    // Select a username from the users table 
    pool.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).send({ message: "Failed to login", data: null });
            }

            // Check to see if user exists
            if (results.length === 0) {
                return res.status(401).send({ message: "Invalid username or password", data: null });
            }

            const storedHashedPassword = results[0].password;

            try {
                // Match the password with the hashed password from the database
                const isMatch = await bcrypt.compare(password, storedHashedPassword);

                if (isMatch) {
                    return res.status(200).send({
                        message: "Login successful",
                        data: { id: results[0].id, username: results[0].username }
                    });
                } else {
                    return res.status(401).send({ message: "Invalid username or password", data: null });
                }
            } catch (err) {
                console.error("Error comparing passwords:", err);
                return res.status(500).send({ message: "Failed to login", data: null });
            }
        }
    );
});

//To logout a user
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send({ message: 'Failed to logout', data: null });
        }
        res.status(200).send({ message: 'Logout successful' });
    });
});

//To create task
router.post("/create", (req, res) => {
    const { user_id, title, description, priority, date, type } = req.body;

    console.log("Received task data:", { user_id, title, description, priority, date, type });

    // Checking for missing fields
    if (!user_id || !title || !type) {
        console.error("Missing required fields:", { user_id, title, type });
        return res.status(400).send({ message: "Must have a user_id, Title, and Type", data: null });
    }
    // Checking if user id is a number
    if (isNaN(user_id)) {
        console.error("Invalid user_id:", user_id);
        return res.status(400).send({ message: "Invalid user_id", data: null });
    }

    // Inserting the new task into the tasks table
    pool.query(
        "INSERT INTO tasks (user_id, title, description, priority, date, type) VALUES (?, ?, ?, ?, ?, ?)",
        [user_id, title, description, priority, date, type],
        (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).send({ message: "Failed to create a task", data: null });
            }

            const taskId = result.insertId;
            return res.status(201).send({ message: "Task created successfully", data: { taskId, user_id, title, description, priority, date, type } });
        }
    );
});


//To update a task
router.put("/tasks/:taskId", (req, res) => {
    const taskId = req.params.taskId;
    const { user_id, title, description, priority, date, type } = req.body;

    pool.query(
        "UPDATE tasks SET title =?, description =?, priority =?, date=?, type=? WHERE id =?",
        [title, description, priority, date, type, taskId],
        (err, result) => {
            if (err) {
                return res.status(500).send({ message: "Failed to update the task", data: null })
            }

            return res.status(200).send({ message: "Task updated succesfully", date: { taskId, title, description, priority, date, type } })
        }

    );
});


//To delete a task
router.delete("/tasks/:taskId", (req, res) => {
    const taskId = req.params.taskId;

    pool.query(
        "DELETE FROM tasks WHERE id = ?",
        [taskId],
        (err, result) => {
            if (err) {
                return res.status(500).send({ message: "Failed to remove the task", data: null })
            }

            return res.status(200).send({ message: "Task removed succesfully", data: { taskId } })
        }
    );
});


//To get all the tasks for a user
router.get("/tasks/:user_id", (req, res) => {
    const user_id = req.params.user_id;

    //Check if the user exists
    pool.query(
        "SELECT * FROM users WHERE id = ?",
        [user_id],
        (err, UserResults) => {
            if (err) {
                return res.status(500).send({ message: "Failed to retrive user", data: null })
            }

            if (UserResults.length === 0) {
                return res.status(404).send({ message: "User not found", data: null })
            }

            //If user exists, retrive the tasks
            pool.query(
                "SELECT * FROM tasks WHERE user_id = ?",
                [user_id],
                (err, TaskResults) => {
                    if (err) {
                        return res.status(500).send({ message: "Failed to retrive tasks", data: null })
                    }

                    if (TaskResults.length === 0) {
                        return res.status(404).send({ message: "There are no tasks to retrive", data: null })
                    }


                    return res.status(200).send({ message: "Tasks retrived succesfully", data: TaskResults })
                });
        });
});


// To create a Team
router.post("/teams", (req, res) => {
    const { name, members, userId } = req.body;

    if (!name) {
        return res.status(400).send({ message: "Must have a Team name", data: null });
    }

    // Checking if a team with the same name already exists
    pool.query("SELECT * FROM teams WHERE name = ?", 
        [name], 
        (err, results) => {
        if (err) {
            return res.status(500).send({ message: "Database error while checking team name", data: null });
        }

        if (results.length > 0) {
            return res.status(400).send({ message: "Team name already exists", data: null });
        }

        // Inserts a new team into the teams table
        pool.query(
            "INSERT INTO teams (name, created_by) VALUES (?, ?)", [name, userId], (err, result) => {
                if (err) {
                    return res.status(500).send({ message: "Failed to create the team", data: null });
                }

                const teamId = result.insertId;

                if (!members || members.length === 0) {
                    return res.status(201).send({ message: "Team created successfully", data: { teamId, name } });
                }

                // Preparing and inserting members and their data into the team_members table
                const memberData = members.map(member => [teamId, member.user_id, member.role]);
                pool.query(
                    "INSERT INTO team_members (team_id, user_id, role) VALUES ?",
                    [memberData],
                    (err, result) => {
                        if (err) {
                            return res.status(500).send({ message: "Failed to add team members", data: null });
                        }
                        return res.status(201).send({ message: "Team created successfully with members", data: { teamId, name, members } });
                    }
                );
            }
        );
    });
});

module.exports = router;

// To retrieve teams for a specific user
router.get("/teams/:userId", (req, res) => {
    const userId = req.params.userId;

    // Fetch team details + members
    pool.query(
        `SELECT teams.id as team_id, teams.name as team_name, users.id as user_id, users.username
         FROM teams
         JOIN team_members ON teams.id = team_members.team_id
         JOIN users ON team_members.user_id = users.id
         WHERE teams.id IN (SELECT team_id FROM team_members WHERE user_id = ?)`,
        [userId],
        (err, results) => {
            if (err) {
                return res.status(500).send({ message: "Database error while retrieving teams", data: null });
            }

            // Group the results by team id
            const teams = {};
            results.forEach(row => {
                // Add team id if its not already a key in the teams object
                if (!teams[row.team_id]) {
                    teams[row.team_id] = {
                        id: row.team_id,
                        name: row.team_name,
                        members: []
                    };
                }
                // Push the member details into the members array 
                teams[row.team_id].members.push({
                    user_id: row.user_id,
                    username: row.username
                });
            });

            return res.status(200).send({ message: "Teams retrieved successfully", data: Object.values(teams) });
        }
    );
});

//To remove a team
router.delete("/teams/:teamId", (req, res) => {
    const teamId = req.params.teamId;

    // Delete all team memebers first
    pool.query(
        "DELETE FROM team_members WHERE team_id = ?",
        [teamId],
        (err, result) => {
            if (err) {
                return res.status(500).send({ message: "Failed to remove team members", data: null });
            }

            // Delete the team once no members are left
            pool.query(
                "DELETE FROM teams WHERE id = ?",
                [teamId],
                (err, result) => {
                    if (err) {
                        return res.status(500).send({ message: "Failed to remove team", data: null });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).send({ message: "Team not found", data: null });
                    }

                    return res.status(200).send({ message: "Team and members removed successfully", data: { teamId } });
                }
            );
        }
    );
});

//To edit a team
router.put("/teams/:teamId", (req, res) => {
    const teamId = req.params.teamId;
    const userId = req.body.userId;
    const { name } = req.body;

    if (!name) {
        return res.status(400).send({ message: "Team name is required", data: null });
    }

    // Check if the user is the one who created the team
    pool.query(
        "SELECT created_by FROM teams WHERE id = ?",
        [teamId],
        (err, results) => {
            if (err) {
                return res.status(500).send({ message: "Failed to check team ownership", data: null });
            }

            if (results.length === 0) {
                return res.status(404).send({ message: "Team not found", data: null });
            }

            const team = results[0];
            if (team.created_by !== userId) {
                return res.status(403).send({ message: "You do not have permission to edit this team", data: null });
            }

            // If user is the one who crated the team then allow to edit
            pool.query(
                "UPDATE teams SET name = ? WHERE id = ?",
                [name, teamId],
                (err, result) => {
                    if (err) {
                        return res.status(500).send({ message: "Failed to edit team", data: null });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).send({ message: "Team not found", data: null });
                    }

                    return res.status(200).send({ message: "Team has been edited successfully", data: { name, teamId } });
                }
            );
        }
    );
});

// To remove a team member from a team + check if the team has any members if not remove the team
router.delete("/teams/:teamId/members/:userId", (req, res) => {
    const teamId = req.params.teamId;
    const userId = req.params.userId;

    // Deleting a team member
    pool.query(
        "DELETE FROM team_members WHERE team_id = ? AND user_id = ?",
        [teamId, userId],
        (err, result) => {
            if (err) {
                return res.status(500).send({ message: "Failed to remove team member", data: null });
            }

            if (result.affectedRows === 0) {
                return res.status(404).send({ message: "Team member not found", data: null });
            }

            // After deleting a team member, check if there are any members left in the team
            pool.query(
                "SELECT COUNT(*) as memberCount FROM team_members WHERE team_id = ?",
                [teamId],
                (err, countResult) => {
                    if (err) {
                        return res.status(500).send({ message: "Failed to check team members", data: null });
                    }

                    const memberCount = countResult[0].memberCount;

                    // If no members left, delete the team
                    if (memberCount === 0) {
                        pool.query(
                            "DELETE FROM teams WHERE id = ?",
                            [teamId],
                            (err, deleteResult) => {
                                if (err) {
                                    return res.status(500).send({ message: "Failed to remove team", data: null });
                                }

                                return res.status(200).send({ message: "Team member removed and team deleted successfully", data: { teamId, userId } });
                            }
                        );
                    } else {
                        return res.status(200).send({ message: "Team member removed successfully", data: { teamId, userId } });
                    }
                }
            );
        }
    );
});

// To create a task for a team
router.post("/teams/:teamId/tasks", (req, res) => {
    const teamId = req.params.teamId;
    const { title, description, priority, date, type } = req.body;

    if (!title || !type) {
        return res.status(400).send({ message: "Title and type are required.", data: null });
    }

    pool.query(
        "INSERT INTO tasks (team_id, title, description, priority, date, type) VALUES (?, ?, ?, ?, ?, ?)",
        [teamId, title, description, priority, date, type],
        (err, result) => {
            if (err) {
                console.error("Error creating task:", err); 
                return res.status(500).send({ message: "Failed to create a task for the team", data: null });
            }

            const taskId = result.insertId;
            return res.status(201).send({ message: "Task created successfully", data: { taskId, teamId, title, description, priority, date, type } });
        }
    );
});

// To retrieve tasks for the team
router.get("/teams/:teamId/tasks", (req, res) => {
    const teamId = req.params.teamId;

    pool.query(
        "SELECT * FROM tasks WHERE team_id = ?",
        [teamId],
        (err, results) => {
            if (err) {
                return res.status(500).send({ message: "Failed to retrieve tasks", data: null });
            }

            if (results.length === 0) {
                return res.status(404).send({ message: "No tasks found for this team", data: null });
            }

            return res.status(200).send({ message: "Tasks retrieved successfully", data: results });
        }
    );
});


module.exports = router;