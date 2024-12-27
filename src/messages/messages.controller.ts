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
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Request } from 'express';
import { IsAdminGuard } from 'src/common/guards/is-admin.guard';

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

/**
 * DTO -> Data Transfer Object
 * DTO -> Objeto simples -> Validar dados / Transformar dados (NestJS)
 */

@UseGuards(IsAdminGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  // Find all messages
  @HttpCode(HttpStatus.OK) // Change the HttpCode when returning
  @Get()
  async findAll(@Query() paginationDto: PaginationDto, @Req() req: Request) {
    console.log('RecadosController', req['user']);
    // return `This route returns all messages paginated. Limit=${limit}, Offset=${offset}`;
    return await this.messageService.findAll(paginationDto);
  }

  // Find one message
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.messageService.findOne(id);
  }

  // Create a message
  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  // Update a message
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(id, updateMessageDto);
  }

  // Delete a message
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.messageService.remove(id);
  }
}
