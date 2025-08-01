import json

def add_task():
    task_name = input("Enter task name: ")
    task_description = input("Enter task description: ")
    task_start_date = input("Enter start date: ")
    task_end_date = input("Enter task end date: ")
    task_status = "On going"
    task = [task_name, task_description, task_start_date, task_end_date, task_status]
    return task

def view_tasks():
    for i in range(len(tasks)):
        print(i + 1, end=' ')
        for x in tasks[i]:
            print(x, end=' ')
        print()

def update_tasks():
    
    print("1. Update status\n.2 Remove task")
    option = input("What update woukld you like to do: ")

    if option == "1":
        update_status()
    elif option == "2":
        print("This will remove task")

def update_status():
    view_tasks()
    
    task_selection = int(input("Select task number to chnage status: "))
    status_update = input("Select new status update\n1. Completed\n2. Abandoned\n3. Paused\n4. On going")

    if status_update == "1":
        tasks[task_selection - 1][4] = "Completed"
    elif status_update == "2":
        tasks[task_selection - 1][4] = "Abandoned"
    elif status_update == "3":
        tasks[task_selection - 1][4] = "Paused" 
    elif status_update =="4":
        tasks[task_selection - 1][4] = "On going"

    print(f"You have updated the task {tasks[task_selection - 1][0]}")


tasks = [] 
is_exit = False

while not is_exit:
    print("Welcome to the to-do list app!")
    print("1. add new task\n2. View tasks\n3. Update task\n4. Exit\n")  
    option = input("What would you like to do today: ")                                                   

    if option == "1":                                                                  
        tasks.append(add_task())                                                            
        print(type(tasks))
    elif option == "2":
        view_tasks()
    elif option == "3":
        update_tasks()
    elif option == "4":
        is_exit = True

print(tasks)

