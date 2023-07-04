from denoland/deno

EXPOSE 8000

COPY ./src/ /app/

RUN deno cache /app/deps.ts

CMD ["run", "--allow-net", "--allow-env", "/app/main.ts"]
