import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAssetDto } from './dto';
import { IResponse } from 'types';
import { Asset } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class AssetService {
    constructor(
        private readonly cloudinaryService: CloudinaryService,
        private readonly prisma: PrismaService
    ) { }

    public async upload(files: Array<Express.Multer.File>): Promise<IResponse<Asset[]>> {
        const images = await Promise.all(files.map(async (file) => {
            return await this.cloudinaryService.uploadImage(file);
        }));
        const assets = await this.prisma.$transaction(
            images.map((image) => this.prisma.asset.create({
                data: {
                    name: this.getFileName(image.url),
                    url: image.url,
                    width: image.width,
                    height: image.height,
                    format: image.format,
                    cloudinary_asset_id: image.asset_id,
                    cloudinary_public_id: image.public_id,
                }
            }))
        )
        return {
            code: 200,
            success: true,
            message: 'Success!',
            data: assets
        }
    }

    public async getAsset(id: number): Promise<IResponse<Asset>> {
        const asset = await this.prisma.asset.findUnique({
            where: { id }
        })
        if (asset) {
            return {
                code: 200,
                message: 'Success!',
                success: true,
                data: asset
            }
        }
        return {
            code: 400,
            message: 'Asset does not exist in the system!',
            success: false,
        }
    }

    public async delete(id: number): Promise<IResponse<Asset>> {
        const asset = await this.prisma.asset.findUnique({
            where: { id }
        })
        if (asset) {
            const [assetDelete, _assetCloudinaryDelete] = await Promise.all([
                await this.prisma.asset.delete({ where: { id } }),
                await this.cloudinaryService.deleteImage(asset.cloudinary_public_id)
            ])
            return {
                code: 200,
                message: 'Success!',
                success: true,
                data: assetDelete
            }
        }
        return {
            code: 400,
            message: 'Asset does not exist in the system!',
            success: false,
        }
    }

    public async update(id: number, input: UpdateAssetDto): Promise<IResponse<Asset>> {
        const { name } = input;
        const asset = await this.prisma.asset.findUnique({
            where: { id }
        })
        if (asset) {
            const assetUpdate = await this.prisma.asset.update({
                where: { id },
                data: {
                    ...name && { name }
                },
            })
            return {
                code: 200,
                success: true,
                message: 'Success!',
                data: assetUpdate
            }
        }
        return {
            code: 400,
            message: 'Asset does not exist in the system!',
            success: false,
        }
    }

    public async getAssets(input: PaginationDto): Promise<IResponse<{ assets: Asset[], totalPage: number, skip: number, take: number, total: number }>> {
        const { skip, take, search } = input;
        const [totalRecord, assets] = await this.prisma.$transaction([
            this.prisma.asset.count(),
            this.prisma.asset.findMany({
                take: take || 10,
                skip: skip || 0,
                where: {
                    ...search && {
                        name: {
                            contains: search
                        },
                    }
                },
            }),
        ])
        return {
            code: 200,
            success: true,
            message: "Success!",
            data: {
                assets,
                totalPage: take ? Math.ceil(totalRecord / take) : Math.ceil(totalRecord / 10),
                total: totalRecord,
                skip: skip || 0,
                take: take || 10
            }
        }
    }

    private getFileName(url: string) {
        return url.substring(url.lastIndexOf('/') + 1);
    }
}
