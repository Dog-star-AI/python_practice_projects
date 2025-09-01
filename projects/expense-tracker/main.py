#Expense Tracking system
import json

#menu for logged in user
def user_menu(is_done, name):
    option = int(input("How can we help you today?\n1.View expenses\n2.Add new expense\n3.Remove expense\n4.Update budget\n5.Change password\n6.Remove account\n7.Exit\n"))

    match option:
        case 1:
            view_expense(name)
            return is_done
        case 2:
            add_expense(name)
            return is_done
        case 3:
            remove_expense(name)
            return is_done
        case 4:
            update_budget(name)
            return is_done           
        case 5:
            change_password(name)
            return is_done
        case 6:
            remove_account(name)
            return not is_done #exit after removing
        case 7:
            return not is_done #exit option

def display_expenses(name):
    expense_number = 1
    total_costs = 0
    budget_cost_difference = 0

    print(f"*************{name}'s expenses and costs***************")
    print("Expenses                Costs                           ")
    print("                                                        ")
    for x in expenses[name]:
        #skip displaying the budget
        if expenses[name][x] == expenses[name]["budget"]:
            continue
        
        print(f"{expense_number}  {x}     {expenses[name][x]}")
        total_costs += expenses[name][x]
        expense_number += 1

    budget_cost_difference = expenses[name]["budget"] - total_costs

    print("********************************************************")
    print(f"Total costs: {total_costs}          budget: {expenses[name]["budget"]}")
    print("********************************************************")

    if budget_cost_difference < 0:
        print(f"You're under budget by {budget_cost_difference}. Stop spending money!!")
    else:
        print(f"We are crusing nicely! You have {budget_cost_difference} to spare!")

    print("********************************************************")
    
    
    

#START of logged in user menu options

def view_expense(name):
    display_expenses(name)

def add_expense(name):
    expense_name = input("Enter name of expense: ")
    expense_price = float(input("Enter cost of expense: "))
    
    expenses[name][expense_name] = expense_price
    update_expenses_database()

    print("*****************New expense added successfully!!***************")


def remove_expense(name):
    display_expenses(name)
    expense_number = int(input("Which expense do you want to remove: "))



def update_budget(name):
    new_budget = float(input(f"Current budget: {expenses[name]["budget"]}\nEnter new budget: "))

    expenses[name]["budget"] = new_budget

    update_expenses_database()
    print("***********Budget updated successfully!!*********************\n")

def change_password(name):
    while True:
        new_password = input("Enter new password: ")

        if new_password == users[name]:
            print("password same as old passowrd, try a different one")
        else:
            users[name] = new_password

            #update database
            with open("users.json", "w") as f:
                json.dump(users, f, indent=4)

            print("*******************Passowrd updated successfully!!***********************")

            break #exit loop


def remove_account(name):

    option_one = input("Are you sure?Yes/No: ")
    option_one.lower()
    if option_one == 'yes':
        users.pop(name) 
        expenses.pop(name)

        update_users_database()
        update_expenses_database()

        print("*********Account deleted successfully!!**********\n")
#END of logged in user menu options
        
#Updating databases
def update_users_database():
    with open("users.json", "w") as f:
        json.dump(users, f, indent=4)

def update_expenses_database():
    with open("expenses.json", "w") as f:
        json.dump(expenses, f, indent=4)


def log_in():
    attempts = 0
    while attempts < 4:
        name = input("Enter name: ")
        password = input("Enter password: ")

        #check if user exists in database
        if name in users and users[name] == password:

            print("***************Logged in successfully****************")
            #give user a menu and pass is_done to maintain the exit from the menu        
            is_done = False
    
            while not is_done:
                is_done = user_menu(is_done, name)
                
            attempts = 4
        else:
            #exit when user reach attempt limit
            attempts += 1
            if attempts < 4:                print(f"Incorrect username or password, try again!\n You have {4 - attempts} attempts left")
            else:
                print("You run out of attempts! Please try again later!")
        
def sign_up():
    attempts = 0
    print("****************************************************")
    print("***Let's create a Mongol Expense Tracker account!***")
    print("****************************************************")

    while attempts < 4:
        name = input("Who should we call you: ") 
        
        #check if username already exists
        if name in users:
            attempts += 1
            if attempts == 4:
                print("***********Opps!! You ran out of attempts, try again later.*********")
            else:                
                print("Try a different name.")
        else:
            password = input(f"{name} create password: ")
            print("********************************************************")
            print("*Congratulations!! You're now part of the Mongol Family*")
            print("********************************************************")
            users[name] = password
            expenses[name] = {"budget":0.0}

            #update database 
            with open("users.json", "w") as f:
                json.dump(users, f, indent=4)

            with open("expenses.json", "w") as f:
                json.dump(expenses, f, indent=4)

            attempts = 4
            


#Load users and expenses json files
with open("users.json", "r") as f:
    users = json.load(f)

with open("expenses.json", "r") as f:
    expenses = json.load(f)

is_exit = False
y = True

print("******************************************************")
print("*********Welcome to Mongol Expense Tracking***********")
print("******************************************************")
print("\n")

#handling user 
while True:
    try:
        option = int(input("1) Log in\n2) Sign up\n3) Exit program\n"))

        match option:
            case 1:
                log_in()
            case 2:
                sign_up()
            case 3:
                break
    except ValueError:
        print("Please enter number.")
    else:
        if option > 3:
            print("Enter number between 1-3")

print("***********************************************************")
print("Thanks for using Mongol Expense Tracker. Please call again!")
print("***********************************************************")

