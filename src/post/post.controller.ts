import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    console.log(createPostDto);
    return this.postService.create(createPostDto);
  }

  @Get('inventory')
  getInventory() {
    return this.postService.getInventory();
  }

  @Get('warranty')
  historyWarranty() {
    return this.postService.getWarrantyHistory();
  }

  @Get()
  findAll(@Query() queryPostDto: QueryPostDto) {
    return this.postService.find(queryPostDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id);
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
