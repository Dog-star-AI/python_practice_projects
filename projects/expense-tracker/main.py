#Expense Tracking system
import json

def log_in():
    name = input("Enter name")
    password = input("Enter password")

with open("users.json", "r") as f:
    users = json.load(f)

is_exit = False

print("******************************************************")
print("*********Welcome to Mongol Expense Tracking***********")
print("******************************************************")
print("\n")

while not is_exit:
    option = input("1) Log in\n2) Sign up\n3) Exit program")
    
    match option:
        case 1:
            log_in()

print("***********************************************************")
print("Thanks for using Mongol Expense Tracker. Please call again!")
print("***********************************************************")

