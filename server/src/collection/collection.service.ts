import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto';

@Injectable()
export class CollectionService {
    constructor() { }

    public async create(input: CreateCollectionDto) {
        const { description, isPrivate, name, slug } = input
    }
}
