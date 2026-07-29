"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = exports.UPLOADS_DIR = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const prisma_service_1 = require("../prisma/prisma.service");

exports.UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");

const ALLOWED_MIME = new Set([
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/svg+xml",
]);

const EXT_BY_MIME = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
};

let SettingsService = class SettingsService {
    constructor(prisma) {
        this.prisma = prisma;
        fs.mkdirSync(exports.UPLOADS_DIR, { recursive: true });
    }

    toResponse(row) {
        return {
            id: row.id,
            appName: row.appName,
            currencyCode: row.currencyCode,
            currencySymbol: row.currencySymbol,
            logoUrl: row.logoPath ? `/uploads/${path.basename(row.logoPath)}` : null,
            updatedAt: row.updatedAt,
        };
    }

    async ensureDefaults() {
        return this.prisma.appSettings.upsert({
            where: { id: "default" },
            create: {
                id: "default",
                appName: "Pet Shop Ops",
                currencyCode: "USD",
                currencySymbol: "$",
            },
            update: {},
        });
    }

    async get() {
        const row = await this.ensureDefaults();
        return this.toResponse(row);
    }

    async update(dto) {
        await this.ensureDefaults();
        const data = {};
        if (dto.appName !== undefined) data.appName = dto.appName.trim();
        if (dto.currencyCode !== undefined) data.currencyCode = dto.currencyCode.trim().toUpperCase();
        if (dto.currencySymbol !== undefined) data.currencySymbol = dto.currencySymbol.trim();
        const row = await this.prisma.appSettings.update({
            where: { id: "default" },
            data,
        });
        return this.toResponse(row);
    }

    removeFileIfExists(filename) {
        if (!filename) return;
        const prev = path.join(exports.UPLOADS_DIR, path.basename(filename));
        if (fs.existsSync(prev)) fs.unlinkSync(prev);
    }

    async uploadLogo(file) {
        if (!file) throw new common_1.BadRequestException("Logo file is required");
        if (!ALLOWED_MIME.has(file.mimetype)) {
            if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
            throw new common_1.BadRequestException("Logo must be png, jpeg, webp, or svg");
        }
        if (file.size > 2 * 1024 * 1024) {
            if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
            throw new common_1.BadRequestException("Logo must be 2MB or smaller");
        }

        await this.ensureDefaults();
        const current = await this.prisma.appSettings.findUnique({ where: { id: "default" } });
        this.removeFileIfExists(current?.logoPath);

        const ext = EXT_BY_MIME[file.mimetype] || path.extname(file.originalname) || ".png";
        const filename = `logo-${Date.now()}${ext}`;
        const dest = path.join(exports.UPLOADS_DIR, filename);

        if (file.path) {
            fs.renameSync(file.path, dest);
        } else if (file.buffer) {
            fs.writeFileSync(dest, file.buffer);
        } else {
            throw new common_1.BadRequestException("Logo upload failed");
        }

        const row = await this.prisma.appSettings.update({
            where: { id: "default" },
            data: { logoPath: filename },
        });
        return this.toResponse(row);
    }

    async deleteLogo() {
        await this.ensureDefaults();
        const current = await this.prisma.appSettings.findUnique({ where: { id: "default" } });
        this.removeFileIfExists(current?.logoPath);
        const row = await this.prisma.appSettings.update({
            where: { id: "default" },
            data: { logoPath: null },
        });
        return this.toResponse(row);
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
