def add_task():
    task_name = input("Enter task name: ")
    task_description = input("Enter task description: ")
    task_start_date = input("Enter start date: ")
    task_end_date = input("Enter task end date: ")
    task_status = "On going"
    task = [task_name, task_description, task_start_date, task_end_date, task_status]
    return task


print("Welcome to the to-do list app!")
print("What would you like to do today?")
tasks = []
option = input("1. add new task\n2. View tasks\n3. Update task status\n4. Exit\n")
if option == "1":
    tasks.append(add_task())

for x in tasks:
    print(x)

