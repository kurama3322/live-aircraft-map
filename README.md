### how to run it

1. install dependencies

    ```bash
    pnpm i
    ```

2. add environment variables

    ```bash
    cp .env.example .env.local
    ```

    `NEXT_PUBLIC_MAPBOX_TOKEN` is the minimum required environment variable to start the app.
    all features will work except airport data.
    available at https://mapbox.com

    `OPENAIP_API_KEY` is needed for airport data.
    available at https://openaip.net

3. start the dev server

    if you <ins>don't</ins> have all env variables:
    ```bash
    SKIP_ENV_VALIDATION=true pnpm dev
    ```

    if you <ins>do</ins> have all env variables:
    ```bash
    pnpm dev
    ```

4. open http://localhost:3000