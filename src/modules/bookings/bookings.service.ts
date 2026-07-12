import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { ServicesService } from '../services/services.service';
import { BookingStatus } from './enums/booking-status.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private servicesService: ServicesService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const bookingDate = new Date(
      `${createBookingDto.bookingDate}T${createBookingDto.bookingTime}`
    );

    const now = new Date();

    if (bookingDate < now) {
      throw new BadRequestException('Booking dates cannot be in the past');
    }

    await this.servicesService.findOne(createBookingDto.serviceId);

    const existingBooking = await this.bookingsRepository.findOne({
      where: {
        serviceId: createBookingDto.serviceId,
        bookingDate: createBookingDto.bookingDate,
        bookingTime: createBookingDto.bookingTime,
        status: BookingStatus.CONFIRMED,
      },
    });

    if (existingBooking) {
      throw new ConflictException(
        'This time slot is already booked for this service'
      );
    }

    const booking = this.bookingsRepository.create(createBookingDto);

    return this.bookingsRepository.save(booking);
  }

  async findAll(status?: BookingStatus): Promise<Booking[]> {
    if (status) {
      return this.bookingsRepository.find({
        where: { status },
        relations: { service: true },
      });
    }

    return this.bookingsRepository.find({
      relations: { service: true },
    });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: { service: true },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async updateStatus(
    id: string,
    updateBookingStatusDto: UpdateBookingStatusDto,
  ): Promise<Booking> {
    const booking = await this.findOne(id);

    if (
      booking.status === BookingStatus.CANCELLED &&
      updateBookingStatusDto.status === BookingStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'Cancelled bookings cannot be marked as completed'
      );
    }

    booking.status = updateBookingStatusDto.status;

    return this.bookingsRepository.save(booking);
  }

  async cancel(id: string): Promise<Booking> {
    const booking = await this.findOne(id);

    booking.status = BookingStatus.CANCELLED;

    return this.bookingsRepository.save(booking);
  }
}