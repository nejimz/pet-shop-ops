"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const path = require("path");
const app_module_1 = require("./app.module");
const settings_service_1 = require("./settings/settings.service");

async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));

    const uploadsDir = settings_service_1.UPLOADS_DIR;
    app.useStaticAssets(uploadsDir, { prefix: "/uploads/" });

    const port = process.env.PORT ? Number(process.env.PORT) : 3001;
    await app.listen(port);
    console.log(`Pet Shop Ops API listening on http://localhost:${port}`);
    console.log(`Uploads served from ${path.resolve(uploadsDir)}`);
}
bootstrap();
