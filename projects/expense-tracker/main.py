#Expense Tracking system
import json

def user_options(is_done):
    option = int(input("How can we help you today?\n1.View expenses\n2.Add new expense\n3.Remove expense\4.Update budget\n5.Change passoword\n6.Remove account\n"))

def log_in():
    attempts = 0
    while attempts < 4:
        name = input("Enter name")
        password = input("Enter password")

        #check if user exists in database
        if name in users and users[name] == password:

            print("***************Logged in successfully****************")
            #give user a menu and pass is_done to maintain the exit from the menu        
            is_done = False
    
            while not is_done:
                is_done = user_menu(is_done)
                
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

            #update database 
            with open("users.json", "w") as f:
                json.dump(users, f, indent=4)

            attempts = 4
            



with open("users.json", "r") as f:
    users = json.load(f)

is_exit = False
y = True

print("******************************************************")
print("*********Welcome to Mongol Expense Tracking***********")
print("******************************************************")
print("\n")

while not is_exit:
    #handling user input
    while y:
        try:
            option = int(input("1) Log in\n2) Sign up\n3) Exit program\n"))

            match option:
                case 1:
                    log_in()
                case 2:
                    sign_up()
                case 3:
                    is_exit = True 
            y = False
        except ValueError:
            print("Please enter correct option.")
        else:
            if option > 3:
                print("Enter number between 1-3")
    is_exit = True
    
print("***********************************************************")
print("Thanks for using Mongol Expense Tracker. Please call again!")
print("***********************************************************")

