def change_value(x):
    print(f"This is the value of x now: {x}")
    x = 50
    print(f"This is the value of x later: {x}")
    return x

x = 10

print(f"The value of x is: {x}")

x = change_value(x)

print(f"The new value of x is: {x}")

