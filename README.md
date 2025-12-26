# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




// this is api and response of third page 

API = https://0gt6s4bqo5.execute-api.us-east-1.amazonaws.com/prod/create-user-entry-prod

{
  "email": "test.user@example.com",
  "promotion": {
    "campaign_id": "WINTER_2025",
    "source": "facebook_ads",
    "medium": "cpc"
  },
  "user_data": {
    "first_name": "Test",
    "last_name": "User",
    "age": 28,
    "country": "IN"
  },
  "agreements": {
    "terms_and_conditions": true,
    "privacy_policy": true,
    "marketing_emails": false
  },
  "origin": {
    "ip": "203.0.113.45",
    "user_agent": "Mozilla/5.0",
    "page": "/signup"
  }
}
 
 
