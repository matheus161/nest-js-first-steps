import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ParseIntIdPipe } from "src/common/pipes/parse-int-id.pipe";

export default (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove keys that aren't defined the DTO
      forbidNonWhitelisted: true, // throw an error if a property not exist in the DTO
      transform: false, // try to convert the data types in the DTO params
    }),
    new ParseIntIdPipe(), // custom pipe
  );
}