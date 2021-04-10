import express from "express";
export type Server = import("http").Server | import("https").Server;

const start = (app: express.Application) =>
  new Promise<Server>((resolve, reject) => {
    try {
      const server = app.listen(
        Number(process.env.PORT || "5000") || 5000,
        (error?: Error) => {
          return error ? reject(error) : resolve(server);
        }
      );
    } catch (error) {
      return reject(error);
    }
  });

export default start;
