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
    option = input("What update would you like to do: ")

    if option == "1":
        update_status()
    elif option == "2":
        remove_task()
def update_status():
    view_tasks()
    
    task_selection = int(input("Select task number to change status: "))
    status_update = input("Select new status update\n1. Completed\n2. Abandoned\n3. Paused\n4. On going\n")

    if status_update == "1":
        tasks[task_selection - 1][4] = "Completed"
    elif status_update == "2":
        tasks[task_selection - 1][4] = "Abandoned"
    elif status_update == "3":
        tasks[task_selection - 1][4] = "Paused" 
    elif status_update =="4":
        tasks[task_selection - 1][4] = "On going"

    print(f"You have updated the task {tasks[task_selection - 1][0]}")

def remove_task():
    view_tasks()

    task_selection = int(input("Select task number to remove or 0 to exit: "))
    
    if task_selection == 0:
        return
    
    task_selection_confrim = input(f"Are you sure you want to remove the task {tasks[task_selection - 1][0]} Y/N: ")
    
    if task_selection_confrim == "Y" or task_selection_confrim == "y":
        tasks.pop(task_selection - 1)
        print("You have successfully removed the task!")
    elif task_selection_confrim == "N" or task_selection_confrim == 'n':
        print("You have selected to not remove the task!")


tasks = [] 
is_exit = False

print("Welcome to the to-do list app!")

while not is_exit:
    print("1. add new task\n2. View tasks\n3. Update task\n4. Exit\n")  
    option = input("What would you like to do today: ")                                                   

    if option == "1":                                                                  
        tasks.append(add_task())                                                            
    elif option == "2":
        view_tasks()
    elif option == "3":
        update_tasks()
    elif option == "4":
        is_exit = True
