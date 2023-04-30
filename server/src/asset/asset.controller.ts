import { Controller, Post, Res, UseInterceptors, UploadedFiles, Param, ParseIntPipe, Get, Delete, Put, Body, Query } from '@nestjs/common';
import { AssetService } from './asset.service';
import { Response } from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UpdateAssetDto } from './dto';
import { PaginationDto } from 'src/common/dto';

@Controller('asset')
export class AssetController {
    constructor(
        private readonly assetService: AssetService
    ) { }

    @Post('/upload')
    @UseInterceptors(AnyFilesInterceptor())
    async upload(@UploadedFiles() files: Array<Express.Multer.File>, @Res() res: Response) {
        const response = await this.assetService.upload(files);
        return res.json({ response });
    }

    @Get('/single/:id')
    async getSingle(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.assetService.getAsset(id);
        return res.json({ response });
    }

    @Delete('/delete/:id')
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.assetService.delete(id);
        return res.json({ response });
    }

    @Put('/update/:id')
    async update(@Body() dto: UpdateAssetDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.assetService.update(id, dto);
        return res.json({ response });
    }

    @Get('/list')
    async getList(@Query() pagination: PaginationDto, @Res() res: Response) {
        const response = await this.assetService.getAssets(pagination);
        return res.json({ response });
    }
}
