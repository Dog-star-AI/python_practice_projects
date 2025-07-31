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
    for task in tasks:
        for x in task:
            print(x, end=' ')
        print()

def update_tasks():
    view_tasks()
    
    print("1. Update status\n.2 Remove task")
    option = input(print("What update woukld you like to do: ", end=' '))

    if option == "1":
        print("This will update status")
    elif option == "2":
        print("This will remove task")

tasks = [] 
is_exit = False

while not is_exit:
    print("Welcome to the to-do list app!")
    print("What would you like to do today?")                                                   
    option = input("1. add new task\n2. View tasks\n3. Update task\n4. Exit\n")  

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
