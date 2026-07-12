import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Query, 
  UseGuards 
} from '@nestjs/common';

import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { BookingStatus } from './enums/booking-status.enum';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService
  ) {}

  // Customers can create bookings without authentication
  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }


  // Get all bookings (optional status filter)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiQuery({ 
    name: 'status', 
    required: false, 
    enum: BookingStatus, 
    description: 'Filter bookings by status' 
  })
  findAll(
    @Query('status') status?: BookingStatus
  ) {
    return this.bookingsService.findAll(status);
  }


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
    return this.bookingsService.findOne(id);
  }


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto
  ) {
    return this.bookingsService.updateStatus(
      id,
      updateBookingStatusDto
    );
  }


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id/cancel')
  cancel(
    @Param('id') id: string
  ) {
    return this.bookingsService.cancel(id);
  }
}