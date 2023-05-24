import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Res, Query, Req } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Permission } from 'src/common/decorator';
import { Permissions } from 'src/constant';
import { Response, Request } from 'express';
import { CategoryCreateDto, CategoryUpdateDto, SetCategoryParentDto } from './dto';
import { PaginationDto } from 'src/common/dto';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) { }

    @Post("create")
    @Permission(Permissions.CreateCategory)
    async createCategory(@Req() req: Request, @Body() dto: CategoryCreateDto, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.categoryService.create(dto, userId)
        res.json({ response })
    }

    @Get(":id")
    @Permission(Permissions.ReadCategory)
    async getCategory(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.categoryService.category(id)
        res.json({ response })
    }

    @Delete("delete/:id")
    @Permission(Permissions.DeleteCategory)
    async deleteCategory(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.categoryService.delete(id)
        res.json({ response })
    }

    @Put("update/:id")
    @Permission(Permissions.UpdateCategory)
    async editCategory(@Req() req: Request, @Body() dto: CategoryUpdateDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.categoryService.update(dto, id, userId)
        res.json({ response })
    }

    @Get()
    async getCategories(@Query() pagination: PaginationDto, @Res() res: Response) {
        const response = await this.categoryService.categories(pagination);
        return res.json({ response });
    }

    @Get('children/:id')
    @Permission(Permissions.ReadCategory)
    async categoriesChildren(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.categoryService.categoriesChildren(id);
        return res.json({ response });
    }

    @Put("remove-category-parent/:id")
    @Permission(Permissions.UpdateCategory)
    async removeCategoryParent(@Req() req: Request, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.categoryService.removeCategoryParent(id, userId)
        res.json({ response })
    }
}
