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
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IsAdminGuard } from 'src/common/guards/is-admin.guard';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { RoutePolicyGuard } from 'src/auth/guards/route-policy.guard';
import { SetRoutePolicy } from 'src/auth/decorators/set-route-policy.decorator';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';

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

@UseGuards(RoutePolicyGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  // Find all messages
  @HttpCode(HttpStatus.OK) // Change the HttpCode when returning
  @Get()
  @SetRoutePolicy(RoutePolicies.findAllRecados)
  async findAll(@Query() paginationDto: PaginationDto) {
    // return `This route returns all messages paginated. Limit=${limit}, Offset=${offset}`;
    return await this.messageService.findAll(paginationDto);
  }

  // Find one message
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.messageService.findOne(id);
  }

  // Create a message
  @UseGuards(AuthTokenGuard)
  @Post()
  create(
    @Body() createMessageDto: CreateMessageDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messageService.create(createMessageDto, tokenPayload);
  }

  // Update a message
  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateMessageDto: UpdateMessageDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messageService.update(id, updateMessageDto, tokenPayload);
  }

  // Delete a message
  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(
    @Param('id') id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messageService.remove(id, tokenPayload);
  }
}
