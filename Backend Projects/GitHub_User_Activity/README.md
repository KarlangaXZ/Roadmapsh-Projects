# GitHub User Activity CLI

Lightweight Node.js CLI that fetches and prints a user's recent GitHub public events.

Project page: https://roadmap.sh/projects/github-user-activity

## Requirements

- Node.js (v12+ recommended)
- Internet access (GitHub API rate limits apply for unauthenticated requests)

## Installation

1. Clone the repository:
   git clone https://github.com/KarlangaXZ/GitHub_User_Activity.git

2. Change into the project folder:
   cd GitHub_User_Activity

3. Install dependencies:
   npm install

No additional npm packages are required; the script uses Node's built-in https module.

## Usage

Run the script with a GitHub username:

node github-activity.js <username>

Example:
node github-activity.js kamranahmedse

If you made the script executable, you can also run:
./github-activity.js <username>

## Notes

- The script queries the public events endpoint: /users/:username/events.
- Unauthenticated requests are subject to GitHub API rate limits. If you hit rate limits, wait or use an authenticated request (not implemented in this script).
- Output uses ANSI colors; disable or adjust your terminal if colors render incorrectly.

## License

See repository for license and contribution details.