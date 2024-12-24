import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';

/**
 * CRUD
 * Create -> POST -> Create a message
 * Read -> GET -> Read all messages
 * Read -> GET -> Read only one message
 * Update -> PATCH / PUT -> Update a message
 * Delete -> DELETE -> Delete a message
 */

/**
 * PATCH X PUT
 * PATCH - is used to update only one resource/one object part
 * PUT - is used to update all the object (send all the object)
 */

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  // Find all messages
  @HttpCode(HttpStatus.OK) // Change the HttpCode when returning
  @Get()
  findAll(@Query() pagination: any) {
    const { limit = 10, offset = 0 } = pagination;
    // return `This route returns all messages paginated. Limit=${limit}, Offset=${offset}`;
    return this.messageService.findAll();
  }

  // Find one message
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(id);
  }

  // Create a message
  @Post()
  create(@Body() body: any) {
    return this.messageService.create(body);
  }

  // Update a message
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.messageService.update(id, body);
  }

  // Delete a message
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }
}
