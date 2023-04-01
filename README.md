# Buford2

Buford2 is a collection of functions to help solve problems from various forms of mathematics. However, the keystone of Buford2 is its Algebra section.

## Algebra

The Algebra section is the most advanced section of Buford2. It includes a class-based data scructure including a string interpreter and translator, meaning you can input an algebra problem as something like this *3a^2 + 6 = 54* and expect the output *a = 4*.

### Syntax

The syntax of Buford2 is pretty basic, as it is meant to closely reflect what the problem actually looks like.

**Operations**
- '+': Plus
- '-': Minus
- '*': Multiplication
- '/': Division
- '^': Exponent Operator (ex: 2 raised by 3 => 2^3)
*Note: To do square roots, raise a number by the inverse (1/2)*

**Order of Operations**
- Order of operations follows traditional rules (PEMDAS if you remeber 4th grade). Here it is:
    1. Parenthesis ('()', '[]')
    2. Exponents
    3. Multiplication and Division
    4. Addition and Subtraction
*Note: These steps are actually done backwards when solving algebra*

### Abilities

**Basic Algebra**
1. Will "move" terms without a variable to the right and terms with a variable to the left
    2. If there is only one term with a variable:
        3. will divide the other factors out to isolate the variable
        4. Will remove the exponent of the isolated variable.
    5. If there are multiple terms with a variable:
        6. Will attempt to undistribute it (2x+3ax => x(2+3a)). If successful, go to 2.