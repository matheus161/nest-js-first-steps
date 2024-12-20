import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

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
  // Find all messages
  @HttpCode(HttpStatus.OK) // Change the HttpCode when returning
  @Get()
  findAll() {
    return 'This route returns all messages';
  }

  // Find one message
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This route returns only one message with id: ${id}`;
  }

  // Create a message
  @Post()
  create(@Body() body: any) {
    return body;
  }

  // Update a message
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return { id, ...body };
  }
}
