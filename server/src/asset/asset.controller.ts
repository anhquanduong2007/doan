import { Controller, Post, Res, UseInterceptors, UploadedFiles, Param, ParseIntPipe, Get, Delete, Put, Body, Query, Req } from '@nestjs/common';
import { AssetService } from './asset.service';
import { Response, Request } from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/common/dto';
import { AssetUpdateDto } from './dto';
import { Permission } from 'src/common/decorator';
import { Permissions } from 'src/constant';

@Controller('asset')
export class AssetController {
    constructor(
        private readonly assetService: AssetService
    ) { }

    @Post('/upload')
    @Permission(Permissions.CreateAsset)
    @UseInterceptors(AnyFilesInterceptor())
    async upload(@Req() req: Request, @UploadedFiles() files: Array<Express.Multer.File>, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.assetService.upload(files, userId);
        return res.json({ response });
    }

    @Get(':id')
    @Permission(Permissions.ReadAsset)
    async getAsset(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.assetService.asset(id);
        return res.json({ response });
    }

    @Delete('/delete/:id')
    @Permission(Permissions.DeleteAsset)
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.assetService.delete(id);
        return res.json({ response });
    }

    @Put('/update/:id')
    @Permission(Permissions.UpdateAsset)
    async update(@Req() req: Request, @Body() dto: AssetUpdateDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.assetService.update(dto, id, userId);
        return res.json({ response });
    }

    @Get()
    @Permission(Permissions.ReadAsset)
    async getAssets(@Query() pagination: PaginationDto, @Res() res: Response) {
        const response = await this.assetService.assets(pagination);
        return res.json({ response });
    }
}
