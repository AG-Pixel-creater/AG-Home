# Firebase Website Project

This project is a simple website that integrates Firebase for user authentication and data management.

## Project Structure

- **src/**: Contains the source files for the website.
  - **js/**: JavaScript files for functionality.
    - `app.js`: Main entry point for the website.
    - `auth.js`: Handles user authentication.
    - `firebase-config.js`: Firebase configuration settings.
  - **css/**: Contains styles for the website.
    - `styles.css`: Styles for layout and appearance.
  - `index.html`: Main HTML file linking to CSS and JavaScript.

- **public/**: Contains the public-facing HTML file for deployment.
  - `index.html`: Public HTML file for Firebase hosting.

- **firebase.json**: Configuration for Firebase Hosting.

- **.firebaserc**: Firebase project settings.

- **package.json**: npm configuration file listing dependencies and scripts.

## Setup Instructions

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Configure Firebase by updating `firebase-config.js` with your Firebase project settings.
4. Deploy the website using `firebase deploy`.

## Usage

- Open `src/index.html` in a web browser to view the website locally.
- Use the authentication functions in `auth.js` to manage user sessions.