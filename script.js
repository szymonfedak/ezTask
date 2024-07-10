document.addEventListener('DOMContentLoaded', () => {
    const user_id = localStorage.getItem('user_id');
    const username = localStorage.getItem('username');

    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const removeTaskBtn = document.getElementById('removeTaskBtn');
    const editTaskBtn = document.getElementById('editTaskBtn');
    const editTaskListModal = document.getElementById('editTaskListModal');
    const removeTaskModal = document.getElementById('removeTaskModal');
    const removeTaskList = document.getElementById('removeTaskList');
    const userStatus = documentt.getElementById('userStatus');
    const taskContainer = document.getElementById('task-container');
    const editTaskList = document.getElementById('editTaskList');
    const editTaskModal = document.getElementById('editTaskModal');
    const editTaskForm = document.getElementById('editTaskForm');
    const toDoBtn = document.getElementById('ToDoBtn');
    const orderListToDo = document.getElementById('orderListToDo');
    const newTeamBtn = document.getElementById('newTeamBtn');
    const newTeamModal = document.getElementById('newTeamModal');
    const newTeamForm = document.getElementById('newTeamForm');
    const removeTeamModal = document.getElementById('removeTeamModal');
    const removeTeamList = document.getElementById('removeTeamList');
    const removeTeamBtn = document.getElementById('removeTeamBtn');
    const editTeamBtn = document.getElementById('editTeamBtn');
    const editTeamModal = document.getElementById('editTeamModal');
    const editTeamForm = document.getElementById('editTeamForm');
    const editTeamListModal = document.getElementById('editTeamListModal')
    const teamMembersList = document.getElementById('teamMembersList');
    const showTeamBtn = document.getElementById('showTeamBtn');
    const showTeamList = document.getElementById('showTeamList');
    const dropBtnTask = document.getElementById('dropBtnTask');
    const dropBtnTeam = document.getElementById('dropBtnTeam');
    const dropBtnLogin = document.getElementById('dropBtnLogin');
    const ToDoModal = document.getElementById('ToDoModal');
    const newTeamTaskBtn = document.getElementById('newTeamTaskBtn');
    const editTeamTaskBtn = document.getElementById('editTeamTaskBtn');
    const removeTeamTaskBtn = document.getElementById('removeTeamTaskBtn');
    const teamTaskForm = document.getElementById('teamTaskForm');
    const teamTaskModal = document.getElementById('teamTaskModal');
    const backToUserTasksBtn = document.getElementById('backToUserTasksBtn');
    const removeTeamTaskModal = document.getElementById('removeTeamTaskModal');
    const removeTeamTaskList = document.getElementById('removeTeamTaskList');
    const newTaskLink = document.getElementById('newTask');
    const modal = document.getElementById('taskModal');
    const span = document.getElementsByClassName('close');
    const form = document.getElementById('taskForm');

    const userActionButtons = document.querySelectorAll('.user-action');
    userActionButtons.forEach(button => button.style.display = 'none');

    // Toastr settings
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    // If a user is logged in display buttons/tasks/teams accordingly
    if (user_id && username) {
        userStatus.textContent = `Logged in as ${username}, userid: ${user_id}`;
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        backToUserTasksBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        editTaskBtn.style.display = 'block';
        removeTaskBtn.style.display = 'block';
        toDoBtn.style.display = 'block';
        newTeamBtn.style.display = 'block';
        showTeamBtn.style.display = 'block';
        dropBtnTask.style.display = 'block';
        dropBtnTeam.style.display = 'block';

        userActionButtons.forEach(button => button.style.display = 'block');
        fetchTasks(user_id);
        fetchTeams(user_id);

    } else {
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        editTaskBtn.style.display = 'none';
        removeTaskBtn.style.display = 'none';
        toDoBtn.style.display = 'none';
        newTeamBtn.style.display = 'none';
        showTeamBtn.style.display = 'none';
        dropBtnTask.style.display = 'none';
        dropBtnTeam.style.display = 'none';
        backToUserTasksBtn.style.display = 'none';
    }

    // Remove the buttons accordingly once a user has logged out
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        editTaskBtn.style.display = 'none';
        removeTaskBtn.style.display = 'none';
        toDoBtn.style.display = 'none';
        newTeamBtn.style.display = 'none';
        showTeamBtn.style.display = 'none';
        dropBtnTask.style.display = 'none';
        dropBtnTeam.style.display = 'none';
        userStatus.textContent = '';
        taskContainer.innerHTML = '';
    });

    newTaskLink.addEventListener('click', (event) => {
        event.preventDefault();
        modal.style.display = "block";
    });

    // Closing Modals
    Array.from(span).forEach((element) => {
        element.onclick = function () {
            modal.style.display = "none";
            editTaskModal.style.display = "none";
            editTaskListModal.style.display = "none";
            removeTaskModal.style.display = "none";
            ToDoModal.style.display = 'none';
            newTeamModal.style.display = 'none';
            removeTeamModal.style.display = 'none';
            editTeamModal.style.display = 'none';
            showTeamModal.style.display = 'none';
            editTeamListModal.style.display = 'none';
            teamTaskModal.style.display = 'none';
            // Set the task div zIndex back to 1 once a modal is closed
            document.querySelectorAll('.expandable').forEach(expandableDiv => {
                expandableDiv.style.zIndex = '1';
            });
        }
    });

    // Toggle dropdown visibility
    function toggleDropdown(buttonId) {
        const button = document.getElementById(buttonId);
        const dropdown = button.nextElementSibling;
        const isVisible = dropdown.style.display === 'block';

        document.querySelectorAll('.dropdown-content, .dropdown-content-login').forEach((dropdown) => {
            dropdown.style.display = 'none';
        });

        if (!isVisible) {
            dropdown.style.display = 'block';
        }
    }

    // Close dropdowns if clicking outside
    window.onclick = function (event) {
        if (!event.target.matches('.dropBtn')) {
            document.querySelectorAll('.dropdown-content, .dropdown-content-login').forEach((dropdown) => {
                dropdown.style.display = 'none';
            });
        }

        const modals = [
            modal, editTaskModal, editTaskListModal, removeTaskModal,
            ToDoModal, newTeamModal, removeTeamModal, editTeamModal,
            showTeamModal, editTeamListModal, teamTaskModal
        ];

        modals.forEach(modalElement => {
            if (event.target == modalElement) {
                modalElement.style.display = "none";
                document.querySelectorAll('.expandable').forEach(expandableDiv => {
                    expandableDiv.style.zIndex = '1';
                });
            }
        });
    }

    // Prevent closing when clicking inside the dropdown
    document.querySelectorAll('.dropdown-content, .dropdown-content-login').forEach((dropdown) => {
        dropdown.onclick = function (event) {
            event.stopPropagation();
        };
    });

    // Adding event listeners to buttons to toggle dropdown menus
    document.getElementById('dropBtnTask').addEventListener('click', (event) => {
        event.stopPropagation(); 
        toggleDropdown('dropBtnTask');
    });
    document.getElementById('dropBtnTeam').addEventListener('click', (event) => {
        event.stopPropagation(); 
        toggleDropdown('dropBtnTeam');
    });
    document.getElementById('dropBtnLogin').addEventListener('click', (event) => {
        event.stopPropagation(); 
        toggleDropdown('dropBtnLogin');
    });

    // Close the dropdown when a link inside it is clicked
    document.querySelectorAll('.dropdown-content a, .dropdown-content-login a').forEach((link) => {
        link.addEventListener('click', () => {
            link.closest('.dropdown-content, .dropdown-content-login').style.display = 'none';
        });
    });

    // Modal close buttons
    Array.from(document.getElementsByClassName('close')).forEach((element) => {
        element.onclick = function () {
            element.closest('.modal').style.display = 'none';
            document.querySelectorAll('.expandable').forEach(expandableDiv => {
                expandableDiv.style.zIndex = '1';
            });
        };
    });

    // Form for creating a new task
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);

        const taskData = {
            user_id: user_id,
            team_id: formData.get('team_id'),
            title: formData.get('title'),
            description: formData.get('description'),
            priority: formData.get('priority'),
            date: formData.get('date'),
            type: formData.get('type')
        };

        console.log('Task data to be sent:', taskData);

        try {
            const response = await fetch('http://localhost:5500/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            const text = await response.text();
            console.log('Response Text:', text);

            if (!response.ok) {
                console.error('Server responded with an error:', text);
                throw new Error(text);
            }

            const result = JSON.parse(text);
            console.log('Server response parsed as JSON:', result);

            toastr.success('Task created successfully');
            createTask(result.data);
            modal.style.display = "none";
            form.reset();

        } catch (error) {
            console.error('Error during task creation:', error);
            toastr.error('Failed to create task: ' + error.message);
        }
    });

    // Fetching tasks for the user
    async function fetchTasks(user_id) {
        try {
            const response = await fetch(`http://localhost:5500/tasks/${user_id}`);
            const data = await response.json();

            if (response.ok) {
                console.log('Tasks retrieved successfully:', data.data);
                taskContainer.innerHTML = ''; // Clear any existing tasks

                data.data.forEach(task => {
                    createTask(task);
                });
            } else {
                console.error('Failed to retrieve tasks:', data.message);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    // Creates a task and a div to disaply
    function createTask(taskData) {
        const task = document.createElement('div');
        task.className = 'task expandable';
        task.setAttribute('data-id', taskData.id); 

        const taskHeader = document.createElement('div');
        taskHeader.className = 'expandable-header';
        taskHeader.textContent = taskData.title;

        taskHeader.addEventListener('dblclick', (event) => {
            event.stopPropagation();
            toggleExpand(task);
        });

        // Create the content for the task
        const taskContent = document.createElement('div');
        taskContent.className = 'expandable-content';
        taskContent.innerHTML = `
            <p>${taskData.description}</p>
            <p>Priority: ${taskData.priority}</p>
            <p>Date: ${taskData.date}</p>
            <p>Type: ${taskData.type}</p>
        `;

        // Create a check mark element
        const checkmarkContainer = document.createElement('div');
        checkmarkContainer.innerHTML = `
        <div class="checkbox-wrapper-21">
  <label class="control control--checkbox">
  Complete
    <input type="checkbox" />
    <div class="control__indicator"></div>
  </label>
</div>`;

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'taskDeleteBtn';
        deleteButton.onclick = async () => {
            const taskId = taskData.id;
            try {
                const response = await fetch(`http://localhost:5500/tasks/${taskId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    task.remove();
                    console.log('Task deleted successfully');
                } else {
                    console.error('Failed to delete task');
                }
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        };

        // Create a edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'taskEditBtn';
        editButton.onclick = () => showEditTaskModal(taskData);

        // Append the buttons to the content
        taskContent.appendChild(checkmarkContainer);
        taskContent.appendChild(deleteButton);
        taskContent.appendChild(editButton);

        task.appendChild(taskHeader);
        task.appendChild(taskContent);
        taskContainer.appendChild(task);

        // Add event listener for the checkbox
        const checkbox = checkmarkContainer.querySelector('.control--checkbox input');
        checkbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                console.log('Checkbox is checked');
                deleteTask(taskData.id)
            } else {
                console.log('Checkbox is not checked');
            }
        });

        makeDraggable(task, taskHeader);
    }


    // Expand/collapse the tasks
    function toggleExpand(task) {
        const content = task.querySelector('.expandable-content');
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    }

    function toggleExpand(element) {
        element.classList.toggle('open');
    }

    // Deletes the tasks 
    async function deleteTask(id) {
        try {
            const response = await fetch(`http://localhost:5500/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            console.log('Delete response:', result);

            if (!response.ok) {
                console.error('Server responded with an error:', result.message);
                toastr.error(`Failed to delete task: ${result.message}`);
                return;
            }

            toastr.success('Task deleted successfully');
            document.querySelector(`.task[data-id="${id}"]`).remove();
        } catch (error) {
            console.error('Error deleting task:', error);
            toastr.error('An error occurred while deleting the task. Please try again.');
        }
    }

    // Deletes a member from a team
    async function deleteMember(user_id) {
        try {
            const response = await fetch(`http://localhost:5500/teams/${team_id}/members/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            console.log('Delete response:', result);

            if (!response.ok) {
                console.error('Server responded with an error', result.message);
                toastr.error(`Failed to delete team member: ${result.message}`);
                return;
            }
            toastr.sucess('Team member deleted successfully');
            document.querySelector(`.team[data-id="${id}]`).remove();
        } catch (error) {
            console.error('Error deleting task:', error);
            toastr.error('An error occured while deleting the task. Please try again.');
        }
    }

    // Show the edit task modal 
    function showEditTaskModal(taskData) {
        editTaskForm.elements['id'].value = taskData.id;
        editTaskForm.elements['title'].value = taskData.title;
        editTaskForm.elements['description'].value = taskData.description;
        editTaskForm.elements['priority'].value = taskData.priority;
        editTaskForm.elements['date'].value = taskData.date;
        editTaskForm.elements['type'].value = taskData.type;

        editTaskModal.style.display = 'block';
    }

    // Show the edit task list modal and handle task selection
    editTaskBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://localhost:5500/tasks/${user_id}`);
            const data = await response.json();

            if (response.ok) {
                console.log('Tasks retrieved successfully:', data.data);
                editTaskList.innerHTML = ''; 

                document.querySelectorAll('.expandable').forEach(expandableDiv => {
                    expandableDiv.style.zIndex = '-1';
                });

                data.data.forEach(task => {
                    const taskItem = document.createElement('div');
                    taskItem.className = 'task-item';
                    taskItem.textContent = task.title;
                    taskItem.onclick = () => {
                        showEditTaskModal(task);
                        editTaskListModal.style.display = 'none';
                    };

                    editTaskList.appendChild(taskItem);
                });

                editTaskListModal.style.display = 'block';
            } else {
                console.error('Failed to retrieve tasks:', data.message);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    });

    // Show the remove task modal and handle task removal
    function showRemoveTaskModal(taskData) {
        removeTaskModal.style.display = 'block';

        removeTaskList.innerHTML = '';

        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.textContent = taskData.title;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = async () => {
            await deleteTask(taskData.id);
            removeTaskModal.style.display = 'none';
        };

        taskItem.appendChild(removeButton);
        removeTaskList.appendChild(taskItem);
    }

    // Form for editing a task
    editTaskForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(editTaskForm);

        const taskData = {
            id: formData.get('id'),
            title: formData.get('title'),
            description: formData.get('description'),
            priority: formData.get('priority'),
            date: formData.get('date'),
            type: formData.get('type')
        };

        try {
            const response = await fetch(`http://localhost:5500/tasks/${taskData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            const result = await response.json();
            console.log('Edit response:', result);

            if (!response.ok) {
                console.error('Server responded with an error:', result.message);
                toastr.error(`Failed to edit task: ${result.message}`);
                return;
            }

            toastr.success('Task edited successfully');
            editTaskModal.style.display = 'none';
            fetchTasks(user_id);
        } catch (error) {
            console.error('Error editing task:', error);
            toastr.error('An error occurred while editing the task. Please try again.');
        }
    });

    // Fetch tasks and display them in the remove task list
    removeTaskBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://localhost:5500/tasks/${user_id}`);
            const data = await response.json();

            document.querySelectorAll('.expandable').forEach(expandableDiv => {
                expandableDiv.style.zIndex = '-1';
            });

            if (response.ok) {
                console.log('Tasks retrieved successfully:', data.data);
                removeTaskList.innerHTML = ''; 

                data.data.forEach(task => {
                    const taskItem = document.createElement('div');
                    taskItem.className = 'task-item';
                    taskItem.textContent = task.title;
                    taskItem.onclick = async () => {
                        await deleteTask(task.id);
                        removeTaskModal.style.display = 'none';
                    };

                    removeTaskList.appendChild(taskItem);
                });

                removeTaskModal.style.display = 'block'; 
            } else {
                console.error('Failed to retrieve tasks:', data.message);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    });

    // Fetch tasks and show them in an ordered list ordered by priority
    toDoBtn.addEventListener("click", async () => {
        const teamId = localStorage.getItem('team_id');

        let url;
        if (teamId) {
            url = `http://localhost:5500/teams/${teamId}/tasks`;
        } else {
            url = `http://localhost:5500/tasks/${user_id}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();
            const taskArray = [];

            document.querySelectorAll('.expandable').forEach(expandableDiv => {
                expandableDiv.style.zIndex = '-1';
            });

            if (response.ok) {
                console.log('Tasks retrieved successfully:', data.data);
                orderListToDo.innerHTML = ''; 

                data.data.forEach(task => {
                    taskArray.push(task);
                });

                // Sort the tasks by priority
                taskArray.sort((a, b) => {
                    const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                });

                // Append sorted tasks to the list
                taskArray.forEach(task => {
                    const taskItem = document.createElement('li');
                    taskItem.className = 'task-item-list';
                    taskItem.textContent = `${task.title} - Priority: ${task.priority}`;
                    orderListToDo.appendChild(taskItem);
                });

                ToDoModal.style.display = 'block'; 
            } else {
                console.error('Failed to retrieve tasks:', data.message);
                orderListToDo.innerHTML = '<li>No tasks found</li>';
                ToDoModal.style.display = 'block';
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    });

    // Display the New Team Modal if button is clicked
    newTeamBtn.addEventListener('click', () => {
        newTeamModal.style.display = "block";
    });

    // Form for creating a new team
    document.getElementById('newTeamForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(newTeamForm);
        const membersRaw = formData.get('teamMembers').split(',').map(member => member.trim());
        const rolesRaw = formData.get('teamMembersRoles').split(',').map(role => role.trim());

        // Check if number of members matches the roles
        if (membersRaw.length !== rolesRaw.length) {
            toastr.warning('The number of members and roles must match.');
            return;
        }

        const members = membersRaw.map((username, index) => {
            const user_id = userMapping[username];
            return { user_id, role: rolesRaw[index] };
        });

        const teamData = {
            name: formData.get('teamName'),
            members
        };

        try {
            const response = await fetch('http://localhost:5500/teams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(teamData)
            });

            const result = await response.json();
            console.log('Create Team response:', result);

            if (!response.ok) {
                console.error('Server responded with an error:', result.message);
                toastr.error(`Failed to create team: ${result.message}`);
                return;
            }

            toastr.success('Team created successfully');
            document.getElementById('newTeamModal').style.display = 'none';
            document.getElementById('newTeamForm').reset();
        } catch (error) {
            console.error('Error creating team:', error);
            toastr.error('An error occurred while creating the team. Please try again.');
        }
    });

    // To delete a team
    async function deleteTeam(team_id) {
        try {
            const response = await fetch(`http://localhost:5500/teams/${team_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            console.log('Delete response:', result);

            if (!response.ok) {
                console.error('Server responded with an error:', result.message);
                toastr.error(`Failed to delete team: ${result.message}`);
                return;
            }

            toastr.success('Team deleted successfully');
            document.querySelector(`.team[data-id="${team_id}"]`).remove();
        } catch (error) {
            console.error('Error deleting team:', error);
            toastr.error('An error occurred while deleting the team. Please try again.');
        }
    }

    // Fetches the teams and gives the user the ability to remove them 
    removeTeamBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://localhost:5500/teams/${user_id}`);
            const data = await response.json();

            if (response.ok) {
                console.log('Teams retrieved successfully:', data.data);
                removeTeamList.innerHTML = ''; 

                data.data.forEach(team => {
                    const teamItem = document.createElement('div');
                    teamItem.className = 'team-item';
                    teamItem.textContent = team.name;

                    teamItem.onclick = async () => {
                        await deleteTeam(team.id);
                        removeTeamModal.style.display = 'none';
                    };

                    teamItem.setAttribute('data-id', team.id); 
                    removeTeamList.appendChild(teamItem);
                });

                removeTeamModal.style.display = 'block'; 
            } else {
                console.error('Failed to retrieve teams:', data.message);
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    });

    // Form for editing tasks
    editTaskForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(editTaskForm);

        const taskData = {
            id: formData.get('id'),
            title: formData.get('title'),
            description: formData.get('description'),
            priority: formData.get('priority'),
            date: formData.get('date'),
            type: formData.get('type')
        };

        try {
            const response = await fetch(`http://localhost:5500/tasks/${taskData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            const result = await response.json();
            console.log('Edit response:', result);

            if (!response.ok) {
                console.error('Server responded with an error:', result.message);
                toastr.error(`Failed to edit task: ${result.message}`);
                return;
            }

            toastr.success('Task edited successfully');
            editTaskModal.style.display = 'none';
            fetchTasks(user_id);
        } catch (error) {
            console.error('Error editing task:', error);
            toastr.error('An error occurred while editing the task. Please try again.');
        }
    });

    // Fetch and display teams for the user
    async function fetchTeams(user_id) {
        try {
            const response = await fetch(`http://localhost:5500/teams/${user_id}`);
            const data = await response.json();

            if (response.ok) {
                console.log('Teams retrieved successfully:', data.data);
                editTeamList.innerHTML = ''; 

                data.data.forEach(team => {
                    const teamItem = document.createElement('div');
                    teamItem.className = 'team-item';
                    teamItem.textContent = team.name;
                    teamItem.onclick = () => {
                        currentTeamId = team.id;  
                        showEditTeamModal(team);
                        editTeamListModal.style.display = 'none';
                    };

                    editTeamList.appendChild(teamItem);
                });
            } else {
                console.error('Failed to retrieve teams:', data.message);
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    }

    // Shows the edit team modal
    function showEditTeamModal(teamData) {
        document.getElementById('editTeamName').value = teamData.name;

        const teamMembersList = document.getElementById('teamMembersList');
        teamMembersList.innerHTML = '';

        if (!Array.isArray(teamData.members)) {
            console.error('Expected teamData.members to be an array:', teamData.members);
            return;
        }

        teamData.members.forEach(member => {
            console.log('Member Data:', member); 

            const memberItem = document.createElement('div');
            memberItem.className = 'member-item';
            memberItem.textContent = member.username;

            memberItem.onclick = async () => {
                await removeTeamMember(teamData.id, member.user_id);
                fetchTeamData(teamData.id);
                editTeamModal.style.display = 'none';
            };

            teamMembersList.appendChild(memberItem);
        });

        editTeamModal.style.display = 'block';
    }

    // Fetch teams for the edit team modal
    editTeamBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://localhost:5500/teams/${user_id}`);
            const data = await response.json();

            if (response.ok) {
                console.log('Teams retrieved successfully:', data.data);
                editTeamList.innerHTML = ''; 

                data.data.forEach(team => {
                    const teamItem = document.createElement('div');
                    teamItem.className = 'team-item';
                    teamItem.textContent = team.name;
                    teamItem.onclick = () => {
                        currentTeamId = team.id;  
                        showEditTeamModal(team);
                        editTeamListModal.style.display = 'none'; 
                    };

                    editTeamList.appendChild(teamItem);
                });

                editTeamListModal.style.display = 'block';
            } else {
                console.error('Failed to retrieve teams:', data.message);
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    });

    // Handle the team name edit
    editTeamForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(editTeamForm);
        const teamData = {
            name: formData.get('teamName'),
            userId: user_id 
        };

        try {
            const response = await fetch(`http://localhost:5500/teams/${currentTeamId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(teamData)
            });

            const result = await response.json();
            console.log('Edit Team response:', result);

            if (!response.ok) {
                console.error('Server responded with an error:', result.message);
                toastr.error(`Failed to edit team: ${result.message}`);
                return;
            }

            toastr.success('Team edited successfully');
            editTeamModal.style.display = 'none';
        } catch (error) {
            console.error('Error editing team:', error);
            toastr.error('An error occurred while editing the team. Please try again.');
        }
    });

    // Removes a team member from a team
    async function removeTeamMember(teamId, userId) {
        try {
            const response = await fetch(`http://localhost:5500/teams/${teamId}/members/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            console.log('Remove Team Member response:', result);

            if (!response.ok) {
                console.error('Server responded with an error:', result.message);
                toastr.error(`Failed to remove team member: ${result.message}`);
                return;
            }

            toastr.success('Team member removed successfully');
        } catch (error) {
            console.error('Error removing team member:', error);
            toastr.error('An error occurred while removing the team member. Please try again.');
        }
    }

    // Fetch and display team tasks
    async function fetchTasksForTeam(teamId) {
        try {
            const response = await fetch(`http://localhost:5500/teams/${teamId}/tasks`);
            const data = await response.json();

            taskContainer.innerHTML = '';

            if (response.ok) {
                if (data.data.length === 0) {
                    const noTasksMessage = document.createElement('p');
                    noTasksMessage.textContent = 'No tasks for this team.';
                    taskContainer.appendChild(noTasksMessage);
                } else {
                    data.data.forEach(task => {
                        createTask(task);
                    });
                }
            } else {
                toastr.error(`Failed to retrieve tasks: ${data.message}`);
            }
        } catch (error) {
            toastr.error('An error occurred while fetching tasks.');
            console.error('Error fetching tasks:', error);
        }
    }

    // Fetch and display user teams
    showTeamBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://localhost:5500/teams/${user_id}`);
            const data = await response.json();

            document.querySelectorAll('.expandable').forEach(expandableDiv => {
                expandableDiv.style.zIndex = '-1';
            });

            if (response.ok) {
                console.log('Team(s) retrieved successfully:', data.data);
                showTeamList.innerHTML = ''; 

                data.data.forEach(team => {
                    const teamItem = document.createElement('li');
                    teamItem.className = 'team-item';
                    teamItem.textContent = team.name;
                    teamItem.dataset.teamId = team.id; 

                    teamItem.addEventListener('click', () => {
                        localStorage.setItem('team_id', team.id);
                        toastr.success(`Team ${team.name} selected`);
                        showTeamModal.style.display = 'none';

                        document.querySelectorAll('.expandable').forEach(expandableDiv => {
                            expandableDiv.style.zIndex = '1';
                        });

                        backToUserTasksBtn.style.display = 'block';

                        fetchTasksForTeam(team.id);
                    });

                    showTeamList.appendChild(teamItem);
                });

                showTeamModal.style.display = 'block';
            } else {
                console.error('Failed to retrieve team(s):', data.message);
            }
        } catch (error) {
            console.error('Error fetching team(s):', error);
        }
    });

    // Creating new team tasks
    newTeamTaskBtn.addEventListener('click', () => {
        teamTaskModal.style.display = 'block';
    });

    // Form for creating team tasks
    teamTaskForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('teamTaskTitle').value;
        const description = document.getElementById('teamTaskDescription').value;
        const priority = document.getElementById('teamTaskPriority').value;
        const date = document.getElementById('teamTaskDate').value;
        const type = document.getElementById('teamTaskType').value;

        const teamId = localStorage.getItem('team_id'); 

        if (!teamId) {
            toastr.warning('Please select a team first');
            return;
        }

        const taskData = { title, description, priority, date, type };

        try {
            const response = await fetch(`http://localhost:5500/teams/${teamId}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            const result = await response.json();

            if (response.ok) {
                toastr.success('Task created successfully');
                createTask(result.data); 
                teamTaskForm.reset(); 
                teamTaskModal.style.display = 'none';
            } else {
                toastr.error(`Failed to create task: ${result.message}`);
            }
        } catch (error) {
            toastr.error('An error occurred during task creation. Please try again.');
            console.error('Error creating task:', error);
        }
    });

    // Clears the team tasks and brings back user tasks 
    backToUserTasksBtn.addEventListener('click', () => {
        localStorage.removeItem('team_id');
        fetchTasks(user_id); 
        toastr.success('Switched back to user tasks');

        backToUserTasksBtn.style.display = 'none';
    });

    // Display the edit team task list modal + task selection
    editTeamTaskBtn.addEventListener('click', async () => {
        const teamId = localStorage.getItem('team_id');

        if (!teamId) {
            toastr.warning('Please select a team first');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5500/teams/${teamId}/tasks`);
            const data = await response.json();

            if (response.ok) {
                console.log('Team tasks retrieved successfully:', data.data);
                editTeamTaskList.innerHTML = '';

                document.querySelectorAll('.expandable').forEach(expandableDiv => {
                    expandableDiv.style.zIndex = '-1';
                });

                data.data.forEach(task => {
                    const taskItem = document.createElement('div');
                    taskItem.className = 'task-item';
                    taskItem.textContent = task.title;
                    taskItem.onclick = () => {
                        showEditTaskModal(task);
                        editTeamTaskListModal.style.display = 'none';
                    };

                    editTeamTaskList.appendChild(taskItem);
                });

                editTeamTaskListModal.style.display = 'block';
            } else {
                console.error('Failed to retrieve team tasks:', data.message);
            }
        } catch (error) {
            console.error('Error fetching team tasks:', error);
        }
    });

    // Displays the Remove Team Task Modal
    function showRemoveTeamTaskModal(taskData) {
        const removeTeamTaskModal = document.getElementById('removeTeamTaskModal');
        const removeTeamTaskList = document.getElementById('removeTeamTaskList');

        removeTeamTaskModal.style.display = 'block';

        removeTeamTaskList.innerHTML = '';

        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.textContent = taskData.title;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = async () => {
            await deleteTask(taskData.id);
            removeTeamTaskModal.style.display = 'none';
        };

        taskItem.appendChild(removeButton);
        removeTeamTaskList.appendChild(taskItem);
    }

    // Handles the removal of team tasks
    removeTeamTaskBtn.addEventListener('click', async () => {
        const teamId = localStorage.getItem('team_id');

        if (!teamId) {
            toastr.warning('Please select a team first');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5500/teams/${teamId}/tasks`);
            const data = await response.json();

            document.querySelectorAll('.expandable').forEach(expandableDiv => {
                expandableDiv.style.zIndex = '-1';
            });

            if (response.ok) {
                console.log('Tasks retrieved successfully:', data.data);
                const removeTeamTaskList = document.getElementById('removeTeamTaskList');
                removeTeamTaskList.innerHTML = '';

                data.data.forEach(task => {
                    const taskItem = document.createElement('div');
                    taskItem.className = 'task-item';
                    taskItem.textContent = task.title;
                    taskItem.onclick = async () => {
                        await deleteTask(task.id);
                        document.getElementById('removeTeamTaskModal').style.display = 'none';
                    };

                    removeTeamTaskList.appendChild(taskItem);
                });

                document.getElementById('removeTeamTaskModal').style.display = 'block'; 
            } else {
                console.error('Failed to retrieve tasks:', data.message);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    });


    // Enables the tasks to be moved around 
    function makeDraggable(element, handle) {
        let offsetX, offsetY, initialX, initialY, isDragging = false;

        const savedPosition = JSON.parse(localStorage.getItem(`task-${element.getAttribute('data-id')}-position`));
        if (savedPosition) {
            element.style.top = `${savedPosition.top}px`;
            element.style.left = `${savedPosition.left}px`;
        }

        handle.onmousedown = function (event) {
            event.preventDefault();
            initialX = event.clientX;
            initialY = event.clientY;
            offsetX = element.offsetLeft - initialX;
            offsetY = element.offsetTop - initialY;
            document.onmousemove = onMouseMove;
            document.onmouseup = onMouseUp;
        };

        function onMouseMove(event) {
            event.preventDefault();
            if (!isDragging) {
                isDragging = true;
            }

            const newX = event.clientX + offsetX;
            const newY = event.clientY + offsetY;

            element.style.top = `${newY}px`;
            element.style.left = `${newX}px`;
        }

        function onMouseUp() {
            document.onmousemove = null;
            document.onmouseup = null;
            isDragging = false;


            const position = {
                top: element.offsetTop,
                left: element.offsetLeft
            };
            localStorage.setItem(`task-${element.getAttribute('data-id')}-position`, JSON.stringify(position));
        }
    }
});