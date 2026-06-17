import sys

with open('ANKIT_MALI_RESUME.pdf', 'rb') as f:
    data = f.read(10000)
    text = "".join(chr(b) if 32 <= b <= 126 else " " for b in data)
    print(text)
