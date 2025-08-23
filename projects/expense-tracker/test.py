attempt = 0

while attempt < 3:
    try:
        age = int(input("Enter age"))
        attempt = 3
    except ValueError:
        print("Error, try again")
        attempt += 1
print("Done")
