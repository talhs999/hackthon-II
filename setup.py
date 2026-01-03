from setuptools import setup, find_packages

setup(
    name="hackathon-todo",
    version="0.1.0",
    packages=find_packages(),
    entry_points={
        'console_scripts': [
            'hackathon-todo=hackathon_todo.todo:main',
        ],
    },
    install_requires=[],
    author="Hackathon Participant",
    description="A console-based todo application for the hackathon",
    python_requires=">=3.13",
)