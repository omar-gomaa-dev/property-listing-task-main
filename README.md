# PropertyListingTask

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.6.

## Getting started

1. Clone this repo

   ```bash
   git clone https://github.com/SeifEleslamGouda/property-listing-task.git
   ```

2. install dependencies
   ```bash
   npm i
   ```

## Development server

1.  Start a local development server on port 4200:

    ```bash
    npm start
    ```

2.  Start mock database server
    ```bash
    npm run server
    ```

## Features

- **Property Table**: Displays a list of properties.

- **Property Details Page**: Shows the details of a specific property.

## Core Tasks

1. Modify the `property-table.component.ts` to fetch 10 properties at a time from the mocked data.

2. Implement a caching mechanism:
   - Limit the cache zone so you only load cache when convenient.
   - Ensure that the caching mechanism also save the scroll position.

## Optional Tasks

- Modify the `property-details.component.ts` to fetch data details and show it in the details page

- Add filtration to the table to filter using the status of the property

- Add Search to the table:
  - write your own searching function as it's not supported by the mock database (According to my knowledge)
  - make the search functionality generic and as optimized as possible.

## Evaluation Considerations

- Code Structure and Maintainability
- Effective Use of Angular Concepts (State Management, etc.)
- Error Handling and API Interactions
- Attention to UI/UX details
- Completeness of Features and Functionality

## Resources

- Mock API Documentation (JSON Server): https://www.npmjs.com/package/json-server

## Notes

- Feel free to use a state management library (NgRx or other) if you deem it appropriate.
- Focus on the core tass first. Additional tasks are excellent ways to demonstrate your skills further.

## Comments

- Add comments to explain your code, highlight advantages, or acknowledge trade-offs where necessary.
- Feel free to provide feedback on the task or interview process in `app.component.ts` — this won't affect task evaluation.
