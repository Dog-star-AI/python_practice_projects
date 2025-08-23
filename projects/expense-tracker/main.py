#Expense Tracking system
import json

def log_in():
    attempts = 0
    while attempts < 4:
        name = input("Enter name")
        password = input("Enter password")

        #check if user exists in database
        if name in users and users[name] == password:
            print("***************Logged in successfully****************")
            attempts = 4
        else:
            #exit when user reach attempt limit
            attempts += 1
            if attempts < 4:
                print(f"Incorrect username or password, try again!\n You have {4 - attempts} attempts left")
            else:
                print("You run out of attempts! Please try again later!")
        


with open("users.json", "r") as f:
    users = json.load(f)

is_exit = False

print("******************************************************")
print("*********Welcome to Mongol Expense Tracking***********")
print("******************************************************")
print("\n")

while not is_exit:
    option = int(input("1) Log in\n2) Sign up\n3) Exit program"))
    
    match option:
        case 1:
            log_in()

print("***********************************************************")
print("Thanks for using Mongol Expense Tracker. Please call again!")
print("***********************************************************")

