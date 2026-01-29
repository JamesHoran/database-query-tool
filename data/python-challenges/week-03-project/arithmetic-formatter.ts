// Week 3: Arithmetic Formatter Project
// 15 progressive challenges building a complete project

import type { PythonChallenge, ProjectChallenge } from '@/types/python';

export const challenges: PythonChallenge[] = [
  // Challenges 1-5: Basic formatting
  {
    id: 'py-3-01',
    moduleId: 'week-03',
    slug: 'arithmetic-basic-2-problems',
    title: 'Arithmetic Formatter: Basic 2 Problems',
    description: 'Format 2 arithmetic problems vertically with proper alignment.',
    instructions: `Write a function \`arithmetic_formatter(problems)\` that:
- Takes a list of problem strings like "32 + 698"
- Returns the problems formatted vertically
- Only handle 2 problems for now
- Single operator per problem
- Each problem on its own line`,
    starterCode: `def arithmetic_formatter(problems):
    # Format 2 problems vertically
    # Example: ["32 + 698", "3801 - 2"]
    # Output:
    #   32      3801
    # + 698    -    2
    # -----    -----
    result = []
    # Your code here
    return "\\n".join(result)`,
    solutionCode: `def arithmetic_formatter(problems):
    lines = ["", "", ""]
    for problem in problems:
        parts = problem.split()
        num1 = parts[0]
        operator = parts[1]
        num2 = parts[2]

        width = max(len(num1), len(num2)) + 2

        lines[0] += num1.rjust(width) + "    "
        lines[1] += operator + " " + num2.rjust(width - 2) + "    "
        lines[2] += "-" * width + "    "

    return "\\n".join([line.rstrip() for line in lines])`,
    tests: [
      {
        name: 'test_basic_format',
        code: `result = arithmetic_formatter(["32 + 698", "3801 - 2"])
assert "   32" in result, "First number should be right-justified"
assert "  3801" in result, "Second number should be right-justified"
assert "+ 698" in result, "Operator line should be correct"
assert "-    2" in result, "Operator line should be correct"`,
      },
    ],
    hints: [
      'Split each problem by spaces to get parts',
      'First line: first number, right-justified',
      'Second line: operator, second number',
      'Third line: dashes for the width',
    ],
    difficulty: 'beginner',
    concepts: ['string_manipulation', 'lists'],
    dayNumber: 15,
    points: 10,
  },
  {
    id: 'py-3-02',
    moduleId: 'week-03',
    slug: 'arithmetic-spacing-rules',
    title: 'Arithmetic Formatter: Spacing Rules',
    description: 'Add proper spacing between problems (4 spaces).',
    instructions: `Update \`arithmetic_formatter\` to:
- Add exactly 4 spaces between each problem
- Ensure proper alignment of all columns`,
    starterCode: `def arithmetic_formatter(problems):
    # Format with 4 spaces between problems
    result = []
    # Your code here
    return "\\n".join(result)`,
    solutionCode: `def arithmetic_formatter(problems):
    lines = ["", "", ""]
    for problem in problems:
        parts = problem.split()
        num1 = parts[0]
        operator = parts[1]
        num2 = parts[2]

        width = max(len(num1), len(num2)) + 2

        lines[0] += num1.rjust(width) + "    "
        lines[1] += operator + " " + num2.rjust(width - 2) + "    "
        lines[2] += "-" * width + "    "

    return "\\n".join([line.rstrip() for line in lines])`,
    tests: [
      {
        name: 'test_spacing',
        code: `result = arithmetic_formatter(["32 + 698", "3801 - 2"])
lines = result.split("\\n")
# Check that there are 4 spaces between problems in first line
assert "    " in lines[0], "Should have 4 spaces between problems"`,
      },
    ],
    hints: [
      'Add 4 spaces ("    ") after each problem element',
      'Use rstrip() to remove trailing spaces from each line',
    ],
    difficulty: 'beginner',
    concepts: ['string_manipulation'],
    dayNumber: 15,
    points: 10,
  },
  {
    id: 'py-3-03',
    moduleId: 'week-03',
    slug: 'arithmetic-4-problems',
    title: 'Arithmetic Formatter: Handle 4 Problems',
    description: 'Extend to handle up to 4 problems.',
    instructions: `Update \`arithmetic_formatter\` to:
- Handle up to 4 arithmetic problems
- Format all problems with proper spacing`,
    starterCode: `def arithmetic_formatter(problems):
    # Handle up to 4 problems
    result = []
    return "\\n".join(result)`,
    solutionCode: `def arithmetic_formatter(problems):
    lines = ["", "", ""]
    for problem in problems:
        parts = problem.split()
        num1 = parts[0]
        operator = parts[1]
        num2 = parts[2]

        width = max(len(num1), len(num2)) + 2

        lines[0] += num1.rjust(width) + "    "
        lines[1] += operator + " " + num2.rjust(width - 2) + "    "
        lines[2] += "-" * width + "    "

    return "\\n".join([line.rstrip() for line in lines])`,
    tests: [
      {
        name: 'test_4_problems',
        code: `problems = ["32 + 698", "3801 - 2", "45 + 43", "123 + 49"]
result = arithmetic_formatter(problems)
lines = result.split("\\n")
assert len(lines) == 3, "Should have 3 lines"`,
      },
    ],
    hints: [
      'The same logic works for any number of problems',
      'Loop through all problems and append to each line',
    ],
    difficulty: 'beginner',
    concepts: ['string_manipulation', 'loops'],
    dayNumber: 15,
    points: 10,
  },
  {
    id: 'py-3-04',
    moduleId: 'week-03',
    slug: 'arithmetic-5-problems',
    title: 'Arithmetic Formatter: Handle 5 Problems',
    description: 'Extend to handle exactly 5 problems.',
    instructions: `Update \`arithmetic_formatter\` to:
- Handle exactly 5 problems (maximum)`,
    starterCode: `def arithmetic_formatter(problems):
    # Handle up to 5 problems
    result = []
    return "\\n".join(result)`,
    solutionCode: `def arithmetic_formatter(problems):
    lines = ["", "", ""]
    for problem in problems:
        parts = problem.split()
        num1 = parts[0]
        operator = parts[1]
        num2 = parts[2]

        width = max(len(num1), len(num2)) + 2

        lines[0] += num1.rjust(width) + "    "
        lines[1] += operator + " " + num2.rjust(width - 2) + "    "
        lines[2] += "-" * width + "    "

    return "\\n".join([line.rstrip() for line in lines])`,
    tests: [
      {
        name: 'test_5_problems',
        code: `problems = ["32 + 698", "3801 - 2", "45 + 43", "123 + 49", "999 - 1"]
result = arithmetic_formatter(problems)
lines = result.split("\\n")
assert len(lines) == 3, "Should have 3 lines"`,
      },
    ],
    hints: [
      'Same approach - loop handles any number',
    ],
    difficulty: 'beginner',
    concepts: ['string_manipulation'],
    dayNumber: 15,
    points: 10,
  },
  {
    id: 'py-3-05',
    moduleId: 'week-03',
    slug: 'arithmetic-subtraction',
    title: 'Arithmetic Formatter: Subtraction Support',
    description: 'Handle both addition and subtraction operators.',
    instructions: `Update \`arithmetic_formatter\` to:
- Handle + and - operators
- Display the operator correctly on the second line`,
    starterCode: `def arithmetic_formatter(problems):
    # Handle both + and -
    result = []
    return "\\n".join(result)`,
    solutionCode: `def arithmetic_formatter(problems):
    lines = ["", "", ""]
    for problem in problems:
        parts = problem.split()
        num1 = parts[0]
        operator = parts[1]
        num2 = parts[2]

        width = max(len(num1), len(num2)) + 2

        lines[0] += num1.rjust(width) + "    "
        lines[1] += operator + " " + num2.rjust(width - 2) + "    "
        lines[2] += "-" * width + "    "

    return "\\n".join([line.rstrip() for line in lines])`,
    tests: [
      {
        name: 'test_both_operators',
        code: `result = arithmetic_formatter(["32 + 698", "3801 - 2"])
assert "+" in result, "Should contain + operator"
assert "-" in result, "Should contain - operator"`,
      },
    ],
    hints: [
      'Extract operator from split parts',
      'Use it directly in the second line',
    ],
    difficulty: 'beginner',
    concepts: ['string_manipulation'],
    dayNumber: 15,
    points: 10,
  },
  // Challenges 6-10: Answer display and validation
  {
    id: 'py-3-06',
    moduleId: 'week-03',
    slug: 'arithmetic-answers-optional',
    title: 'Arithmetic Formatter: Optional Answers',
    description: 'Add optional answer display with show_answers parameter.',
    instructions: `Update \`arithmetic_formatter\` to:
- Add optional \`show_answers=False\` parameter
- When True, add a fourth line with answers`,
    starterCode: `def arithmetic_formatter(problems, show_answers=False):
    # Add optional answer line
    if show_answers:
        # Include answers
        pass
    return ""`,
    solutionCode: `def arithmetic_formatter(problems, show_answers=False):
    lines = ["", "", ""]
    if show_answers:
        lines.append("")

    for problem in problems:
        parts = problem.split()
        num1 = parts[0]
        operator = parts[1]
        num2 = parts[2]

        width = max(len(num1), len(num2)) + 2

        lines[0] += num1.rjust(width) + "    "
        lines[1] += operator + " " + num2.rjust(width - 2) + "    "
        lines[2] += "-" * width + "    "

        if show_answers:
            if operator == "+":
                answer = str(int(num1) + int(num2))
            else:
                answer = str(int(num1) - int(num2))
            lines[3] += answer.rjust(width) + "    "

    return "\\n".join([line.rstrip() for line in lines])`,
    tests: [
      {
        name: 'test_with_answers',
        code: `result = arithmetic_formatter(["32 + 698"], show_answers=True)
lines = result.split("\\n")
assert len(lines) == 4, "Should have 4 lines with answers"
assert "730" in lines[3], "Answer should be 730"`,
      },
    ],
    hints: [
      'Add a fourth line when show_answers is True',
      'Calculate: + for addition, - for subtraction',
      'Convert to int before calculating',
    ],
    difficulty: 'intermediate',
    concepts: ['string_manipulation', 'conditionals'],
    dayNumber: 15,
    points: 10,
  },
  {
    id: 'py-3-07',
    moduleId: 'week-03',
    slug: 'arithmetic-validation-basics',
    title: 'Arithmetic Formatter: Input Validation Basics',
    description: 'Validate problem format (must have 3 parts).',
    instructions: `Update \`arithmetic_formatter\` to:
- Check each problem has exactly 3 parts (num1, op, num2)
- Raise error with message "Error: Each problem must have exactly two operators"`,
    starterCode: `def arithmetic_formatter(problems, show_answers=False):
    # Validate problem format
    for problem in problems:
        parts = problem.split()
        # Check if parts.length == 3
        pass
    return ""`,
    solutionCode: `def arithmetic_formatter(problems, show_answers=False):
    for problem in problems:
        parts = problem.split()
        if len(parts) != 3:
            raise Error("Error: Each problem must have exactly two operators")

    lines = ["", "", ""]
    if show_answers:
        lines.append("")

    for problem in problems:
        parts = problem.split()
        num1 = parts[0]
        operator = parts[1]
        num2 = parts[2]

        width = max(len(num1), len(num2)) + 2

        lines[0] += num1.rjust(width) + "    "
        lines[1] += operator + " " + num2.rjust(width - 2) + "    "
        lines[2] += "-" * width + "    "

        if show_answers:
            if operator == "+":
                answer = str(int(num1) + int(num2))
            else:
                answer = str(int(num1) - int(num2))
            lines[3] += answer.rjust(width) + "    "

    return "\\n".join([line.rstrip() for line in lines])`,
    tests: [
      {
        name: 'test_validation_error',
        code: `try:
    arithmetic_formatter(["32 + 698 + 1"])
    assert False, "Should raise error for invalid format"
except Exception as e:
    assert "two operators" in str(e) or "exactly" in str(e), "Should error about incorrect number of operators"`,
      },
    ],
    hints: [
      'Use .split() to get parts',
      'Check len(parts) == 3',
      'Raise Exception with error message if invalid',
    ],
    difficulty: 'intermediate',
    concepts: ['string_manipulation', 'conditionals'],
    dayNumber: 15,
    points: 10,
  },
  {
    id: 'py-3-08',
    moduleId: 'week-03',
    slug: 'arithmetic-validation-operator',
    title: 'Arithmetic Formatter: Operator Validation',
    description: 'Validate that operator is only + or -.',
    instructions: `Update \`arithmetic_formatter\` to:
- Check operator is only "+" or "-"
- Raise error: "Error: Operator must be '+' or '-'"`,
    starterCode: `def arithmetic_formatter(problems, show_answers=False):
    # Validate operator
    for problem in problems:
        parts = problem.split()
        operator = parts[1]
        # Check if operator is + or -
        pass
    return ""`,
    solutionCode: `def arithmetic_formatter(problems, show_answers=False):
    for problem in problems:
        parts = problem.split()
        if len(parts) != 3:
            raise Exception("Error: Each problem must have exactly two operators")
        if parts[1] not in "+-":
            raise Exception("Error: Operator must be '+' or '-'")

    lines = ["", "", ""]
    if show_answers:
        lines.append("")

    for problem in problems:
        parts = problem.split()
        num1 = parts[0]
        operator = parts[1]
        num2 = parts[2]

        width = max(len(num1), len(num2)) + 2

        lines[0] += num1.rjust(width) + "    "
        lines[1] += operator + " " + num2.rjust(width - 2) + "    "
        lines[2] += "-" * width + "    "

        if show_answers:
            if operator == "+":
                answer = str(int(num1) + int(num2))
            else:
                answer = str(int(num1) - int(num2))
            lines[3] += answer.rjust(width) + "    "

    return "\\n".join([line.rstrip() for line in lines])`,
    tests: [
      {
        name: 'test_operator_validation',
        code: `try:
    arithmetic_formatter(["32 * 698"])
    assert False, "Should raise error for invalid operator"
except Exception as e:
    assert "Operator must be" in str(e) or "+" in str(e) or "-" in str(e), "Should error about invalid operator"`,
      },
    ],
    hints: [
      'Check: operator in "+-" or operator == "+" or operator == "-"',
      'Raise Exception if operator is invalid',
    ],
    difficulty: 'intermediate',
    concepts: ['conditionals', 'string_manipulation'],
    dayNumber: 15,
    points: 10,
  },
  {
    id: 'py-3-09',
    moduleId: 'week-03',
    slug: 'arithmetic-validation-operand-digits',
    title: 'Arithmetic Formatter: Operand Validation (Digits Only)',
    description: 'Validate operands contain only digits.',
    instructions: `Update \`arithmetic_formatter\` to:
- Check both operands are digits only
- Raise error: "Error: Numbers must only contain digits"`,
    starterCode: `def arithmetic_formatter(problems, show_answers=False):
    # Validate operands are digits only
    for problem in problems:
        parts = problem.split()
        num1 = parts[0]
        num2 = parts[2]
        # Check .isdigit()
        pass
    return ""`,
    solutionCode: `def arithmetic_formatter(problems, show_answers=False):
    for problem in problems:
        parts = problem.split()
        if len(parts) != 3:
            raise Exception("Error: Each problem must have exactly two operators")
        if parts[1] not in "+-":
            raise Exception("Error: Operator must be '+' or '-'")
        if not parts[0].isdigit() or not parts[2].isdigit():
            raise Exception("Error: Numbers must only contain digits")

    lines = ["", "", ""]
    if show_answers:
        lines.append("")

    for problem in problems:
        parts = problem.split()
        num1 = parts[0]
        operator = parts[1]
        num2 = parts[2]

        width = max(len(num1), len(num2)) + 2

        lines[0] += num1.rjust(width) + "    "
        lines[1] += operator + " " + num2.rjust(width - 2) + "    "
        lines[2] += "-" * width + "    "

        if show_answers:
            if operator == "+":
                answer = str(int(num1) + int(num2))
            else:
                answer = str(int(num1) - int(num2))
            lines[3] += answer.rjust(width) + "    "

    return "\\n".join([line.rstrip() for line in lines])`,
    tests: [
      {
        name: 'test_operand_validation',
        code: `try:
    arithmetic_formatter(["32 + abc"])
    assert False, "Should raise error for non-numeric operand"
except Exception as e:
    assert "digits" in str(e) or "number" in str(e).lower(), "Should error about non-numeric values"`,
      },
    ],
    hints: [
      'Use .isdigit() method to check for digits',
      'Check both num1 and num2',
    ],
    difficulty: 'intermediate',
    concepts: ['string_manipulation', 'conditionals'],
    dayNumber: 15,
    points: 10,
  },
  {
    id: 'py-3-10',
    moduleId: 'week-03',
    slug: 'arithmetic-validation-max-digits',
    title: 'Arithmetic Formatter: Maximum 4 Digits',
    description: 'Validate operands have at most 4 digits.',
    instructions: `Update \`arithmetic_formatter\` to:
- Check both operands have <= 4 digits
- Raise error: "Error: Numbers cannot be more than four digits"`,
    starterCode: `def arithmetic_formatter(problems, show_answers=False):
    # Validate operands have max 4 digits
    for problem in problems:
        parts = problem.split()
        num1 = parts[0]
        num2 = parts[2]
        # Check len() <= 4
        pass
    return ""`,
    solutionCode: `def arithmetic_formatter(problems, show_answers=False):
    for problem in problems:
        parts = problem.split()
        if len(parts) != 3:
            raise Exception("Error: Each problem must have exactly two operators")
        if parts[1] not in "+-":
            raise Exception("Error: Operator must be '+' or '-'")
        if not parts[0].isdigit() or not parts[2].isdigit():
            raise Exception("Error: Numbers must only contain digits")
        if len(parts[0]) > 4 or len(parts[2]) > 4:
            raise Exception("Error: Numbers cannot be more than four digits")

    lines = ["", "", ""]
    if show_answers:
        lines.append("")

    for problem in problems:
        parts = problem.split()
        num1 = parts[0]
        operator = parts[1]
        num2 = parts[2]

        width = max(len(num1), len(num2)) + 2

        lines[0] += num1.rjust(width) + "    "
        lines[1] += operator + " " + num2.rjust(width - 2) + "    "
        lines[2] += "-" * width + "    "

        if show_answers:
            if operator == "+":
                answer = str(int(num1) + int(num2))
            else:
                answer = str(int(num1) - int(num2))
            lines[3] += answer.rjust(width) + "    "

    return "\\n".join([line.rstrip() for line in lines])`,
    tests: [
      {
        name: 'test_max_digits',
        code: `try:
    arithmetic_formatter(["12345 + 1"])
    assert False, "Should raise error for number with more than 4 digits"
except Exception as e:
    assert "four digits" in str(e) or "too many" in str(e).lower() or "5 digit" in str(e).lower(), "Should error about too many digits"`,
      },
    ],
    hints: [
      'Use len(num) to check digit count',
      'Both operands must be <= 4',
    ],
    difficulty: 'intermediate',
    concepts: ['string_manipulation', 'conditionals'],
    dayNumber: 15,
    points: 10,
  },
  // Challenges 11-15: Edge cases and final polish
  {
    id: 'py-3-11',
    moduleId: 'week-03',
    slug: 'arithmetic-validation-max-problems',
    title: 'Arithmetic Formatter: Maximum 5 Problems',
    description: 'Validate maximum of 5 problems.',
    instructions: `Update \`arithmetic_formatter\` to:
- Check if len(problems) > 5
- Raise error: "Error: Too many problems"`,
    starterCode: `def arithmetic_formatter(problems, show_answers=False):
    # Validate max 5 problems
    if len(problems) > 5:
        # Raise error
        pass
    return ""`,
    solutionCode: `def arithmetic_formatter(problems, show_answers=False):
    if len(problems) > 5:
        raise Exception("Error: Too many problems")

    for problem in problems:
        parts = problem.split()
        if len(parts) != 3:
            raise Exception("Error: Each problem must have exactly two operators")
        if parts[1] not in "+-":
            raise Exception("Error: Operator must be '+' or '-'")
        if not parts[0].isdigit() or not parts[2].isdigit():
            raise Exception("Error: Numbers must only contain digits")
        if len(parts[0]) > 4 or len(parts[2]) > 4:
            raise Exception("Error: Numbers cannot be more than four digits")

    lines = ["", "", ""]
    if show_answers:
        lines.append("")

    for problem in problems:
        parts = problem.split()
        num1 = parts[0]
        operator = parts[1]
        num2 = parts[2]

        width = max(len(num1), len(num2)) + 2

        lines[0] += num1.rjust(width) + "    "
        lines[1] += operator + " " + num2.rjust(width - 2) + "    "
        lines[2] += "-" * width + "    "

        if show_answers:
            if operator == "+":
                answer = str(int(num1) + int(num2))
            else:
                answer = str(int(num1) - int(num2))
            lines[3] += answer.rjust(width) + "    "

    return "\\n".join([line.rstrip() for line in lines])`,
    tests: [
      {
        name: 'test_max_problems',
        code: `try:
    arithmetic_formatter(["1+1", "2+2", "3+3", "4+4", "5+5", "6+6"])
    assert False, "Should raise error for more than 5 problems"
except Exception as e:
    assert "Too many problems" in str(e) or "5" in str(e), "Should error about too many problems"`,
      },
    ],
    hints: [
      'Check len(problems) > 5 at the start',
    ],
    difficulty: 'intermediate',
    concepts: ['conditionals'],
    dayNumber: 15,
    points: 10,
  },
  {
    id: 'py-3-12',
    moduleId: 'week-03',
    slug: 'arithmetic-edge-case-single-digit',
    title: 'Arithmetic Formatter: Single Digit Numbers',
    description: 'Handle single digit numbers correctly.',
    instructions: `Ensure single digit numbers format correctly:
- Proper spacing for operator
- Correct dash line length`,
    starterCode: `def arithmetic_formatter(problems, show_answers=False):
    # Handle single digit numbers
    if len(problems) > 5:
        raise Exception("Error: Too many problems")

    for problem in problems:
        parts = problem.split()
        if len(parts) != 3:
            raise Exception("Error: Each problem must have exactly two operators")
        if parts[1] not in "+-":
            raise Exception("Error: Operator must be '+' or '-'")
        if not parts[0].isdigit() or not parts[2].isdigit():
            raise Exception("Error: Numbers must only contain digits")
        if len(parts[0]) > 4 or len(parts[2]) > 4:
            raise Exception("Error: Numbers cannot be more than four digits")

    lines = ["", "", ""]
    if show_answers:
        lines.append("")

    for problem in problems:
        parts = problem.split()
        num1 = parts[0]
        operator = parts[1]
        num2 = parts[2]

        width = max(len(num1), len(num2)) + 2

        lines[0] += num1.rjust(width) + "    "
        lines[1] += operator + " " + num2.rjust(width - 2) + "    "
        lines[2] += "-" * width + "    "

        if show_answers:
            if operator == "+":
                answer = str(int(num1) + int(num2))
            else:
                answer = str(int(num1) - int(num2))
            lines[3] += answer.rjust(width) + "    "

    return "\\n".join([line.rstrip() for line in lines])`,
    solutionCode: `def arithmetic_formatter(problems, show_answers=False):
    if len(problems) > 5:
        raise Exception("Error: Too many problems")

    for problem in problems:
        parts = problem.split()
        if len(parts) != 3:
            raise Exception("Error: Each problem must have exactly two operators")
        if parts[1] not in "+-":
            raise Exception("Error: Operator must be '+' or '-'")
        if not parts[0].isdigit() or not parts[2].isdigit():
            raise Exception("Error: Numbers must only contain digits")
        if len(parts[0]) > 4 or len(parts[2]) > 4:
            raise Exception("Error: Numbers cannot be more than four digits")

    lines = ["", "", ""]
    if show_answers:
        lines.append("")

    for problem in problems:
        parts = problem.split()
        num1 = parts[0]
        operator = parts[1]
        num2 = parts[2]

        width = max(len(num1), len(num2)) + 2

        lines[0] += num1.rjust(width) + "    "
        lines[1] += operator + " " + num2.rjust(width - 2) + "    "
        lines[2] += "-" * width + "    "

        if show_answers:
            if operator == "+":
                answer = str(int(num1) + int(num2))
            else:
                answer = str(int(num1) - int(num2))
            lines[3] += answer.rjust(width) + "    "

    return "\\n".join([line.rstrip() for line in lines])`,
    tests: [
      {
        name: 'test_single_digit',
        code: `result = arithmetic_formatter(["5 + 3"])
lines = result.split("\\n")
assert len(lines[0]) == len(lines[1]) == len(lines[2]), "All lines should have equal length"`,
      },
    ],
    hints: [
      'Width calculation handles all cases',
      'max(len(num1), len(num2)) + 2 ensures proper width',
    ],
    difficulty: 'intermediate',
    concepts: ['string_manipulation'],
    dayNumber: 15,
    points: 10,
  },
  {
    id: 'py-3-13',
    moduleId: 'week-03',
    slug: 'arithmetic-edge-case-multi-digit',
    title: 'Arithmetic Formatter: Multi-Digit Numbers',
    description: 'Handle multi-digit numbers with different lengths.',
    instructions: `Ensure multi-digit numbers align correctly:
- 123 + 5 should show 5 under 3`,
    starterCode: `def arithmetic_formatter(problems, show_answers=False):
    if len(problems) > 5:
        raise Exception("Error: Too many problems")

    for problem in problems:
        parts = problem.split()
        if len(parts) != 3:
            raise Exception("Error: Each problem must have exactly two operators")
        if parts[1] not in "+-":
            raise Exception("Error: Operator must be '+' or '-'")
        if not parts[0].isdigit() or not parts[2].isdigit():
            raise Exception("Error: Numbers must only contain digits")
        if len(parts[0]) > 4 or len(parts[2]) > 4:
            raise Exception("Error: Numbers cannot be more than four digits")

    lines = ["", "", ""]
    if show_answers:
        lines.append("")

    for problem in problems:
        parts = problem.split()
        num1 = parts[0]
        operator = parts[1]
        num2 = parts[2]

        width = max(len(num1), len(num2)) + 2

        lines[0] += num1.rjust(width) + "    "
        lines[1] += operator + " " + num2.rjust(width - 2) + "    "
        lines[2] += "-" * width + "    "

        if show_answers:
            if operator == "+":
                answer = str(int(num1) + int(num2))
            else:
                answer = str(int(num1) - int(num2))
            lines[3] += answer.rjust(width) + "    "

    return "\\n".join([line.rstrip() for line in lines])`,
    solutionCode: `def arithmetic_formatter(problems, show_answers=False):
    if len(problems) > 5:
        raise Exception("Error: Too many problems")

    for problem in problems:
        parts = problem.split()
        if len(parts) != 3:
            raise Exception("Error: Each problem must have exactly two operators")
        if parts[1] not in "+-":
            raise Exception("Error: Operator must be '+' or '-'")
        if not parts[0].isdigit() or not parts[2].isdigit():
            raise Exception("Error: Numbers must only contain digits")
        if len(parts[0]) > 4 or len(parts[2]) > 4:
            raise Exception("Error: Numbers cannot be more than four digits")

    lines = ["", "", ""]
    if show_answers:
        lines.append("")

    for problem in problems:
        parts = problem.split()
        num1 = parts[0]
        operator = parts[1]
        num2 = parts[2]

        width = max(len(num1), len(num2)) + 2

        lines[0] += num1.rjust(width) + "    "
        lines[1] += operator + " " + num2.rjust(width - 2) + "    "
        lines[2] += "-" * width + "    "

        if show_answers:
            if operator == "+":
                answer = str(int(num1) + int(num2))
            else:
                answer = str(int(num1) - int(num2))
            lines[3] += answer.rjust(width) + "    "

    return "\\n".join([line.rstrip() for line in lines])`,
    tests: [
      {
        name: 'test_multi_digit',
        code: `result = arithmetic_formatter(["123 + 5"])
assert "  123" in result, "Should right-justify 123"
assert "+    5" in result, "Should show operator with 5 right-justified"`,
      },
    ],
    hints: [
      'rjust(width) ensures proper alignment',
      'width = max(len(num1), len(num2)) + 2',
    ],
    difficulty: 'intermediate',
    concepts: ['string_manipulation'],
    dayNumber: 15,
    points: 10,
  },
  {
    id: 'py-3-14',
    moduleId: 'week-03',
    slug: 'arithmetic-without-answers',
    title: 'Arithmetic Formatter: Final Without Answers',
    description: 'Final test - format without answers.',
    instructions: `Complete \`arithmetic_formatter\`:
- Format up to 5 problems
- No answers (show_answers=False)`,
    starterCode: `def arithmetic_formatter(problems, show_answers=False):
    # Complete implementation
    pass`,
    solutionCode: `def arithmetic_formatter(problems, show_answers=False):
    if len(problems) > 5:
        raise Exception("Error: Too many problems")

    for problem in problems:
        parts = problem.split()
        if len(parts) != 3:
            raise Exception("Error: Each problem must have exactly two operators")
        if parts[1] not in "+-":
            raise Exception("Error: Operator must be '+' or '-'")
        if not parts[0].isdigit() or not parts[2].isdigit():
            raise Exception("Error: Numbers must only contain digits")
        if len(parts[0]) > 4 or len(parts[2]) > 4:
            raise Exception("Error: Numbers cannot be more than four digits")

    lines = ["", "", ""]
    if show_answers:
        lines.append("")

    for problem in problems:
        parts = problem.split()
        num1 = parts[0]
        operator = parts[1]
        num2 = parts[2]

        width = max(len(num1), len(num2)) + 2

        lines[0] += num1.rjust(width) + "    "
        lines[1] += operator + " " + num2.rjust(width - 2) + "    "
        lines[2] += "-" * width + "    "

        if show_answers:
            if operator == "+":
                answer = str(int(num1) + int(num2))
            else:
                answer = str(int(num1) - int(num2))
            lines[3] += answer.rjust(width) + "    "

    return "\\n".join([line.rstrip() for line in lines])`,
    tests: [
      {
        name: 'test_final_no_answers',
        code: `result = arithmetic_formatter(["32 + 698", "3801 - 2", "45 + 43", "123 + 49"])
lines = result.split("\\n")
assert len(lines) == 3, "Should have 3 lines without answers"`,
      },
    ],
    hints: [
      'Ensure all validation and formatting is complete',
      'Should return exactly 3 lines without answers',
    ],
    difficulty: 'intermediate',
    concepts: ['string_manipulation', 'lists'],
    dayNumber: 15,
    points: 10,
  },
  {
    id: 'py-3-15',
    moduleId: 'week-03',
    slug: 'arithmetic-final-with-answers',
    title: 'Arithmetic Formatter: Final With Answers',
    description: 'Final test - format with answers.',
    instructions: `Complete \`arithmetic_formatter\`:
- Format up to 5 problems
- Include answers (show_answers=True)
- Should return 4 lines`,
    starterCode: `def arithmetic_formatter(problems, show_answers=False):
    # Complete implementation with answers
    pass`,
    solutionCode: `def arithmetic_formatter(problems, show_answers=False):
    if len(problems) > 5:
        raise Exception("Error: Too many problems")

    for problem in problems:
        parts = problem.split()
        if len(parts) != 3:
            raise Exception("Error: Each problem must have exactly two operators")
        if parts[1] not in "+-":
            raise Exception("Error: Operator must be '+' or '-'")
        if not parts[0].isdigit() or not parts[2].isdigit():
            raise Exception("Error: Numbers must only contain digits")
        if len(parts[0]) > 4 or len(parts[2]) > 4:
            raise Exception("Error: Numbers cannot be more than four digits")

    lines = ["", "", ""]
    if show_answers:
        lines.append("")

    for problem in problems:
        parts = problem.split()
        num1 = parts[0]
        operator = parts[1]
        num2 = parts[2]

        width = max(len(num1), len(num2)) + 2

        lines[0] += num1.rjust(width) + "    "
        lines[1] += operator + " " + num2.rjust(width - 2) + "    "
        lines[2] += "-" * width + "    "

        if show_answers:
            if operator == "+":
                answer = str(int(num1) + int(num2))
            else:
                answer = str(int(num1) - int(num2))
            lines[3] += answer.rjust(width) + "    "

    return "\\n".join([line.rstrip() for line in lines])`,
    tests: [
      {
        name: 'test_final_with_answers',
        code: `result = arithmetic_formatter(["32 + 698", "3801 - 2"], show_answers=True)
lines = result.split("\\n")
assert len(lines) == 4, "Should have 4 lines with answers"
assert "730" in lines[3], "Should contain answer 730 (32 + 698)"
assert "3799" in lines[3], "Should contain answer 3799 (3801 - 2)"`,
      },
    ],
    hints: [
      'Complete implementation with all features',
      'Should return 4 lines with answers',
      'Answers should be correctly calculated',
    ],
    difficulty: 'intermediate',
    concepts: ['string_manipulation', 'lists', 'conditionals'],
    dayNumber: 15,
    points: 10,
  },
];
